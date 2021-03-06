const db = require('../utils/dbUtil');
const _ = require('lodash')._;
const airBlackList = require("../configs/aridropBlackList")

async function getAirDropBlackListInDB() {
  let sql = `select addr from tron_live.live_balance_audit where flag = 'malicious'`;
  let res = await db.exec(sql, []);
  if (res) {
    return res.map(e => String(e.addr).trim());
  } else {
    return [];
  }
}

async function getLiveAirdropData(startTs, endTs) {
  let sql = `select addr, sum(Amount) Amount from (
  
    select sum(AddsAmount) Amount, addr from live_action_log_v2 where ts >= ? and ts < ? and action = 'bet' and txStatus = 1 and (currency = 'TRX' or currency = 'USDT') group by addr
    
    union all
    
    select sum(adAmount / 1000000) Amount, email addr from swagger_transaction_log where ts >= ? and ts < ? and status = 1 and (currency = 'TRX' or currency = 'USDT') group by email
    
    union all
    
    select sum(adAmount / 1000000) Amount, addr from platipus_transaction_log where ts >= ? and ts < ? and status = 2 and  resultId is not null and currency = 'TRX' group by addr  
 
    union all 
 
    select sum(adAmount / 1000000) Amount, addr from binary_transaction_log where expiration_date >= ? and expiration_date < ? and status = 'close' and (currency = 'TRX' or currency = 'USDT') group by addr         
    ) t group by addr
    `;
  const param = [
    startTs * 1000,
    endTs * 1000,
    startTs * 1000,
    endTs * 1000,
    startTs * 1000,
    endTs * 1000,
    startTs * 1000,
    endTs * 1000,
  ]
  try {
    let res = await db.exec(sql, param);
    console.log("getLiveAirdropData, data count:", res.length);

    let blackListInDB = await getAirDropBlackListInDB();
    console.log("getLiveAirdropData, blackList count:", blackListInDB.length);

    let data = res.filter(function (e) {
      let addr = String(e.addr).trim();
      return !airBlackList.includes(addr) && !blackListInDB.includes(addr);
    });

    console.log("getLiveAirdropData, data count after filter:", data.length);
    return data;
  }catch (e) {
    console.log("AirdropError: ",e.toString())
  }
}

async function getSportsAirdropData(startTs, endTs) {
  let sql =
    "select sum(adAmount / 1000000) Amount, addr from sports_transaction_log where ts >= ? and ts < ? and (status = 0 or status = 50 or status = 51) and (currency = 'TRX' or currency = 'USDT') group by addr";
  let res = await db.exec(sql, [(startTs - 300) * 1000, (endTs - 300) * 1000]);
  console.log("getSportsAirdropData, data count:", res.length);

  let blackListInDB = await getAirDropBlackListInDB();
  console.log("getSportsAirdropData, blackList count:", blackListInDB.length);

  let data = res.filter(function (e) {
    let addr = String(e.addr).trim();
    return !airBlackList.includes(addr) && !blackListInDB.includes(addr);
  });

  console.log("getSportsAirdropData, data count after filter:", data.length);
  return data;
}

async function liveAirdropLog(addr, startTs, endTs, betAmount, adAmount) {
  if(airBlackList.includes(addr)){
    console.log("liveAirdropLog block addr:", addr);
    return []
  }

  let sql = 'insert into live_airdrop_log(addr, startTs, endTs, betAmount, adAmount) values (?,?,?,?,?);';
  let res = await db.exec(sql, [addr, startTs, endTs, betAmount, adAmount]);
  console.log("liveAirdropLog drop to addr:", addr);
  return res;
}

async function updateAirdropLog(addr, startTs, endTs, txId) {
  let sql = 'update live_airdrop_log set txId = ? where addr = ? and startTs = ? and endTs = ?';
  let res = await db.exec(sql, [txId, addr, startTs, endTs]);
  return res;
}

async function getMaxLogId() {
  let sql = 'select max(logId) logId from live_airdrop_log';
  let res = await db.exec(sql, []);
  if (_.isEmpty(res)) return 0;
  return res[0].logId;
}

async function getMaxEndTs() {
  let sql = 'select max(endTs) endTs from live_airdrop_log';
  let res = await db.exec(sql, []);
  if (_.isEmpty(res)) return 0;
  return res[0].endTs || 0;
}

async function getAirdropFailedData(startTs) {
  let sql =
    'select addr, startTs, endTs, betAmount,adAmount, txId from live_airdrop_log where endTs <= ? and confirmedStatus = 0 order by startTs limit 200';
  let res = await db.exec(sql, [startTs]);
  return res;
}

async function updateAirdropLogConfirmed(addr, startTs, endTs) {
  let sql = 'update live_airdrop_log set confirmedStatus = 1,status = 1 where addr = ? and startTs = ? and endTs = ?';
  let res = await db.exec(sql, [addr, startTs, endTs]);
  return res;
}

async function getUserMaxEndTs(addr) {
  let sql = 'select max(endTs) endTs from live_airdrop_log where addr = ?';
  let res = await db.exec(sql, [addr]);
  if (_.isEmpty(res)) return 0;
  return res[0].endTs || 0;
}

async function getUnconfirmedCount() {
  let sql = 'select count(1) cnt from live_airdrop_log where confirmedStatus = 0';
  let res = await db.exec(sql, []);
  if (_.isEmpty(res)) return 0;
  return res[0].cnt || 0;
}

async function getLiveMakeUpAirdropData() {
  let sql = 'select addr, 0 Amount, airDropAmount from makeup_air_drop where status = 0';
  let res = await db.exec(sql, []);
  return res;
}

module.exports = {
  getLiveAirdropData,
  liveAirdropLog,
  updateAirdropLog,
  getMaxLogId,
  getMaxEndTs,
  getAirdropFailedData,
  updateAirdropLogConfirmed,
  getUserMaxEndTs,
  getUnconfirmedCount,
  getLiveMakeUpAirdropData,
  getSportsAirdropData
};
