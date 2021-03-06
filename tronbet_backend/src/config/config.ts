let prdCfg = {};
try {
  prdCfg = require('/data/tronbet_config/config');
} catch (error) {
  console.log('using app config');
}

// default config
module.exports = {
  workers: 1,
  port: prdCfg.port.tronbet_backend,
  redisHost: 'localhost',
  redisPort: 6379,
  redisPwd: '',
  goodsRate: [10000, 20000, 30000, 33000, 36000, 36900, 37800, 38076, 38352, 38628],
  hashkey: 'this.promise(i++)',
  nodepay: prdCfg.master_full,
  fullNode: prdCfg.master_full,
  solidityNode: prdCfg.master_solidity,
  eventServer: prdCfg.master_event,
  suitPrices: { 3: 9, 5: 30, 7: 120, 10: 540 },
  suitScore: { 3: 1, 5: 5, 7: 30, 10: 160 },
  goodPrices: [2.7, 2.7, 2.7, 10, 10, 43, 43, 132, 132, 132],
  publicKeyHex: '41D6E0B756AFC9CABBC9B880EDCCCF22078F45DF5D', // useless
  tronChristmasActAddress: '41e4d7994f46df4322db5e170f25cc7f8f19d230db', // useless
  scoreRankAward: [15000, 10000, 7000, 6000, 5000, 4000, 3800, 3600, 3400, 3200, 3000, 2800, 2600, 2400, 2200, 2000, 1800, 1600, 1400, 1200, 1000, 1000, 1000, 1000, 1000, 800, 800, 800, 800, 800, 600, 600, 600, 600, 600, 500, 500, 500, 500, 500, 400, 400, 400, 400, 400, 300, 300, 300, 300, 300]
};
