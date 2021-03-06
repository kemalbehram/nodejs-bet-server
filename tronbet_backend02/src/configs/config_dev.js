const fs = require('fs');
const path = require('path');
let config = {
    env: 'dev',
    debug: false,
    app: {
        http_port : 18056,
        websocket_port: 9012,
        logPath: path.resolve(__dirname, '../../logs'),
        log: true, //开启日志,
        withdrawMaxTimes : 100,   //每天最大提取次数
        withdrawMaxAmount: 1000000000000,   // 每次最大提取数量
        randomSalt : 'hi,can-you-hear-me?',
        RankInitTs : 1555646400,
        rankRate : [
            47.887,
            23.943,
            11.972,
            5.986,
            2.993,
            1.496,
            1.197,
            0.958,
            0.766,
            0.613,
            0.490,
            0.392,
            0.314,
            0.251,
            0.201,
            0.161,
            0.129,
            0.103,
            0.082,
            0.066,
        ]
    },
    mysqlConfig: {
        db_host: 'localhost',
        db_host2: 'localhost',
        db_port: '3306',
        db_name: 'tron_bet_admin',
        db_name2: 'tron_live',
        db_user: 'root',
        db_pwd: '123456',
        connectionLimit : 5,
    },
    redisConfig: {
        host: '127.0.0.1',
        port: 6379,
        db: 1,
        pwd: 'tronbet_201811'
    },
    tronConfig: {
        privateKey : '12312312312312312',

        withdrawAddr : '413a01c8450e55454ece8ab75f25494a9aa8391786',
        livePoolAddr : '416dd58ffa37007d861f5d5455b21c273f15fa9f69',

        masterFullNode : 'https://api.trongrid.io',
        masterSolidityNode : 'https://api.trongrid.io',
        masterEventNode : 'https://api.trongrid.io',
        
        slaveFullNode : 'https://api.trongrid.io',
        slaveSolidityNode : 'https://api.trongrid.io',
        slaveEventNode : 'https://api.trongrid.io',
    },
    EveryMatrix : {
        LoginName : 'EMOpenUser2019',
        Password : 'EM!@#avg$,^&*()_2019'
    }
}

if (process.env.NODE_ENV === 'production' && fs.existsSync(__dirname + '/config.js')) { //生产环境
    console.log('>>>Use production config!');
} else if (process.env.NODE_ENV === 'development' && fs.existsSync(__dirname + '/config_dev.js')) { //开发环境
    config = Object.assign(config, require('./config_dev.js'));
} else {
    config = Object.assign(config, require('./config_dev.js'));
}

module.exports = config;
