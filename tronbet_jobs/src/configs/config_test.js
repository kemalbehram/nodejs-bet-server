const path = require('path');

module.exports = {
	TronWeb:{
		nodes:['master','slave'],//TronWeb 节点
		IGNORE_SOLIDITY_NODE_SCAN: true, //忽略检测静态节点状态
		SCAN_NODE_INTERVAL: 3100, //node 扫描间隔(ms)
		HTTP_TIME_OUT: 5000 //node http request 超时时间(ms)
	},
	dbName:'tron_live_new',
	redisConfig: {
	    host: '127.0.0.1',
	    port: 6379,
	    db: 1,
	    pwd: ''
        }
};
