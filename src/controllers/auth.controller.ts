import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto, VerifyLoginUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@/services';
import _ from 'lodash';
import { Referral } from '@/interfaces/referral.interface';
import { logger } from '@/utils/logger';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: CreateUserDto = req.body;
    if (userData.referralCode) {
      const referral = await AuthService.getReferrer(userData.referralCode);
      userData.referrerId = referral.userId;
    }
    await AuthService.signup(userData);
    res.status(201).json({
      success: true,
      message: 'signup',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: LoginUserDto = req.body;
    await AuthService.login(userData);
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    next(error);
  }
};

export const adminSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: CreateUserDto = req.body;
    if (userData.referralCode) {
      const referral = await AuthService.getReferrer(userData.referralCode);
      userData.referrerId = referral.userId;
    }
    const { createUserData: signUpUserData, accessToken, refreshToken } = await AuthService.adminSignup(userData);
    const accessTokencookie = AuthService.createCookie('access_token', accessToken);
    const refreshTokenCookie = AuthService.createCookie('refresh_token', refreshToken);
    res.setHeader('Set-Cookie', [accessTokencookie, refreshTokenCookie]);
    res.status(201).json({
      data: { userRole: _.pick(signUpUserData, ['id', 'userRole', 'isEmailVerified', 'isPhoneVerified', 'device']), accessToken, refreshToken },
      message: 'signup',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const adminLogIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: LoginUserDto = req.body;
    const result = await AuthService.adminLogin(userData);
    // const accessTokencookie = AuthService.createCookie('access_token', result.accessToken);
    // const refreshTokenCookie = AuthService.createCookie('refresh_token', result.refreshToken);
    // res.setHeader('Set-Cookie', [accessTokencookie, refreshTokenCookie]);
    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: VerifyLoginUserDto = req.body;
    const result = await AuthService.verifyLogin(userData);
    const accessTokencookie = AuthService.createCookie('access_token', result.accessToken);
    const refreshTokenCookie = AuthService.createCookie('refresh_token', result.refreshToken);
    res.setHeader('Set-Cookie', [accessTokencookie, refreshTokenCookie]);
    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const verifySignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signUpData: VerifySignUpUserDto = req.body;
    const result = await AuthService.verifySignUp(signUpData);
    res.status(200).json({
      success: true,
      message: 'Successfully registered for Trapaaca waiting list',
    });
  } catch (error) {
    next(error);
  }
};

export const logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    const logOutUserData: User = await AuthService.logout(userData);
    res.setHeader('Set-Cookie', ['access_token=; Max-age=0', 'refresh_token=; Max-age=0']);
    res.status(200).json({ data: logOutUserData, message: 'logout' });
  } catch (error) {
    next(error);
  }
};
export const createReferral = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    const referral: Referral = await AuthService.createReferralCode(userData.id);

    res.status(200).json({ data: referral, success: true });
  } catch (error) {
    next(error);
  }
};
export const getReferrals = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    const referrals: Referral[] = await AuthService.getReferralCodes(userData.id);

    res.status(200).json({ data: referrals, success: true });
  } catch (error) {
    next(error);
  }
};
export const sendSmsOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    await AuthService.sendOtpSMS(userData);
    res.status(200).json({ success: true, message: `Sent a otp sms to ${userData.phone}` });
  } catch (error) {
    next(error);
  }
};
export const sendEmailOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.user;
    await AuthService.sendOtpEmail(userData);
    res.status(200).json({ success: true, message: `Sent a otp email to ${userData.email}` });
  } catch (error) {
    next(error);
  }
};
export const verifySmsOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData = req.user as DataStoredInToken
    const otp = req.body.otp;
    const result = await AuthService.verifyOtpPublic(userData, otp, 'phone');
    res.status(200).json({ success: true, data: { isVerified: result } });
  } catch (error) {
    next(error);
  }
};
export const verifyEmailOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userData = req.user as DataStoredInToken
    const otp = req.body.otp;
    const result = await AuthService.verifyOtpPublic(userData, otp, 'email');
    res.status(200).json({ success: true, data: { isVerified: result } });
  } catch (error) {
    next(error);
  }
};
export const signupWithWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDataWithWallet = req.body;
    const result = await AuthService.signupWithWallet(userDataWithWallet);
    const accessTokencookie = AuthService.createCookie('access_token', result.accessToken);
    const refreshTokenCookie = AuthService.createCookie('refresh_token', result.refreshToken);
    res.setHeader('Set-Cookie', [accessTokencookie, refreshTokenCookie]);
    res.status(200).json({
      success: true,
      data: {
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDataWithWallet = req.body;
    const result = await AuthService.loginWithWallet(userDataWithWallet);
    const accessTokencookie = AuthService.createCookie('access_token', result.accessToken);
    const refreshTokenCookie = AuthService.createCookie('refresh_token', result.refreshToken);
    res.setHeader('Set-Cookie', [accessTokencookie, refreshTokenCookie]);
    res.status(200).json({
      success: true,
      data: {
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const authCheck = async (req: RequestWithUser, res: Response) => {
  res.json(req.user);
};

export const regenerateOtp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
     await AuthService.sendRegenerateOtpEmail(req.body.email);
     res.status(200).json({ sucesss: true,  message: `OTP sent to the email ${req.body.email}` });
  } catch (error) {
    next(error);
  }
};