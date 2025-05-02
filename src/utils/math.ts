// import otpGenerator from "otp-generator";

export function genrateRandomNumber() {
  return Math.floor(Math.random() * 999999).toString();
}
// export function generateOTP() {
//   return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
// }

export function generateOTP() {
  const length = 6;
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * digits.length);
    otp += digits[index];
  }
  return otp;
}
