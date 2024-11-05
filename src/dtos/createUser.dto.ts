import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('BD')
  @IsNotEmpty()
  phoneNumber: string;
}
