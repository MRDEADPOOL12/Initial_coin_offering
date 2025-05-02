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
const _controllers = require("../controllers");
const _authMiddleware = require("../middlewares/auth.middleware");
const _claimcontroller = require("../controllers/claimcontroller");
const path = '/invest';
const router = (0, _express.Router)();
router.get(`${path}/all`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.getAllInvestments);
router.get(`${path}/not-minted`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.getAllInvestmentsByMinted);
router.patch(`${path}/transaction-hash/batch`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.batchUpdateTransactionHash);
router.patch(`${path}/transaction-hash/batch2`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.batchUpdateTransactionHashv2);
router.post(`${path}/manual`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.createInvestment);
router.post(`${path}`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.createInvestment);
router.get(`${path}/:userId(\\d+)`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.getAllInvestmentsByUserId);
router.get(`${path}/`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.getAllInvestments);
router.put(`${path}/:id(\\d+)`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.updateInvestment);
router.delete(`${path}/:id(\\d+)`, _authMiddleware.AuthMiddleware, _controllers.InvestmentController.deleteInvestment);
router.post('/claim', _claimcontroller.claimInvestment);
const InvestmentRouter = {
    path: path,
    router: router
};
const _default = InvestmentRouter;

//# sourceMappingURL=investment.route.js.map