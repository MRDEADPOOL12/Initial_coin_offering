import { HttpException } from '@/exceptions/httpException';
import { UserModel } from '@/models/users.model';
import { logger } from '@/utils/logger';
import { generateOTP, genrateRandomNumber } from '@/utils/math';
import { SECRET_KEY } from '@config';
import { DB } from '@database';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import axios from 'axios';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import SmsClient from 'twilio';

export const createAccessToken = (userModel: UserModel): TokenData => {
  const user = userModel.dataValues;

  const dataStoredInToken: DataStoredInToken = { id: user.id, email: user.email };
  const expiresIn: number = 60 * 60 * 6;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

export const createRefreshToken = (userModel: UserModel): TokenData => {
  const user = userModel.dataValues;

  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn = '1y';

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

export const createCookie = (cookieName: string, tokenData: TokenData): string => {
  return `${cookieName}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

export async function signup(userData: CreateUserDto) {
  const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
  if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

  const createUserData: UserModel = await DB.User.create({ ...userData });

  if (createUserData) {
  }

  return await sendOtpEmail(createUserData.dataValues,true);
}

// export async function loginWithWallet(loginData: { nonce: number; walletAddress: string; signature: string }) {
//   const wallet = await DB.Wallet.findOne({ where: { walletAddress: loginData.walletAddress } });
//   if (!wallet) {
//     throw new HttpException(409, 'Invalid wallet address');
//   }
//   if (wallet.nonce !== loginData.nonce) {
//     throw new HttpException(409, 'Invalid wallet nonce');
//   }
//   const abiCoder = new AbiCoder();
//   const hash = keccak256(abiCoder.encode(['uint', 'address'], [loginData.nonce, loginData.walletAddress]));
//   const address = verifyMessage(hash, loginData.signature);
//   if (address === loginData.walletAddress) {
//     const findUser = await DB.User.findOne({ where: { id: wallet.userId } });
//     const accessToken = createAccessToken(findUser);
//     const refreshToken = createRefreshToken(findUser);

//     return { accessToken, refreshToken, user: findUser.getPublicData(), walletId: wallet.id };
//   }
// }
// export async function signupWithWallet(userDataWithWallet: {
//   nonce: number;
//   email: string;
//   phone: string;
//   walletAddress: string;
//   walletName: string;
//   signature: string;
// }) {
//   const abiCoder = new AbiCoder();
//   const hash = keccak256(
//     abiCoder.encode(
//       ['uint', 'string', 'string', 'address', 'string'],
//       [userDataWithWallet.nonce, userDataWithWallet.email, userDataWithWallet.phone, userDataWithWallet.walletAddress, userDataWithWallet.walletName],
//     ),
//   );
//   const address = verifyMessage(hash, userDataWithWallet.signature);
//   if (address === userDataWithWallet.walletAddress) {
//     const user = await DB.User.create({ email: userDataWithWallet.email, phone: userDataWithWallet.phone });
//     const wallet = await DB.Wallet.create({
//       nonce: userDataWithWallet.nonce + 1,
//       userId: user.id,
//       walletAddress: userDataWithWallet.walletAddress,
//       walletName: userDataWithWallet.walletName,
//     });
//     const accessToken = createAccessToken(user);
//     const refreshToken = createRefreshToken(user);

//     return { accessToken, refreshToken, user: user.getPublicData(), walletId: wallet.id };
//   } else {
//     throw new HttpException(409, 'Invalid signature');
//   }
// }

export async function login(userData: LoginUserDto): Promise<boolean> {
  const findUser = await DB.User.findOne({ where: { email: userData.email } });
  if (!findUser) throw new HttpException(404, `This email ${userData.email} was not found`);
  return await sendOtpEmail(findUser.dataValues,false);
}

export async function adminSignup(userData: CreateUserDto) {
  const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
  if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
  const hashedPassword = await hash(userData.password, 10);
  const createUserData: UserModel = await DB.User.create({ ...userData, password: hashedPassword, userRole: 1 });
  await sendOtpEmail(createUserData);
  const accessToken = createAccessToken(createUserData);
  const refreshToken = createRefreshToken(createUserData);
  return { createUserData: createUserData.get(), accessToken, refreshToken };
}

export async function adminLogin(userData: LoginUserDto) {
  const findUser = await DB.User.findOne({ where: { email: userData.email } });
  if (!findUser) throw new HttpException(404, `This email ${userData.email} was not found`);

  const res = await findUser.comparePassword(userData.password);
  if (!res) throw new HttpException(403, `Incorrect Password`);

  const accessToken = createAccessToken(findUser);
  const refreshToken = createRefreshToken(findUser);

  return { accessToken, refreshToken, findUser: findUser.getPublicData() };
}
export async function verifyLogin(loginData: { email: string; otp: string }) {
  const findUser = await DB.User.findOne({ attributes: { include: ['emailOtp'] }, where: { email: loginData.email } });
  if (!findUser) throw new HttpException(404, `This email ${loginData.email} was not found`);
  const result = await verifyOtp(findUser, loginData.otp, 'email');
  console.log(result);
  if (result) {
    findUser.update({ isEmailVerified: true });
    const accessToken = createAccessToken(findUser);
    const refreshToken = createRefreshToken(findUser);

    return { accessToken, refreshToken, findUser: findUser.getPublicData() };
  } else {
    throw new HttpException(400, `Invalid otp`);
  }
}
export async function verifySignUp(signUpData: { email: string; otp: string }) {
  const findUser = await DB.User.findOne({ attributes: { include: ['emailOtp'] }, where: { email: signUpData.email } });
  if (!findUser) throw new HttpException(404, `This email ${signUpData.email} was not found`);
  const result = await verifyOtp(findUser, signUpData.otp, 'email');
  console.log(result);
  if (result) {
    findUser.update({ isEmailVerified: true });
    return { message: 'Email verification successful', user: findUser.getPublicData() };
  } else {
    throw new HttpException(400, `Invalid OTP`);
  }
}

export async function logout(userData: User): Promise<User> {
  const findUser: User = await DB.User.findOne({ where: { email: userData.email, password: userData.password } });
  if (!findUser) throw new HttpException(404, "User doesn't exist");

  return findUser;
}

export async function sendOtpSMS(userData: User): Promise<boolean> {
  const TWILIO_SID = process.env.TWILIO_SID;
  const TWILIO_AUTH = process.env.TWILIO_AUTH;
  const client = SmsClient(TWILIO_SID, TWILIO_AUTH);
  const otp = generateOTP();
  await client.messages.create({ body: `Your OTP code is ${otp}`, from: '+15076094642', to: userData.phone });
  await DB.User.update({ phoneOtp: otp }, { where: { id: userData.id } });
  return true;
}

export async function sendOtpEmail(userData: User | UserModel, isSignUp: boolean): Promise<any> {
  if (userData instanceof UserModel) userData = userData.dataValues;
  const otp = generateOTP();
  if (otp) {
    await DB.User.update({ emailOtp: otp }, { where: { email: userData.email } });
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
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const result = await axios.post(config.url, data);
    console.log('email response: ', result.status);
    console.log('email response: ', result.data);
  } catch (ex) {
    logger.error(ex);
  } finally {
    await DB.User.update({ emailOtp: otp }, { where: { id: userData.id } });
  }
}
export async function verifyOtp(userData: UserModel, recievedOtp: string, type: 'email' | 'phone') {
  logger.warn(JSON.stringify({ userData, recievedOtp, msf: 'asnkjhsagdkajshdsakjdhasjk' }));
  console.warn(userData);
  switch (type) {
    case 'email':
      console.warn(type, userData.compareEmailOtp(recievedOtp));
      if (userData.compareEmailOtp(recievedOtp)) {
        console.warn(type, userData.compareEmailOtp(recievedOtp));

        return await DB.User.update({ isEmailVerified: true }, { where: { id: userData.dataValues.id } });
      }
      break;
    case 'phone':
      console.warn(type);
      if (userData.comparePhoneOtp(recievedOtp)) {
        console.warn(type);

        return await DB.User.update({ isPhoneVerified: true }, { where: { id: userData.dataValues.id } });
      }
      break;
    default:
      return false;
      break;
  }
}

export async function verifyOtpPublic(userData: DataStoredInToken, recievedOtp: string, type: 'email' | 'phone') {
  const findUser = await DB.User.findOne({ attributes: { include: ['emailOtp'] }, where: { id: userData.id } });
  return verifyOtp(findUser, recievedOtp, type);
}

export const getReferrer = async (referralCode: string) => {
  const referral = await DB.Referral.findOne({ where: { code: referralCode } });
  return referral.get();
};

export const createReferralCode = async (userId: number) => {
  const code = genrateRandomNumber();
  const referral = await DB.Referral.create({ code, userId });
  return referral.get();
};

export const getReferralCodes = async (userId: number) => {
  return await DB.Referral.findAll({ where: { userId: userId } });
};

let lastOtpGenerationTime = null; // Track the last OTP generation time

export async function sendRegenerateOtpEmail( email): Promise<any> {
  const currentTime = Date.now();
  const timeDiff = lastOtpGenerationTime ? currentTime - lastOtpGenerationTime : Infinity;

  if (timeDiff >= 2 * 60 * 1000) {
  const otp = generateOTP();
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
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const result = await axios.post(config.url, data);
    lastOtpGenerationTime = currentTime; // Update the last OTP generation time
  } catch (ex) {
    logger.error(ex);
    throw new Error('Failed to send OTP email');
  } finally {
    try {
      await DB.User.update({ emailOtp: otp }, { where: { email: email } });
      const response = `OTP sent to the email ${email}`;
      return response; // Return the success response
    } catch (error) {
      // Handle error when updating the user
      logger.error(error);
      throw new Error('Failed to update user');
    }
  }
}
  else {
        const remainingTime = Math.ceil((2 * 60 * 1000 - timeDiff) / 1000); // Calculate remaining time in seconds
        const response = `Please wait ${remainingTime} seconds before requesting a new OTP.`;
        return response; // Return the response
  }
}
export async function getUserRole(email) {
  try {
    const findUser = await DB.User.findOne({ where: { email: email } });
    if (!findUser) {
      throw new Error('User not found');
    }
    return findUser.dataValues.userRole;
  } catch (error) {
    console.error('Error in getUserRole:', error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}