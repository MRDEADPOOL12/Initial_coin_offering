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
    createWallet: ()=>createWallet,
    findWalletById: ()=>findWalletById,
    updateWallet: ()=>updateWallet,
    generateTokens: ()=>generateTokens
});
const _database = require("../database");
const _authService = require("./auth.service");
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
const createWallet = async (userId, walletAddress, nonce)=>{
    await _database.DB.Wallet.create({
        userId,
        walletAddress,
        nonce: nonce
    });
    return true;
};
async function findWalletById(walletAddress) {
    const wallet = await _database.DB.Wallet.findOne({
        where: {
            walletAddress
        }
    });
    if (!wallet) return null;
    return wallet.dataValues;
}
const updateWallet = async (walletAddress, walletData)=>await _database.DB.Wallet.update(_objectSpread({}, walletData), {
        where: {
            walletAddress
        }
    });
const generateTokens = async (userId)=>{
    const user = await _database.DB.User.findByPk(userId);
    const accessToken = (0, _authService.createAccessToken)(user);
    const refreshToken = (0, _authService.createRefreshToken)(user);
    return {
        accessToken,
        refreshToken
    };
};

//# sourceMappingURL=wallet.service.js.map