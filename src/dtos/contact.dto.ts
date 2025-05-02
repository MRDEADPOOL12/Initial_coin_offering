import { IsEmail } from 'class-validator';

export class CreateContactDto {
  @IsEmail()
  public email: string;
}
