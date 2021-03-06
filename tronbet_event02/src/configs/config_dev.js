const path = require("path");

let prdCfg = {};
try {
  prdCfg = require("/Users/sid.tang/workspace/work-project/wink/nodejs-bet-server/tronbet_config/config_test");
} catch (error) {
  console.log("using app config");
}

let config = {
  env: "dev",
  debug: false,
  app: {
    http_port: 8370,
    logPath: path.resolve(__dirname, "../../logs"),
    log: true, //开启日志,
    startTs: 1579996800000, //2019-01-26 00:00:00
    endTs: 1580774400000, //2020-02-04 00:00:00
    interval: 86400000,
    randomSalt: "hi,can-you-hear-me?"
  },
  mysqlConfig: {
    db_host: prdCfg.mysql.host,
    db_port: prdCfg.mysql.port,
    db_name: "tron_bet_event",
    db_user: prdCfg.mysql.user,
    db_pwd: prdCfg.mysql.pwd,
    connectionLimit: 10
  },
  redisConfig: {
    host: "127.0.0.1",
    port: 6379,
    db: 1,
    pwd: ""
  },
  tronConfig: {
    // 这个需要确认
    // 发奖的私钥
    privateKey: prdCfg.operatorDice_pk,
    // 发奖的私钥 对应的公钥
    payPKHex: "TYmLSP22fzNNHozSXN6ANQF97zp8rhRP7K",

    masterFullNode: prdCfg.master_full,
    masterSolidityNode: prdCfg.master_solidity,
    masterEventNode: prdCfg.master_event,

    slaveFullNode: prdCfg.slave_full,
    slaveSolidityNode: prdCfg.slave_solidity,
    slaveEventNode: prdCfg.slave_event
  },
  boxConf: {
    goodsRate: [
      10000,
      20000,
      30000,
      33000,
      36000,
      36900,
      37800,
      38076,
      38352,
      38628
    ],
    suitPrices: { 3: 9, 5: 10, 7: 60, 10: 300 },
    suitScore: { 3: 4, 5: 16, 7: 100, 10: 1000 },
    goodPrices: [2.7, 2.7, 2.7, 10, 10, 43, 43, 132, 132, 132],
    lottery: { 3: 0, 5: 1, 7: 3, 10: 12 },
    lotteryRate: [
      60000,
      60000,
      500000,
      40000,
      250000,
      20000,
      1000,
      1000,
      60000,
    ]
  },
  rewards: [
    160000,
    80000,
    40000,
    20000,
    10000,
    7000,
    5000,
    4000,
    3000,
    2000,
    1000,
    1000,
    1000,
    1000,
    1000,
    800,
    800,
    800,
    800,
    800,
    600,
    600,
    600,
    600,
    600,
    500,
    500,
    500,
    500,
    500,
    400,
    400,
    400,
    400,
    400,
    300,
    300,
    300,
    300,
    300,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100
  ],
  activity:{
    startTime:'2020-06-15 00:00:00',
    endTime:'2020-06-24 23:59:59',
    publish:true,
    whiteList:[
      ''
    ],
    adminToken:'winkreadv9l4k2lHgeqlwinkXK3e2Ve6j4',
    championship: {
      startTime:'2020-06-15 00:00:00',
      endTime:'2020-06-24 23:59:59',
      top:20,
      prize:{
        1:200000,
        2:80000,
        3:30000,
        4:15000,
        5:15000,
        6:8000,
        7:8000,
        8:8000,
        9:8000,
        10:8000,
        11:3000,
        12:3000,
        13:3000,
        14:3000,
        15:3000,
        16:1000,
        17:1000,
        18:1000,
        19:1000,
        20:1000
      },
      stage:[
        {
          name:'第一阶段',
          rate:0.001,
          startTime:'2020-06-15 00:00:00',
          endTime:'2020-06-21 23:59:59'
        },
        {
          name:'第二阶段',
          rate:0.002,
          startTime:'2020-06-22 00:00:00',
          endTime:'2020-06-23 23:59:59'
        },
        {
          name:'第三阶段',
          rate:0.003,
          startTime:'2020-06-24 00:00:00',
          endTime:'2020-06-24 23:59:59'
        }
      ]
    },
    flight:{
      startTime:'2020-06-15 00:00:00',
      endTime:'2020-06-24 23:59:59',
      minAmount:40,
      rate:0.005,
      plant:[
        {
          id:0,
          name:'Earth',
          fuel:0,
          minPrize:0,
          maxPrize:0
        },
        {
          id:1,
          name:'Moon',
          fuel:10,
          minPrize:50,
          maxPrize:500
        },
        {
          id:2,
          name:'Mars',
          fuel:30,
          minPrize:150,
          maxPrize:1500
        },
        {
          id:3,
          name:'Jupiter',
          fuel:90,
          minPrize:450,
          maxPrize:4500
        },
        {
          id:4,
          name:'Saturn',
          fuel:270,
          minPrize:1350,
          maxPrize:13500
        },
        {
          id:5,
          name:'Uranus',
          fuel:810,
          minPrize:4050,
          maxPrize:40500
        },
        {
          id:6,
          name:'Neptune',
          fuel:2430,
          minPrize:12150,
          maxPrize:121500
        },
        {
          id:7,
          name:'Venus',
          fuel:7290,
          minPrize:36450,
          maxPrize:364500
        },
        {
          id:8,
          name:'Mercury',
          fuel:21870,
          minPrize:1000000,
          maxPrize:1000000
        }
      ]
    }
  }
};

module.exports = config;
