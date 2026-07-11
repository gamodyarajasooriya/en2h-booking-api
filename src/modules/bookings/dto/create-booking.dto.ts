import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Kasun Perera', description: 'Customer full name' })
  @IsString()
  @IsNotEmpty()
  public customerName!: string;

  @ApiProperty({ example: 'kasun@gmail.com', description: 'Customer email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  public customerEmail!: string;

  @ApiProperty({ example: '0771234567', description: 'Customer contact number' })
  @IsString()
  @IsNotEmpty()
  public customerPhone!: string;

  @ApiProperty({ example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', description: 'Valid Service UUID' })
  @IsUUID('4', { message: 'Invalid Service ID format' })
  @IsNotEmpty()
  public serviceId!: string;

  @ApiProperty({ example: '2026-08-15T00:00:00.000Z', description: 'Booking date in ISO string format' })
  @IsString()
  @IsNotEmpty()
  public bookingDate!: string;

  @ApiProperty({ example: '14:30', description: 'Booking time slot (24h format HH:mm)' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:mm format' })
  @IsNotEmpty()
  public bookingTime!: string;

  @ApiProperty({ example: 'Need extra care', description: 'Special notes', required: false })
  @IsString()
  @IsOptional()
  public notes?: string;
}
