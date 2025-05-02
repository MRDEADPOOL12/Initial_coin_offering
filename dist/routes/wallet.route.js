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
    path: ()=>path,
    router: ()=>router,
    default: ()=>_default
});
const _express = require("express");
const _authMiddleware = require("../middlewares/auth.middleware");
const _controllers = require("../controllers");
const path = '/wallet-connect';
const router = (0, _express.Router)();
router.get(`${path}/:walletAddress/login`, _controllers.WalletController.getNonce);
router.post(`${path}/login/verify`, _controllers.WalletController.verifyNonce);
router.get(`${path}/:walletAddress/register`, _authMiddleware.AuthMiddleware, _controllers.WalletController.getNonceByWalletId);
router.post(`${path}/register/verify`, _authMiddleware.AuthMiddleware, _controllers.WalletController.verifyNonceAndUpdateWallet);
const WalletRouter = {
    path: path,
    router: router
};
const _default = WalletRouter;

//# sourceMappingURL=wallet.route.js.map