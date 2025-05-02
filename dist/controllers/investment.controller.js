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
    createInvestment: ()=>createInvestment,
    updateInvestment: ()=>updateInvestment,
    getAllInvestments: ()=>getAllInvestments,
    getAllInvestmentsByUserId: ()=>getAllInvestmentsByUserId,
    getAllInvestmentsByWalletId: ()=>getAllInvestmentsByWalletId,
    getAllInvestmentsByMinted: ()=>getAllInvestmentsByMinted,
    deleteInvestment: ()=>deleteInvestment,
    batchUpdateTransactionHash: ()=>batchUpdateTransactionHash,
    batchUpdateTransactionHashv2: ()=>batchUpdateTransactionHashv2
});
const _services = require("../services");
const _walletModel = require("../models/wallet.model");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
const createInvestment = async (req, res, next)=>{
    try {
        const investmentData = req.body;
        const walletAddress = investmentData.walletAddress;
        const wallet = await _walletModel.WalletModel.findOne({
            where: {
                walletAddress
            }
        });
        if (!wallet) {
            const walletData = await _services.WalletService.createWallet(req.user.id, walletAddress);
        }
        const createInvestmentData = await _services.InvestmentService.createInvestment(_objectSpreadProps(_objectSpread({}, investmentData), {
            walletAddress,
            userId: req.user.id
        }));
        res.status(201).json({
            data: createInvestmentData,
            message: 'created'
        });
    } catch (error) {
        next(error);
    }
};
const updateInvestment = async (req, res, next)=>{
    try {
        const investmentId = Number(req.params.id);
        const investmentData = req.body;
        const updateInvestmentData = await _services.InvestmentService.updateInvestment(investmentId, investmentData);
        res.status(200).json({
            data: updateInvestmentData,
            message: 'updated'
        });
    } catch (error) {
        next(error);
    }
};
const getAllInvestments = async (req, res, next)=>{
    try {
        const findAllInvestments = await _services.InvestmentService.findAllInvestments({
            page: parseInt(req.query.page ? req.query.page.toString() : '0'),
            pageCount: req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
            sortKey: req.query.sortKey || 'id',
            sortOrder: req.query.sortOrder || 'desc'
        });
        res.status(200).json({
            data: findAllInvestments,
            message: 'findAll'
        });
    } catch (error) {
        next(error);
    }
};
const getAllInvestmentsByUserId = async (req, res, next)=>{
    try {
        const findAllInvestmentsData = await _services.InvestmentService.findAllInvestmentsByUserId({
            userId: Number(req.params.userId),
            page: parseInt(req.query.page ? req.query.page.toString() : '0'),
            pageCount: req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
            sortKey: req.query.sortKey || 'id',
            sortOrder: req.query.sortOrder || 'desc'
        });
        res.status(200).json({
            data: findAllInvestmentsData,
            message: 'findAll'
        });
    } catch (error) {
        next(error);
    }
};
const getAllInvestmentsByWalletId = async (req, res, next)=>{
    try {
        const findAllInvestmentsData = await _services.InvestmentService.findAllInvestmentByWalletId({
            walletId: Number(req.params.walletId),
            page: parseInt(req.query.page ? req.query.page.toString() : '0'),
            pageCount: parseInt(req.query.pageCount ? req.query.pageCount.toString() : '10'),
            sortKey: req.query.sortKey,
            sortOrder: req.query.sortOrder
        });
        res.status(200).json({
            data: findAllInvestmentsData,
            message: 'findAll'
        });
    } catch (error) {
        next(error);
    }
};
const getAllInvestmentsByMinted = async (req, res, next)=>{
    try {
        const findAllInvestments = await _services.InvestmentService.findAllInvestmentByMinted({
            page: parseInt(req.query.page ? req.query.page.toString() : '0'),
            pageCount: req.query.pageCount ? parseInt(req.query.pageCount.toString()) : undefined,
            sortKey: req.query.sortKey || 'id',
            sortOrder: req.query.sortOrder || 'desc'
        });
        res.status(200).json({
            data: findAllInvestments,
            message: 'findAll'
        });
    } catch (error) {
        next(error);
    }
};
const deleteInvestment = async (req, res, next)=>{
    try {
        const investmentId = Number(req.params.id);
        const deleteInvestmentData = await _services.InvestmentService.deleteInvestment(investmentId);
        res.status(200).json({
            data: deleteInvestmentData,
            message: 'deleted'
        });
    } catch (error) {
        next(error);
    }
};
const batchUpdateTransactionHash = async (req, res, next)=>{
    try {
        const { txnHash , value  } = req.body;
        const updateInvestmentData = await _services.InvestmentService.batchUpdateTransactionHash(txnHash, value);
        res.status(200).json({
            data: updateInvestmentData,
            message: 'updated'
        });
    } catch (error) {
        next(error);
    }
};
const batchUpdateTransactionHashv2 = async (req, res, next)=>{
    try {
        const params = req.body;
        const updateInvestmentData = await _services.InvestmentService.batchUpdateTransactionHashv2(params);
        res.status(200).json({
            data: updateInvestmentData,
            message: 'updated'
        });
    } catch (error) {
        next(error);
    }
};

//# sourceMappingURL=investment.controller.js.map