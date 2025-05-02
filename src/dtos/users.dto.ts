import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsInt, IsEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  public password: string;

  @IsString()
  phone: string;

  referralCode: string;

  @IsEmpty()
  referrerId: number;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  public password: string;
}

export class VerifyLoginUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public otp: string;
}

export class VerifySignUpUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public otp: string;
}
export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
