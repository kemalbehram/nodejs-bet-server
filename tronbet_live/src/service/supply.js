const {
    insertLiveGame, getLiveRaw, updateLiveGame, getOnlineGameInfo, offlineLiveGameByUUID, editOnlineGameInfo, updateGameRate
} = require('../model/newGameList')
const {depositData, reissueRecord} = require('../model/deposit')
const RefreshRateUtils = require('../model/refreshRate')
const {insertGameSchedule, getScheduleList, deleteGameSchedule} = require('../dailyschedule/productRateSchedule')
const game = require("../service/games");
const {app} = require('../configs/config')
const {cpConfigKey, getCpToken} = require('../cp/cpTokenUtils')
const redisUtils = require('../utils/redisUtil')
const oldAccount = require("./user")
const TronWeb = require('tronweb')
const common = require('../utils/common')
const tronUtils = require('../utils/tronUtil')
//
async function updateOnlineGameList() {
    let games = await game.parseGames();
    await redisUtils.hset("tronlive:gamelist", "games", JSON.stringify(games));
    console.log(games);
}

async function queryDepositTmp(ctx) {
    let params = ctx.request.query
    let address = params.address || ''
    if (address === '') {
        return ctx.body = {
            code: 500,
            message: "address is empty."
        }
    }
    if (Object.prototype.toString.call(address) !== "[object String]") {
        const msg = 'params is error,please check with your address!'
        return ctx.body = {code: 500, message: msg}
    }
    //
    console.log(params)
    const data = await depositData(address)
    return ctx.body = {
        code: 200,
        data: data
    }
}

async function getReissueRecord(ctx) {
    const data = await reissueRecord()
    return ctx.body = {
        code: 200,
        data: data
    }
}

async function addGames(ctx) {
    //vendor, game_id, game_name, type
    let body = ctx.request.body || {}
    Object.keys(body).forEach(e => body[e] = body[e] || '')
    console.log("addGames params is", body)
    const {vendor, game_id, game_name, em_type, rate} = body
    //
    const arr = ['slots', 'table', 'live']
    if (vendor === "em" && !arr.includes(em_type)) {
        return ctx.body = {code: 500, message: "param em type is error"}
    }
    if (isNaN(Number(rate))) {
        const msg = 'params rate is error,please check with your params!'
        return ctx.body = {code: 500, message: msg}
    }
    try {
        let tmp = await insertLiveGame(vendor, game_id, game_name, em_type, rate)
        let num = tmp.affectedRows
        //
        return ctx.body = {code: 200, message: "success", data: num}
    } catch (e) {
        return ctx.body = {code: 500, message: e.toString()}
    }
}

async function editGame(ctx) {
    let query = ctx.request.query || {}
    console.log("edit params is", query)
    let id = query.id || ''
    if (query === '') {
        return ctx.id = {code: 500, message: "id is empty."}
    }
    //
    const data = await editOnlineGameInfo(id)
    ctx.body = {
        code: 200,
        message: "success",
        data: data
    }
}

async function updateGames(ctx) {
    let body = ctx.request.body || {}
    const args = ['vendor', 'game_id', 'game_name', 'em_type', 'status', 'rate', 'id', 'is_new']
    let p = {}
    args.forEach(e => p[e] = body[e] || '')
    p.is_new = p.is_new || '0'
    //
    if (isNaN(Number(p.rate))) {
        return ctx.body = {code: 500, message: "param rate is error"}
    }
    //
    try {
        const num = await updateLiveGame(p)
        const number = num.affectedRows
        //刷新 redis
        let rateParam = {
            gameId: p.game_id,
            name: p.game_name,
        }
        if (p.vendor === "hub88") {
            await RefreshRateUtils.refreshHub88(rateParam)
        } else if (p.vendor === "em") {
            await RefreshRateUtils.refreshEM(rateParam)
        } else if (p.vendor === "platius") {
            await RefreshRateUtils.refreshPlatius(rateParam)
        }
        return ctx.body = {code: 200, message: "success", data: number}
    } catch (e) {
        return ctx.body = {code: 500, message: e.toString()}
    }
}

