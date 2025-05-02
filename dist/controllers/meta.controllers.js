"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getMetaForAnalytics: ()=>getMetaForAnalytics,
    getMetaForUserAnalyticsByID: ()=>getMetaForUserAnalyticsByID
});
const _services = require("../services");
const getMetaForAnalytics = async (req, res, next)=>{
    try {
        const allMetaData = await _services.MetaService.findMetaData();
        const investmentMeta = await _services.InvestmentService.getInvestmentMeta();
        const totalUsersCount = await _services.UserService.getUsersCount();
        const totalTokens = Number(allMetaData['totalToken']);
        const totalTokensAmount = Number(allMetaData['totalTokenAmount']);
        const hardCap = Number(allMetaData['hardCap']);
        const softCap = Number(allMetaData['softCap']);
        const icoTimeout = allMetaData['icoTimeout'];
        const tokenSold = Number(investmentMeta['tokensSold']);
        const TotalInvestedAmount = Number(investmentMeta['investmentAmount']);
        const tokenRemaining = totalTokens - tokenSold;
        const metaValues = {
            'totalTokens': totalTokens,
            'totalTokensAmount': totalTokensAmount,
            'hardCap': hardCap,
            'softCap': softCap,
            'icoTimeout': icoTimeout,
            'tokenSold': tokenSold,
            'tokenRemaining': tokenRemaining,
            'TotalInvestedAmount': TotalInvestedAmount,
            'totalUsers': totalUsersCount
        };
        res.status(200).json({
            data: metaValues,
            message: 'metaData'
        });
    } catch (error) {
        next(error);
    }
};
const getMetaForUserAnalyticsByID = async (req, res, next)=>{
    try {
        const userId = Number(req.params.id);
        const UserInvestmentMeta = await _services.UserService.getUserInvestmentData(userId);
        const userInvestmentAmount = Number(UserInvestmentMeta['userInvestmentAmount']);
        const userTokensSold = Number(UserInvestmentMeta['userTokensSold']);
        const metaValues = {
            'totalInvestment': userInvestmentAmount,
            'totalTokensPurchased': userTokensSold
        };
        res.status(200).json({
            data: metaValues,
            message: 'metaData'
        });
    } catch (error) {
        next(error);
    }
};

//# sourceMappingURL=meta.controllers.js.map