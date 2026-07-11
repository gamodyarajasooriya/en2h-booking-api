import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@entwoh.com', description: 'User email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  public email!: string;

  @ApiProperty({ example: 'securePass123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
