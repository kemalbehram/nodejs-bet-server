const {getdayList, getTimeFormat, newUtcTime, raw} = require('./../utils/dbutils')
const dailyDAU = require('./dailyDAU')
const dailyAmount = require('./dailyAmount')

const addAllData = async function (day_str, data_str, ts) {
    const sql = `insert into tron_bet_admin.sum_dice_data(type,day_str,data_str,ts) values ('all',?,?,?)`
    await raw(sql, [day_str, data_str, ts])
}

const processAllData = async function (startDate, endDate) {
    const c = getdayList(startDate, endDate)
    for (let i = 0; i < c.length - 1; i++) {
        let start = getTimeFormat(c[i])
        let end = getTimeFormat(c[i + 1])
        // console.log(getTimeFormat(start),getTimeFormat(end))
        const dau = await dailyDAU.getData(start, end)
        //数据过大，生产暂时无法计算
        // const totalUsers = await dailyDAU.getData('2019-01-01',now)
        const totalAddr = await dailyDAU.getTotalAddr(end)
        const amount = await dailyAmount.getData(start, end)
        const o = {
            day: start,
            dau: dau,
            totalAddr: totalAddr,
        }
        Object.assign(o, amount)
        const data_str = JSON.stringify(o)
        //
        const day_str = o.day
        const ts = newUtcTime(day_str).getTime()
        await addAllData(day_str, data_str, ts);
    }
}

const queryAllData = async function (startDate, endDate) {
    const sql = `select * from tron_bet_admin.sum_dice_data where type = 'all' and ts >= ? and ts < ? order by ts desc`
    const params = [
        newUtcTime(startDate).getTime(),
        newUtcTime(endDate).getTime()
    ]
    const rs = await raw(sql, params)
    const r = []
    rs.forEach(e => {
        const tmp = e.data_str || ""
        const t = JSON.parse(tmp.trim())
        r.push(t)
    })
    return r
}

const queryAllDataFile = async function (startDate, endDate) {
    const data = await queryAllData(startDate, endDate)
    const keys = Object.keys(data[0])
    let sbody = ''
    keys.forEach(e => {
        sbody += e + "\t"
    })
    sbody = sbody.trim()
    sbody += "\n"
    //
    data.forEach(e => {
        keys.forEach((k) => {
            let t = e[k] || 0
            sbody = sbody + t + '\t'
        })
        sbody = sbody.trim()
        sbody += '\n'
    })
    return sbody
}


module.exports = {
    processAllData,
    queryAllData,
    queryAllDataFile,
}