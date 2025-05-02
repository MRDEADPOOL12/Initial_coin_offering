import { IsString, IsNotEmpty } from 'class-validator';

export class getMetaDto {
  @IsString()  
  @IsNotEmpty()
  public meta_name: string;

  @IsString()  
  @IsNotEmpty()
  public meta_value: string;

  @IsNotEmpty()
  public created_at: Date;
}
