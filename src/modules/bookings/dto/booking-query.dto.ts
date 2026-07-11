import { IsEnum, IsInt, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class BookingQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Number of records per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public limit?: number = 10;

  @ApiPropertyOptional({ enum: BookingStatus, description: 'Filter bookings by execution status' })
  @IsOptional()
  @IsEnum(BookingStatus)
  public status?: BookingStatus;

  @ApiPropertyOptional({ example: 'Kasun', description: 'Search term for customer name or email' })
  @IsOptional()
  @IsString()
  public search?: string;
}
