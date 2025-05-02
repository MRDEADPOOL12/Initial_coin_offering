import { integer } from 'aws-sdk/clients/cloudfront';
import { IsString, IsNotEmpty } from 'class-validator';

export class createclaimDto {
  @IsString()  
  @IsNotEmpty()
  public walletAddress: string;

  @IsString()  
  @IsNotEmpty()
  public txnHash: integer;

  @IsNotEmpty()
  public  email: string;
}
