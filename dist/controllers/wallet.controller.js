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
    getNonce: ()=>getNonce,
    verifyNonce: ()=>verifyNonce,
    getNonceByWalletId: ()=>getNonceByWalletId,
    verifyNonceAndUpdateWallet: ()=>verifyNonceAndUpdateWallet
});
const _services = require("../services");
const _siwe = require("siwe");
const _viem = require("viem");
const getNonce = async (req, res, next)=>{
    try {
        const { walletAddress  } = req.params;
        const wallet = await _services.WalletService.findWalletById(walletAddress);
        if (!wallet) return res.status(422).json({
            message: 'Wallet not found.'
        });
        const nonce = (0, _siwe.generateNonce)();
        await _services.WalletService.updateWallet(walletAddress, {
            nonce
        });
        res.json({
            success: true,
            data: {
                nonce
            }
        });
    } catch (error) {
        next(error);
    }
};
const verifyNonce = async (req, res, next)=>{
    try {
        const { walletAddress , signature  } = req.body;
        const wallet = await _services.WalletService.findWalletById(walletAddress);
        if (!wallet) return res.status(422).json({
            message: 'Wallet not found.'
        });
        const message = {
            address: walletAddress,
            statement: 'Sign in with Ethereum to the Trapaaca.',
            uri: req.headers.origin,
            version: '1',
            nonce: wallet.nonce
        };
        const address = await (0, _viem.recoverMessageAddress)({
            message: JSON.stringify(message),
            signature
        });
        if (address !== walletAddress) return res.status(422).json({
            message: 'Invalid signature.'
        });
        const { accessToken , refreshToken  } = await _services.WalletService.generateTokens(wallet.userId);
        res.json({
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};
const getNonceByWalletId = async (req, res, next)=>{
    try {
        const walletAddress = req.params.walletAddress;
        const wallet = await _services.WalletService.findWalletById(walletAddress);
        const nonce = (0, _siwe.generateNonce)();
        if (!wallet) {
            const walletData = await _services.WalletService.createWallet(req.user.id, walletAddress, nonce);
            console.log('walletData', walletData);
            return res.json({
                success: !!walletData,
                data: {
                    nonce
                }
            });
        } else if (wallet.verified) return res.status(422).json({
            message: 'Wallet already verified.'
        });
        const walletData = await _services.WalletService.updateWallet(walletAddress, {
            nonce
        });
        console.log('walletData', walletData);
        res.json({
            success: !!walletData,
            data: {
                nonce
            }
        });
    } catch (error) {
        next(error);
    }
};
const verifyNonceAndUpdateWallet = async (req, res, next)=>{
    try {
        const { walletAddress , signature  } = req.body;
        const wallet = await _services.WalletService.findWalletById(walletAddress);
        if (!wallet) return res.status(422).json({
            message: 'Wallet not found.'
        });
        const parsedWallet = JSON.parse(JSON.stringify(wallet));
        const nonce = parsedWallet.nonce;
        const message = {
            address: walletAddress,
            statement: 'Sign in with Ethereum to the Trapaaca.',
            uri: req.headers.origin,
            version: '1',
            nonce
        };
        const address = await (0, _viem.recoverMessageAddress)({
            message: JSON.stringify(message),
            signature
        });
        if (address !== walletAddress) return res.status(422).json({
            message: 'Invalid signature.'
        });
        await _services.WalletService.updateWallet(walletAddress, {
            verified: true
        });
        res.json({
            success: true
        });
    } catch (error) {
        next(error);
    }
};

//# sourceMappingURL=wallet.controller.js.map