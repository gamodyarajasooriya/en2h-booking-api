import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Hair Cut', description: 'Title of the service' })
  @IsString()
  @IsNotEmpty()
  public title!: string;

  @ApiProperty({ example: 'Professional hair styling and trim', description: 'Detailed description' })
  @IsString()
  @IsNotEmpty()
  public description!: string;

  @ApiProperty({ example: 30, description: 'Duration of the service in minutes' })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  public duration!: number;

  @ApiProperty({ example: 25.50, description: 'Price of the service' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  public price!: number;

  @ApiProperty({ example: true, description: 'Is the service currently active?', required: false })
  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;
}
