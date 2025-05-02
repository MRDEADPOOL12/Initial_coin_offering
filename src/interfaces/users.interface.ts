export interface User {
  id?: number;
  email: string;
  password?: string;
  emailOtp?: string;
  phoneOtp?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  invested: boolean;
  wpViewed: boolean;
  wpDownloaded: boolean;
  userRole: number;
  phone?: string;
  name: string;
  referrerId?: number;
  // userInvestmentAmount?: number;
  // userTokensSold?:number;
}

// export enum DeviceEnum {
//   Mobile,
//   Web,
// }
