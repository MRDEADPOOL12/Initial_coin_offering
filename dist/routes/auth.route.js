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
    router: ()=>router,
    default: ()=>_default
});
const _express = require("express");
const _usersDto = require("../dtos/users.dto");
const _authMiddleware = require("../middlewares/auth.middleware");
const _validationMiddleware = require("../middlewares/validation.middleware");
const _controllers = require("../controllers");
const _vipMiddleware = require("../middlewares/vip.middleware");
const _mintorMiddleware = require("../middlewares/mintor.middleware");
const router = (0, _express.Router)();
router.post('/signup', (0, _validationMiddleware.ValidationMiddleware)(_usersDto.CreateUserDto), _controllers.AuthController.signUp);
router.post('/login', (0, _validationMiddleware.ValidationMiddleware)(_usersDto.LoginUserDto), _vipMiddleware.VipAuthMiddleware, _controllers.AuthController.logIn);
router.post('/verify-login', (0, _validationMiddleware.ValidationMiddleware)(_usersDto.VerifyLoginUserDto), _vipMiddleware.VipAuthMiddleware, _controllers.AuthController.verifyLogin);
router.post('/verify-signup', (0, _validationMiddleware.ValidationMiddleware)(_usersDto.VerifyLoginUserDto), _controllers.AuthController.verifySignUp);
router.post('/logout', _authMiddleware.AuthMiddleware, _controllers.AuthController.logOut);
router.post('/auth/referral', _authMiddleware.AuthMiddleware, _controllers.AuthController.createReferral);
router.post('/otp/sms', _authMiddleware.AuthMiddleware, _controllers.AuthController.sendSmsOtp);
router.post('/otp/email', _authMiddleware.AuthMiddleware, _controllers.AuthController.sendEmailOtp);
router.post('/verify/otp/sms', _authMiddleware.AuthMiddleware, _controllers.AuthController.verifySmsOtp);
router.post('/verify/otp/email', _authMiddleware.AuthMiddleware, _controllers.AuthController.verifyEmailOtp);
router.get('/auth-check', _authMiddleware.AuthMiddleware, _controllers.AuthController.authCheck);
router.post('/admin/signup', _controllers.AuthController.adminSignUp);
router.post('/admin/login', _mintorMiddleware.MintorAuthMiddleware, _controllers.AuthController.adminLogIn);
router.post('/regenerate-otp', _controllers.AuthController.regenerateOtp);
const AuthRouter = {
    path: '/',
    router: router
};
const _default = AuthRouter;

//# sourceMappingURL=auth.route.js.map