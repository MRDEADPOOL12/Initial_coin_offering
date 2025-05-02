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
    createAccessToken: ()=>createAccessToken,
    createRefreshToken: ()=>createRefreshToken,
    createCookie: ()=>createCookie,
    signup: ()=>signup,
    login: ()=>login,
    adminSignup: ()=>adminSignup,
    adminLogin: ()=>adminLogin,
    verifyLogin: ()=>verifyLogin,
    verifySignUp: ()=>verifySignUp,
    logout: ()=>logout,
    sendOtpSMS: ()=>sendOtpSMS,
    sendOtpEmail: ()=>sendOtpEmail,
    verifyOtp: ()=>verifyOtp,
    verifyOtpPublic: ()=>verifyOtpPublic,
    getReferrer: ()=>getReferrer,
    createReferralCode: ()=>createReferralCode,
    getReferralCodes: ()=>getReferralCodes,
    sendRegenerateOtpEmail: ()=>sendRegenerateOtpEmail,
    getUserRole: ()=>getUserRole
});
const _httpException = require("../exceptions/httpException");
const _usersModel = require("../models/users.model");
const _logger = require("../utils/logger");
const _math = require("../utils/math");
const _config = require("../config");
const _database = require("../database");
const _axios = _interopRequireDefault(require("axios"));
const _bcryptjs = require("bcryptjs");
const _jsonwebtoken = require("jsonwebtoken");
const _twilio = _interopRequireDefault(require("twilio"));
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
const createAccessToken = (userModel)=>{
    const user = userModel.dataValues;
    const dataStoredInToken = {
        id: user.id,
        email: user.email
    };
    const expiresIn = 60 * 60 * 6;
    return {
        expiresIn,
        token: (0, _jsonwebtoken.sign)(dataStoredInToken, _config.SECRET_KEY, {
            expiresIn
        })
    };
};
const createRefreshToken = (userModel)=>{
    const user = userModel.dataValues;
    const dataStoredInToken = {
        id: user.id
    };
    const expiresIn = '1y';
    return {
        expiresIn,
        token: (0, _jsonwebtoken.sign)(dataStoredInToken, _config.SECRET_KEY, {
            expiresIn
        })
    };
};
const createCookie = (cookieName, tokenData)=>{
    return `${cookieName}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};
async function signup(userData) {
    const findUser = await _database.DB.User.findOne({
        where: {
            email: userData.email
        }
    });
    if (findUser) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
    const createUserData = await _database.DB.User.create(_objectSpread({}, userData));
    if (createUserData) {}
    return await sendOtpEmail(createUserData.dataValues, true);
}
async function login(userData) {
    const findUser = await _database.DB.User.findOne({
        where: {
            email: userData.email
        }
    });
    if (!findUser) throw new _httpException.HttpException(404, `This email ${userData.email} was not found`);
    return await sendOtpEmail(findUser.dataValues, false);
}
async function adminSignup(userData) {
    const findUser = await _database.DB.User.findOne({
        where: {
            email: userData.email
        }
    });
    if (findUser) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
    const hashedPassword = await (0, _bcryptjs.hash)(userData.password, 10);
    const createUserData = await _database.DB.User.create(_objectSpreadProps(_objectSpread({}, userData), {
        password: hashedPassword,
        userRole: 1
    }));
    await sendOtpEmail(createUserData);
    const accessToken = createAccessToken(createUserData);
    const refreshToken = createRefreshToken(createUserData);
    return {
        createUserData: createUserData.get(),
        accessToken,
        refreshToken
    };
}
async function adminLogin(userData) {
    const findUser = await _database.DB.User.findOne({
        where: {
            email: userData.email
        }
    });
    if (!findUser) throw new _httpException.HttpException(404, `This email ${userData.email} was not found`);
    const res = await findUser.comparePassword(userData.password);
    if (!res) throw new _httpException.HttpException(403, `Incorrect Password`);
    const accessToken = createAccessToken(findUser);
    const refreshToken = createRefreshToken(findUser);
    return {
        accessToken,
        refreshToken,
        findUser: findUser.getPublicData()
    };
}
async function verifyLogin(loginData) {
    const findUser = await _database.DB.User.findOne({
        attributes: {
            include: [
                'emailOtp'
            ]
        },
        where: {
            email: loginData.email
        }
    });
    if (!findUser) throw new _httpException.HttpException(404, `This email ${loginData.email} was not found`);
    const result = await verifyOtp(findUser, loginData.otp, 'email');
    console.log(result);
    if (result) {
        findUser.update({
            isEmailVerified: true
        });
        const accessToken = createAccessToken(findUser);
        const refreshToken = createRefreshToken(findUser);
        return {
            accessToken,
            refreshToken,
            findUser: findUser.getPublicData()
        };
    } else {
        throw new _httpException.HttpException(400, `Invalid otp`);
    }
}
async function verifySignUp(signUpData) {
    const findUser = await _database.DB.User.findOne({
        attributes: {
            include: [
                'emailOtp'
            ]
        },
        where: {
            email: signUpData.email
        }
    });
    if (!findUser) throw new _httpException.HttpException(404, `This email ${signUpData.email} was not found`);
    const result = await verifyOtp(findUser, signUpData.otp, 'email');
    console.log(result);
    if (result) {
        findUser.update({
            isEmailVerified: true
        });
        return {
            message: 'Email verification successful',
            user: findUser.getPublicData()
        };
    } else {
        throw new _httpException.HttpException(400, `Invalid OTP`);
    }
}
async function logout(userData) {
    const findUser = await _database.DB.User.findOne({
        where: {
            email: userData.email,
            password: userData.password
        }
    });
    if (!findUser) throw new _httpException.HttpException(404, "User doesn't exist");
    return findUser;
}
async function sendOtpSMS(userData) {
    const TWILIO_SID = process.env.TWILIO_SID;
    const TWILIO_AUTH = process.env.TWILIO_AUTH;
    const client = (0, _twilio.default)(TWILIO_SID, TWILIO_AUTH);
    const otp = (0, _math.generateOTP)();
    await client.messages.create({
        body: `Your OTP code is ${otp}`,
        from: '+15076094642',
        to: userData.phone
    });
    await _database.DB.User.update({
        phoneOtp: otp
    }, {
        where: {
            id: userData.id
        }
    });
    return true;
}
async function sendOtpEmail(userData, isSignUp) {
    if (userData instanceof _usersModel.UserModel) userData = userData.dataValues;
    const otp = (0, _math.generateOTP)();
    if (otp) {
        await _database.DB.User.update({
            emailOtp: otp
        }, {
            where: {
                email: userData.email
            }
        });
    }
    let data;
    if (isSignUp) {
        data = {
            email: userData.email,
            otp: otp,
            subject: "Registration Completed",
            body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Trapaaca!</title>
        </head>
        <body>
          <p>Hello ${userData.name},</p>
          <p>Welcome to Trapaaca!</p>
          <p>Thank you for signing up with us. We appreciate your support in our vision to revolutionize e-commerce with Trapaaca. Trapaaca looks forward to having you on board.</p>
          <p>To ensure the security of your account, we have implemented a two-factor authentication process. Please use the One-Time Password (OTP) provided below to verify your email address:</p>
          <p><strong>OTP: ${otp}</strong></p>
          <p>Please enter the OTP within the specified time frame to complete the verification process. This additional layer of security helps protect your account from unauthorized access.</p>
          <p>If you did not initiate this sign-up or need any assistance, please contact our support team immediately at <a href="mailto:support@trapaaca.com">support@trapaaca.com</a>.</p>
          <p>We are excited to have you on board and look forward to providing you with a seamless and secure shopping experience.</p>
          <p>Best regards,<br>Team Trapaaca</p>
        </body>
        </html>
      `
        };
    } else {
        data = {
            email: userData.email,
            otp: otp,
            subject: "OTP for Sign In",
            body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP for Sign In</title>
        </head>
        <body>
          <p>Hello ${userData.name},</p>
          <p>Welcome back to Trapaaca!</p>
          <p>For the security of your account, we have implemented a two-factor authentication process. Please use the One-Time Password (OTP) provided below to complete your sign-in:</p>
          <p><strong>OTP: ${otp}</strong></p>
          <p>Enter the OTP within the specified time frame to securely access your account. This additional layer of security helps protect your account from unauthorized access.</p>
          <p>If you did not initiate this sign-in attempt or need any assistance, please contact our support team immediately at <a href="mailto:support@trapaaca.com">support@trapaaca.com</a>.</p>
          <p>Thank you for choosing Trapaaca, where your shopping experience is our top priority.</p>
          <p>Best regards,<br>Trapaaca Team</p>
        </body>
        </html>
      `
        };
    }
    const config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: 'https://l2ucrcmk00.execute-api.me-central-1.amazonaws.com/dev/email',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        const result = await _axios.default.post(config.url, data);
        console.log('email response: ', result.status);
        console.log('email response: ', result.data);
    } catch (ex) {
        _logger.logger.error(ex);
    } finally{
        await _database.DB.User.update({
            emailOtp: otp
        }, {
            where: {
                id: userData.id
            }
        });
    }
}
async function verifyOtp(userData, recievedOtp, type) {
    _logger.logger.warn(JSON.stringify({
        userData,
        recievedOtp,
        msf: 'asnkjhsagdkajshdsakjdhasjk'
    }));
    console.warn(userData);
    switch(type){
        case 'email':
            console.warn(type, userData.compareEmailOtp(recievedOtp));
            if (userData.compareEmailOtp(recievedOtp)) {
                console.warn(type, userData.compareEmailOtp(recievedOtp));
                return await _database.DB.User.update({
                    isEmailVerified: true
                }, {
                    where: {
                        id: userData.dataValues.id
                    }
                });
            }
            break;
        case 'phone':
            console.warn(type);
            if (userData.comparePhoneOtp(recievedOtp)) {
                console.warn(type);
                return await _database.DB.User.update({
                    isPhoneVerified: true
                }, {
                    where: {
                        id: userData.dataValues.id
                    }
                });
            }
            break;
        default:
            return false;
            break;
    }
}
async function verifyOtpPublic(userData, recievedOtp, type) {
    const findUser = await _database.DB.User.findOne({
        attributes: {
            include: [
                'emailOtp'
            ]
        },
        where: {
            id: userData.id
        }
    });
    return verifyOtp(findUser, recievedOtp, type);
}
const getReferrer = async (referralCode)=>{
    const referral = await _database.DB.Referral.findOne({
        where: {
            code: referralCode
        }
    });
    return referral.get();
};
const createReferralCode = async (userId)=>{
    const code = (0, _math.genrateRandomNumber)();
    const referral = await _database.DB.Referral.create({
        code,
        userId
    });
    return referral.get();
};
const getReferralCodes = async (userId)=>{
    return await _database.DB.Referral.findAll({
        where: {
            userId: userId
        }
    });
};
let lastOtpGenerationTime = null;
async function sendRegenerateOtpEmail(email) {
    const currentTime = Date.now();
    const timeDiff = lastOtpGenerationTime ? currentTime - lastOtpGenerationTime : Infinity;
    if (timeDiff >= 2 * 60 * 1000) {
        const otp = (0, _math.generateOTP)();
        let data;
        data = {
            email: email,
            subject: "OTP for Sign In",
            body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP for Sign In</title>
      </head>
      <body>
        <p>Hello,</p>
        <p>Welcome back to Trapaaca!</p>
        <p>For the security of your account, we have implemented a two-factor authentication process. Please use the One-Time Password (OTP) provided below to complete your sign-in:</p>
        <p><strong>OTP: ${otp}</strong></p>
        <p>Enter the OTP within the specified time frame to securely access your account. This additional layer of security helps protect your account from unauthorized access.</p>
        <p>If you did not initiate this sign-in attempt or need any assistance, please contact our support team immediately at <a href="mailto:support@trapaaca.com">support@trapaaca.com</a>.</p>
        <p>Thank you for choosing Trapaaca, where your shopping experience is our top priority.</p>
        <p>Best regards,<br>Trapaaca Team</p>
      </body>
      </html>
      `
        };
        const config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: 'https://l2ucrcmk00.execute-api.me-central-1.amazonaws.com/dev/email',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        try {
            const result = await _axios.default.post(config.url, data);
            lastOtpGenerationTime = currentTime;
        } catch (ex) {
            _logger.logger.error(ex);
            throw new Error('Failed to send OTP email');
        } finally{
            try {
                await _database.DB.User.update({
                    emailOtp: otp
                }, {
                    where: {
                        email: email
                    }
                });
                const response = `OTP sent to the email ${email}`;
                return response;
            } catch (error) {
                _logger.logger.error(error);
                throw new Error('Failed to update user');
            }
        }
    } else {
        const remainingTime = Math.ceil((2 * 60 * 1000 - timeDiff) / 1000);
        const response = `Please wait ${remainingTime} seconds before requesting a new OTP.`;
        return response;
    }
}
async function getUserRole(email) {
    try {
        const findUser = await _database.DB.User.findOne({
            where: {
                email: email
            }
        });
        if (!findUser) {
            throw new Error('User not found');
        }
        return findUser.dataValues.userRole;
    } catch (error) {
        console.error('Error in getUserRole:', error.message);
        throw error;
    }
}

//# sourceMappingURL=auth.service.js.map