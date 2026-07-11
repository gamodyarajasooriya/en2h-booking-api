import { Body, Controller, Get, Param, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingQueryDto } from './dto/booking-query.dto';

@ApiTags('Booking Management')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post() // Publicly available route per business architecture rules
  @ApiOperation({ summary: 'Create a new customer booking (Public Access)' })
  @ApiResponse({ status: 201, description: 'Booking successfully captured.' })
  @ApiResponse({ status: 400, description: 'Past date / Structural validation reject.' })
  @ApiResponse({ status: 404, description: 'Service lookup identifier failure.' })
  @ApiResponse({ status: 409, description: 'Slot duplication clash.' })
  public async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all bookings with pagination and status filtering (Protected)' })
  @ApiResponse({ status: 200, description: 'Return paginated registry data.' })
  public async findAll(@Query() query: BookingQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific booking by ID (Protected)' })
  @ApiResponse({ status: 200, description: 'Return targeted booking payload.' })
  @ApiResponse({ status: 404, description: 'Booking registry identifier not found.' })
  public async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update booking execution state status (Protected)' })
  @ApiResponse({ status: 200, description: 'Booking status successfully adjusted.' })
  @ApiResponse({ status: 400, description: 'Cancelled-to-Completed illegal rule transition violation.' })
  public async updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explicitly cancel a booking (Protected)' })
  @ApiResponse({ status: 200, description: 'Booking successfully tagged as CANCELLED.' })
  public async cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
