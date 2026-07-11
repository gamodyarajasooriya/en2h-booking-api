import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(dto: CreateBookingDto) {
    // Rule 1: Validate Service Existence
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service || !service.isActive) {
      throw new NotFoundException(`Active Service with ID ${dto.serviceId} does not exist`);
    }

    // Rule 2: Booking dates cannot be in the past
    const inputDate = new Date(dto.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time components for date-only comparison

    if (inputDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // Unique Constraint Validation (Bonus Feature handled via Database Catch fallback)
    try {
      return await this.prisma.booking.create({
        data: {
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          bookingDate: inputDate,
          bookingTime: dto.bookingTime,
          notes: dto.notes,
          serviceId: dto.serviceId,
        },
      });
    } catch (error: any) {
      // Prisma P2002 indicates unique constraint violation (same service, date, time)
      if (error.code === 'P2002') {
        throw new ConflictException('This service slot is already booked for the selected date and time');
      }
      throw error;
    }
  }

  public async findAll() {
    return this.prisma.booking.findMany({
      include: { service: true }, // Rich resource composition mapping
    });
  }

  public async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  public async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    // Rule 3: Cancelled bookings cannot be marked as completed
    if (booking.status === BookingStatus.CANCELLED && dto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('A cancelled booking cannot be directly marked as completed');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  public async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
