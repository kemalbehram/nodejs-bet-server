const path = require('path');

let prdCfg = {};
try {
  prdCfg = require('/data/tronbet_config/config_test');
} catch (error) {
  console.log('using app config');
}

let config = {
  env: 'test',
  debug: false,
  app: {
    http_port: prdCfg.port.tronlive_emserver,
    logPath: path.resolve(__dirname, '../../logs'),
    log: true, //开启日志,
    randomSalt: 'hi,can-you-hear-me?'
  },
  mysqlConfig: {
    db_host: prdCfg.mysql.host,
    db_port: prdCfg.mysql.port,
    db_name: 'tron_live',
    db_user: prdCfg.mysql.user,
    db_pwd: prdCfg.mysql.pwd,
    connectionLimit: 30
  },
  redisConfig: {
    host: '127.0.0.1',
    port: 6379,
    db: 1,
    pwd: ''
  },
  tronConfig: {
    privateKey: prdCfg.operatorLive_pk,

    masterFullNode: prdCfg.master_full,
    masterSolidityNode: prdCfg.master_solidity,
    masterEventNode: prdCfg.master_event,

    slaveFullNode: prdCfg.slave_full,
    slaveSolidityNode: prdCfg.slave_solidity,
    slaveEventNode: prdCfg.slave_event
  },
  EveryMatrix: {
    LoginName: prdCfg.EveryMatrix.LoginName,
    Password: prdCfg.EveryMatrix.Password
  },
  event:{
    // 2020-06-15 00:00:00
    ACTIVITY_START_TS: 1592150400000,
    // 2020-06-16 23:59:59
    ACTIVITY_END_TS: 1592323199000
  }
};

module.exports = config;
