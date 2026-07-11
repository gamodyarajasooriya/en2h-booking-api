import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingsService Business Rules', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    service: {
      findUnique: jest.fn(),
    },
    booking: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should throw NotFoundException if service does not exist', async () => {
    mockPrismaService.service.findUnique.mockResolvedValue(null); // Mock DB returns null

    const mockBookingDto = {
      customerName: 'Test',
      customerEmail: 'test@gmail.com',
      customerPhone: '0771234567',
      serviceId: 'non-existent-id',
      bookingDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      bookingTime: '10:00',
    };

    await expect(service.create(mockBookingDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if booking date is in the past', async () => {
    mockPrismaService.service.findUnique.mockResolvedValue({ id: 'active-id', isActive: true });

    const mockBookingDto = {
      customerName: 'Test',
      customerEmail: 'test@gmail.com',
      customerPhone: '0771234567',
      serviceId: 'active-id',
      bookingDate: '2020-01-01T00:00:00.000Z', // Past Date
      bookingTime: '10:00',
    };

    await expect(service.create(mockBookingDto)).rejects.toThrow(BadRequestException);
  });
});
