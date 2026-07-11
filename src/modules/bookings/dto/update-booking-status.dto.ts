import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: 'CONFIRMED', description: 'New booking status' })
  @IsEnum(BookingStatus, { message: 'Invalid booking status option' })
  @IsNotEmpty()
  public status!: BookingStatus;
}
