const {spawn} = require("child_process");
const redisUtils = require('../utils/redisUtil');
const reStartLiveDiv = async function () {
    console.log("----pm2restart---->", new Date());
    const ls = spawn("pm2", ["restart", "tronlive_dividends_trc20"]);
    //
    const desc = 'liveUsdtRestart'
    ls.stdout.on("data", data => {
        console.log(`${desc}输出：${data}`);
    });

    ls.stderr.on("data", data => {
        console.log(`${desc}错误：${data}`);
    });

    ls.on("close", code => {
        console.log(`${desc}子进程退出码：${code}`);
    });
}
const schedule = require('node-schedule');
const db = require('../utils/dbUtil')

const raw = async function (sql, params) {
    console.log(sql)
    console.log(params)
    const data = await db.exec(sql, params)
    return data
}
//live_trc20_div_info
//live_trc20_div_detail
const queryDivInfo = async function () {
    let start = new Date();
    start.setUTCMinutes(0)
    start.setUTCSeconds(0)
    start.setUTCMilliseconds(0)
    const now = start.getTime() / 1e3
    //
    let sql = 'select created_at from tron_live.live_trc20_div_info where created_at >= ?';
    const data = await raw(sql, [now])
    //
    if (data.length > 0) {
        //分红正常
        console.log("queryDivInfo normal!", new Date().toUTCString())
    } else {
        //
        console.log("queryDivInfo reStartLiveDiv!", new Date().toUTCString())
        await reStartLiveDiv()
    }
}


const queryDivIfComplete = async function (type) {
    let start = new Date();
    start.setUTCMinutes(0)
    start.setUTCSeconds(0)
    start.setUTCMilliseconds(0)
    const now = start.getTime() / 1e3
    //
    let sql = 'select created_at from tron_live.live_trc20_div_info where created_at >= ? and div_state = ?';
    const data = await raw(sql, [now, type])
    //
    if (data.length > 0) {
        //分红正常
        const roundTmp = data[0].round
        const round = Number(roundTmp)
        if (!isNaN(round)) {
            let sql = 'select count(1) as count from live_trc20_div_detail where round = ?';
            const countInfo = await raw(sql, [round])
            const count = countInfo[0].count || 0
            const min = new Date().getUTCMinutes()
            console.log("live_trc20_div_detail count is: ", count, ', min is', min)
            if (min > 6 && min <= 12 && count <= 2750) {
                return true
            } else if (min > 12 && min < 18 && count <= 5000) {
                return true
            } else if (min >= 18 && min < 26 && count <= 9000) {
                return true
            }
        }
    } else {
        console.log(`queryDivIfComplete_${type} reStartLiveDiv!`, new Date().toUTCString())
        await reStartLiveDiv()
    }
}

const compareDate = async function () {
    // 5分钟检查一下12点后是否正常
    await queryDivInfo()
    //
    const min = new Date().getUTCMinutes()
    if (min > 6 && min <= 27) {
        //判断条数
        await queryDivIfComplete('1')
    } else if (min >= 27 && min <= 59) {
        //25分钟后判断是否完成，or restart
        await queryDivIfComplete('2')
    }
}


const divSchedule = function () {
    // 4点，即12点profit的时候
    const a1 = schedule.scheduleJob('*/5 4-5 * * *', async function () {
        await compareDate()
    })
    // 16点，即24点profit的时候
    const b1 = schedule.scheduleJob('*/5 16-17 * * *', async function () {
        await compareDate()
    })
}


module.exports = divSchedule
