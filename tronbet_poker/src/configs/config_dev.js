//仅根据开发环境覆盖相应字段即可
const path = require('path');

let config = {
  env: 'development', //开发环境设为development
  debug: true, //开发环境设为true
  app: {
    logPath: path.resolve(__dirname, '../../logs'),
    log: true, //开启日志
    clearLog: true, //启动日志清理
    port: 18070
  },
  mysqlConfig: {
    //wzc本机测试
    db_host: '127.0.0.1',
    db_port: '3306',
    db_name: 'tronbet_poker_log',
    db_user: 'root',
    db_pwd: '123456'
  },

  redisConfig: {
    host: '127.0.0.1',
    port: 6379,
    db: 1,
    pwd: ''
  },
  mongoConfig: {
    //wzc本机测试
    host: 'localhost',
    port: 27017,
    db: 'poker11',
    user: 'poker11',
    pwd: '123456'
  },
  userInfoUrl: 'http://3.15.85.91:18050/beter/userOverViewInfo?addr=',

  tronConfig: {
    tronNode: [
      {
        fullUrl: 'https://testhttpapi.tronex.io',
        solidityUrl: 'https://testhttpapi.tronex.io',
        priority: 1
      },
      {
        fullUrl: 'https://testhttpapi.tronex.io',
        solidityUrl: 'https://testhttpapi.tronex.io',
        priority: 2
      },
      {
        fullUrl: 'https://testhttpapi.tronex.io',
        solidityUrl: 'https://testhttpapi.tronex.io',
        priority: 3
      }
    ],
    // 聊天，发言，可以全局广播
    addrAdmins: ['TS3u31e3bjAtAB9CnKLJ9EVUbhk8wePtog', 'TAHAyhFkRz37o6mYepBtikrrnCNETEFtW5'],

    defaultPk: 'e50c19fc82723d11d3d5fdbc5b4c69b3617945499600456793070ceafd9c3d07', // ***

    beginBlockNumber: 1614394,

    // TronBetTexas
    TRON_TEXAS_PAY_ADDR: '41afe9bc76f626c83db67a982b1f08b49b72fc9c2a',
    // TronBetTexasJackpot
    TRON_TEXAS_JACKPOT_ADDR: '412b46030a69de541beecce77a13097a5feceb31f8'
  },

  // 比赛桌配置  暂时不用，保留
  cupConfig: {
    cupGame: false, // 是否开启比赛
    tableId: 906001, // 比赛桌号
    // 参赛选手地址名单
    // staff hammer weather useless vapor trap misery crowd issue donkey relax eight
    addrPlayers: {
      'TFPs7sdeQsEae95SAQbo8pwzTBinuPwkWR': { name: 'Bluffing Ankles', head: '30001', lv: 99, seatNo: 0 }, // Spencer Dinwiddie
      'TRqvMZKjFVET2A3bSaDE3wB4mAWp63fX94': { name: 'The Announcer', head: '30002', lv: 99, seatNo: 1 }, // Justin Sun
      'TYWxzUL4kr5e398KZTbuS6WeUo8azF4JYR': { name: 'SAFU Master', head: '30003', lv: 99, seatNo: 2 }, // CZ
      'TXEtHyuS2PoikSF7oRpUT6ZBJpmQdqEHMA': { name: 'SlayerS_BoxeR', head: '30004', lv: 99, seatNo: 3 }, // Lim Yo-hwan
      'TVEBd9DsFehG26s4pMVkQzUsEYnFuXecKh': { name: 'Bidder', head: '30005', lv: 99, seatNo: 4 }, // ?? Bidder ??
      'TGjQTVt3vExZjUkxa2DzhPnVjZZ6FAmiVq': { name: 'Bitizen', head: '30006', lv: 99, seatNo: 5 }, // Jared
      'TGCSwZC621EcbmgiiY1RBX8wskT1KGpukt': { name: "dApp'n Dude", head: '30007', lv: 99, seatNo: 6 }, // Vincent
      'TRJJgBX63GRcbmu9TWSUAk3YNrUnFx1Npg': { name: 'Litening', head: '30008', lv: 99, seatNo: 7 }, // Charlie Lee
      'TUeUnuL3dMhKCw8LJSSa4dvrUQdWfMKCNi': { name: 'The Mustache', head: '30009', lv: 99, seatNo: 8 } // Tommy Mustache
    },
    // 慈善杯比赛可以看牌，现在已经不用
    addrVIPs: ['TGKpnHx8RrnmFdJ27Cc4aqV7CH329RqFs5', 'THMtaKo6v62cvY1dQDbTEetL8yc1RoYEXo', 'TSCMZFvbPtNqnTskhJ1jmZ1gMsZP3aAsR5', 'TJDbSqba4LYsJL9nwndnHN5eZnDM3hwd1b'], //裁判员(aj)
    addrGMs: ['TGKpnHx8RrnmFdJ27Cc4aqV7CH329RqFs5'], //管理员/GM(blizzard)
    startTs: 1560528000000, //2019/6/15 00:00:00 //默认比赛开始时间
    endTs: 1560535200000 //2019/6/15 02:00:00 //默认比赛结束时间
  },
  //现金桌配置
  cashConfig: {
    endTs: 0, //2019/6/14 23:30:00 //默认现金桌停服时间
    feeRate: 0.05, //抽成比例
    minPlayers: 2, //最小开启游戏人数
    high_score_mode: false //高分模式(测试用)
  },
  //SNG配置
  sngConfig: {
    feeRate: [0.1, 0.08, 0.075, 0.05, 0.025], //抽成比例
    SNG_RESET_CD: 60000, //SNG 牌桌重置CD(毫秒)
    SNG_BB_LV_CD: 60000 //SNG 升盲CD(毫秒)
  },
  event:{
    // 2020-06-15 00:00:00
    ACTIVITY_START_TS: 1592150400000,
    // 2020-06-16 23:59:59
    ACTIVITY_END_TS: 1592323199000
  }
};

module.exports = config;