async function updateRateById(ctx) {
    let body = ctx.request.body || {}
    const id = body.id || ''
    if (id === '') {
        return ctx.body = {code: 500, message: "param game_id is error"}
    }
    const row = await editOnlineGameInfo(id)
    if (row.length === 0) {
        return ctx.body = {code: 500, message: "param id is error"}
    }
    //
    try {
        const data = row[0] || {}
        //刷新 redis
        let rateParam = {
            gameId: data.game_id,
            name: data.game_name,
            rate: data.rate
        }
        if (data.vendor === "hub88") {
            await RefreshRateUtils.refreshHub88(rateParam)
        } else if (data.vendor === "em") {
            await RefreshRateUtils.refreshEM(rateParam)
        } else if (data.vendor === "platius") {
            await RefreshRateUtils.refreshPlatius(rateParam)
        }
        return ctx.body = {code: 200, message: "success", data: number}
    } catch (e) {
        return ctx.body = {code: 500, message: e.toString()}
    }
}

async function offlineGames(ctx) {
    let query = ctx.request.query || {}
    console.log("removeGames params is", query)
    let id = query.id || ''
    if (id === "") {
        return ctx.body = {code: 500, message: "param id is error"}
    }
    let message = {
        code: 500,
        message: "query error,please contact to admin!"
    }
    try {
        let num = await offlineLiveGameByUUID(id)
        const number = num.affectedRows
        return ctx.body = {code: 200, message: "success", data: number}
    } catch (e) {
        message.message += e.toString()
        return ctx.body = message
    }
}

async function setRate(ctx) {
    let body = ctx.request.body || {}
    let type = body.type || ''
    if (!type === "all") {
        ctx.body = {code: 500, message: "params type error"}
    }
    try {
        await updateOnlineGameList()
        ctx.body = {code: 200, message: "success", data: 1}
    } catch (e) {
        ctx.body = {code: 500, message: e.toString()}
    }
}

async function getOnlineList(ctx) {
    let body = ctx.request.query || {}
    console.log("online list params is", body)
    let vendor = body.vendor || ''
    let em_type = body.em_type || ''
    let game_id = body.game_id || ''
    let game_name = body.game_name || ''
    //
    try {
        let data = await getLiveRaw()
        if (vendor === "hub88") {
            data = data.filter(e => e.vendor === "hub88")
        } else if (vendor === "em") {
            data = data.filter(e => e.vendor === "em")
        }
        //
        if (em_type !== "") {
            data = data.filter(e => e.em_type === em_type)
        }
        if (game_id !== "") {
            data = data.filter(e => e.game_id === game_id)
        }
        if (game_name !== "") {
            data = data.filter(e => String(e.game_name).includes(game_name))
        }
        //
        for (let e of data) {
            if (e.status === "") {
                e.status = "0"
            }
            if (Number(e.rate) > 1) {
                //新增 redis 倍率
                const vendor = e.vendor
                if (['hub88', 'em', 'platius'].includes(vendor)) {
                    let rateParam = {
                        gameId: e.game_id,
                        name: e.game_name,
                    }
                    const exeFunc = {
                        hub88: RefreshRateUtils.getRateHub88,
                        em: RefreshRateUtils.getRateEM,
                        platius: RefreshRateUtils.getRatePlatius,
                    }
                    let k = await exeFunc[vendor](rateParam)
                    e.nowRate = k.nowRate
                }
            } else {
                e.nowRate = 1
            }
        }
        // data.sort((a, b) => b.ts - a.ts)
        ctx.body = {code: 200, message: "success", data: data}
    } catch (e) {
        ctx.body = {code: 500, message: e.toString()}
    }
}

/**
 * schedule insert
 */
async function insertSchedule(ctx) {
    let params = ctx.request.body || {}
    //
    let vendor = params.vendor || ''
    const trigger_time = new Date(params.trigger_time)
    trigger_time.setUTCHours(trigger_time.getUTCHours() - 8)
    params.trigger_time = trigger_time.getTime()
    //
    try {
        const a = await insertGameSchedule(params)
        ctx.body = {code: 200, message: "success", data: a}
    } catch (e) {
        ctx.body = {code: 500, message: e.toString()}
    }
}

/**
 * schedule delete
 */
