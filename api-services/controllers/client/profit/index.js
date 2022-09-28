exports.getMetrics = require('./getMetrics.js');
exports.getSnapshot = require('./getSnapshot.js');
exports.getProducts = require('./getProducts.js');

// Breakdown
exports.getNetRevenue = require('./breakdown/getNetRevenue.js');
exports.getCost = require('./breakdown/getCost.js');
exports.getNetProfit = require('./breakdown/getNetProfit.js');
exports.getRoi = require('./breakdown/getRoi.js');
exports.getMargin = require('./breakdown/getMargin.js');
exports.getProductFees = require('./breakdown/product/getFees.js');

//History
exports.getNetRevenueHistory = require('./history/getNetRevenue.js');
exports.getNetProfitHistory = require('./history/getNetProfit.js');
exports.getCostHistory = require('./history/getCost.js');
exports.getRoiHistory = require('./history/getRoi.js');
exports.getMarginHistory = require('./history/getMargin.js');
exports.getProfitGraphHistory = require('./history/getProfitGraph.js');
