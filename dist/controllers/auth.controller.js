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
    signUp: ()=>signUp,
    logIn: ()=>logIn,
    adminSignUp: ()=>adminSignUp,
    adminLogIn: ()=>adminLogIn,
    verifyLogin: ()=>verifyLogin,
    verifySignUp: ()=>verifySignUp,
    logOut: ()=>logOut,
    createReferral: ()=>createReferral,
    getReferrals: ()=>getReferrals,
    sendSmsOtp: ()=>sendSmsOtp,
    sendEmailOtp: ()=>sendEmailOtp,
    verifySmsOtp: ()=>verifySmsOtp,
    verifyEmailOtp: ()=>verifyEmailOtp,
    signupWithWallet: ()=>signupWithWallet,
    loginWithWallet: ()=>loginWithWallet,
    authCheck: ()=>authCheck,
    regenerateOtp: ()=>regenerateOtp
});
const _services = require("../services");
const _lodash = _interopRequireDefault(require("lodash"));
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
const signUp = async (req, res, next)=>{
    try {
        const userData = req.body;
        if (userData.referralCode) {
            const referral = await _services.AuthService.getReferrer(userData.referralCode);
            userData.referrerId = referral.userId;
        }
        await _services.AuthService.signup(userData);
        res.status(201).json({
            success: true,
            message: 'signup'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
const logIn = async (req, res, next)=>{
    try {
        const userData = req.body;
        await _services.AuthService.login(userData);
        res.status(200).json({
            success: true,
            message: 'OTP sent'
        });
    } catch (error) {
        next(error);
    }
};
const adminSignUp = async (req, res, next)=>{
    try {
        const userData = req.body;
        if (userData.referralCode) {
            const referral = await _services.AuthService.getReferrer(userData.referralCode);
            userData.referrerId = referral.userId;
        }
        const { createUserData: signUpUserData , accessToken , refreshToken  } = await _services.AuthService.adminSignup(userData);
        const accessTokencookie = _services.AuthService.createCookie('access_token', accessToken);
        const refreshTokenCookie = _services.AuthService.createCookie('refresh_token', refreshToken);
        res.setHeader('Set-Cookie', [
            accessTokencookie,
            refreshTokenCookie
        ]);
        res.status(201).json({
            data: {
                userRole: _lodash.default.pick(signUpUserData, [
                    'id',
                    'userRole',
                    'isEmailVerified',
                    'isPhoneVerified',
                    'device'
                ]),
                accessToken,
                refreshToken
            },
            message: 'signup'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
const adminLogIn = async (req, res, next)=>{
    try {
        const userData = req.body;
        const result = await _services.AuthService.adminLogin(userData);
        res.status(200).json({
            success: true,
            data: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};
const verifyLogin = async (req, res, next)=>{
    try {
        const userData = req.body;
        const result = await _services.AuthService.verifyLogin(userData);
        const accessTokencookie = _services.AuthService.createCookie('access_token', result.accessToken);
        const refreshTokenCookie = _services.AuthService.createCookie('refresh_token', result.refreshToken);
        res.setHeader('Set-Cookie', [
            accessTokencookie,
            refreshTokenCookie
        ]);
        res.status(200).json({
            success: true,
            data: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};
const verifySignUp = async (req, res, next)=>{
    try {
        const signUpData = req.body;
        const result = await _services.AuthService.verifySignUp(signUpData);
        res.status(200).json({
            success: true,
            message: 'Successfully registered for Trapaaca waiting list'
        });
    } catch (error) {
        next(error);
    }
};
const logOut = async (req, res, next)=>{
    try {
        const userData = req.user;
        const logOutUserData = await _services.AuthService.logout(userData);
        res.setHeader('Set-Cookie', [
            'access_token=; Max-age=0',
            'refresh_token=; Max-age=0'
        ]);
        res.status(200).json({
            data: logOutUserData,
            message: 'logout'
        });
    } catch (error) {
        next(error);
    }
};
const createReferral = async (req, res, next)=>{
    try {
        const userData = req.user;
        const referral = await _services.AuthService.createReferralCode(userData.id);
        res.status(200).json({
            data: referral,
            success: true
        });
    } catch (error) {
        next(error);
    }
};
const getReferrals = async (req, res, next)=>{
    try {
        const userData = req.user;
        const referrals = await _services.AuthService.getReferralCodes(userData.id);
        res.status(200).json({
            data: referrals,
            success: true
        });
    } catch (error) {
        next(error);
    }
};
const sendSmsOtp = async (req, res, next)=>{
    try {
        const userData = req.user;
        await _services.AuthService.sendOtpSMS(userData);
        res.status(200).json({
            success: true,
            message: `Sent a otp sms to ${userData.phone}`
        });
    } catch (error) {
        next(error);
    }
};
const sendEmailOtp = async (req, res, next)=>{
    try {
        const userData = req.user;
        await _services.AuthService.sendOtpEmail(userData);
        res.status(200).json({
            success: true,
            message: `Sent a otp email to ${userData.email}`
        });
    } catch (error) {
        next(error);
    }
};
const verifySmsOtp = async (req, res, next)=>{
    try {
        const userData = req.user;
        const otp = req.body.otp;
        const result = await _services.AuthService.verifyOtpPublic(userData, otp, 'phone');
        res.status(200).json({
            success: true,
            data: {
                isVerified: result
            }
        });
    } catch (error) {
        next(error);
    }
};
const verifyEmailOtp = async (req, res, next)=>{
    try {
        const userData = req.user;
        const otp = req.body.otp;
        const result = await _services.AuthService.verifyOtpPublic(userData, otp, 'email');
        res.status(200).json({
            success: true,
            data: {
                isVerified: result
            }
        });
    } catch (error) {
        next(error);
    }
};
const signupWithWallet = async (req, res, next)=>{
    try {
        const userDataWithWallet = req.body;
        const result = await _services.AuthService.signupWithWallet(userDataWithWallet);
        const accessTokencookie = _services.AuthService.createCookie('access_token', result.accessToken);
        const refreshTokenCookie = _services.AuthService.createCookie('refresh_token', result.refreshToken);
        res.setHeader('Set-Cookie', [
            accessTokencookie,
            refreshTokenCookie
        ]);
        res.status(200).json({
            success: true,
            data: _objectSpread({}, result)
        });
    } catch (error) {
        next(error);
    }
};
const loginWithWallet = async (req, res, next)=>{
    try {
        const userDataWithWallet = req.body;
        const result = await _services.AuthService.loginWithWallet(userDataWithWallet);
        const accessTokencookie = _services.AuthService.createCookie('access_token', result.accessToken);
        const refreshTokenCookie = _services.AuthService.createCookie('refresh_token', result.refreshToken);
        res.setHeader('Set-Cookie', [
            accessTokencookie,
            refreshTokenCookie
        ]);
        res.status(200).json({
            success: true,
            data: _objectSpread({}, result)
        });
    } catch (error) {
        next(error);
    }
};
const authCheck = async (req, res)=>{
    res.json(req.user);
};
const regenerateOtp = async (req, res, next)=>{
    try {
        await _services.AuthService.sendRegenerateOtpEmail(req.body.email);
        res.status(200).json({
            sucesss: true,
            message: `OTP sent to the email ${req.body.email}`
        });
    } catch (error) {
        next(error);
    }
};

//# sourceMappingURL=auth.controller.js.map