async function deleteSchedule(ctx) {
    let params = ctx.request.query || {}
    let id = params.id || ''
    if (id === "") {
        return ctx.body = {code: 500, message: "id is empty"}
    }
    const a = await deleteGameSchedule(id)
    ctx.body = {code: 200, message: "success", data: a}
}

/**
 * schedule all
 */
async function allSchedule(ctx) {
    let params = ctx.request.query || {}
    let offset = params.offset || 1
    let limit = params.limit || 20000
    const data = await getScheduleList(offset, limit)
    ctx.body = {code: 200, message: "success", data: data}
}


/**
 * schedule all
 */
async function platinusAPI(ctx) {
    let params = ctx.request.body;
    let signature = params.sign;
    let addr = params.addr;
    //
    if (!TronWeb.isAddress(addr) || signature == null) {
        return await common.sendMsgToClient(ctx, 1002, 'tron address error!!!');
    }
    //签名校验
    let signResult = await tronUtils.verifySignature(signature, addr);
    if (!signResult) {
        return await common.sendMsgToClient(ctx, 1002, 'sign verify failed!!!!!!!!!');
    }
    // 因为redis丢失数据，先改成每次获取，不缓存,过几天再关闭
    const val = getCpToken(addr, cpConfigKey.Platinus)
    //
    // const tokenRedisKey = 'TRX' + "_platinusToken_" + addr
    // let val = await redisUtils.get(tokenRedisKey)
    // console.log("platinusAPI_addr: ", addr)
    // console.log("platinusAPI_token: ", val)
    //
    // if (val === null) {
    //     try {
    //         const token = getCpToken(addr, cpConfigKey.Platinus)
    //         await redisUtils.set(tokenRedisKey, token)
    //         await redisUtils.expire(tokenRedisKey, 3 * 24 * 3600) // 设置过期时间为3天
    //         val = await redisUtils.get(tokenRedisKey)
    //     } catch (e) {
    //         return ctx.body = {code: 500, message: "fail", error: e.toString()}
    //     }
    // }
    ctx.body = {code: 200, message: "success", data: val}
}


async function getBinaryToken(ctx) {
    let params = ctx.request.body || {}
    let currency = params.currency || ''
    let signature = params.sign;
    let addr = params.addr;
    //
    if (!TronWeb.isAddress(addr) || signature == null) {
        return await common.sendMsgToClient(ctx, 1002, 'tron address error!!!');
    }
    //签名校验
    let signResult = await tronUtils.verifySignature(signature, addr);
    if (!signResult) {
        return await common.sendMsgToClient(ctx, 1002, 'sign verify failed!!!!!!!!!');
    }
    if (!['TRX', 'USDT'].includes(currency)) {
        return ctx.body = {code: 500, message: "currency error"}
    }
    const tokenRedisKey = currency + "_BinaryToken_" + addr
    // 因为redis丢失数据，先改成每次获取，不缓存
    const val = getCpToken(addr, cpConfigKey.Binary, currency)
    //
    // let val = await redisUtils.get(tokenRedisKey)
    // console.log("tokenRedisKey: ", tokenRedisKey)
    // console.log("BinaryToken_addr: ", addr)
    // console.log("BinaryToken_token: ", val)
    // if (val === null) {
    //     try {
    //         const token = getCpToken(addr, cpConfigKey.Binary, currency)
    //         await redisUtils.set(tokenRedisKey, token)
    //         await redisUtils.expire(tokenRedisKey, 24 * 3600) // 设置过期时间为1天
    //         val = await redisUtils.get(tokenRedisKey)
    //     } catch (e) {
    //         return ctx.body = {code: 500, message: "fail", error: e.toString()}
    //     }
    // }
    ctx.body = {code: 200, message: "success", data: val}
}


module.exports = {
    queryDeposit: queryDepositTmp,
    getReissueRecord: getReissueRecord,
    addGames: addGames,
    offlineGames: offlineGames,
    setRate: setRate,
    getOnlineList: getOnlineList,
    updateGames: updateGames,
    updateRateById: updateRateById,
    editGame: editGame,
    insertSchedule: insertSchedule,
    deleteSchedule: deleteSchedule,
    allSchedule: allSchedule,
    platinusAPI: platinusAPI,
    getBinaryToken: getBinaryToken,
}