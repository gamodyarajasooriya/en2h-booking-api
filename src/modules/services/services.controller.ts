import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Service Management')
@ApiBearerAuth() // Tells Swagger that these endpoints require Bearer Auth token authorization
@UseGuards(JwtAuthGuard) // Enforces the business rule: Only authenticated users can manage services
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access allocation.' })
  public async create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Return all services list.' })
  public async findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific service by ID' })
  @ApiResponse({ status: 200, description: 'Return the service object.' })
  @ApiResponse({ status: 404, description: 'Service parameter identifier not found.' })
  public async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiResponse({ status: 200, description: 'Service successfully updated.' })
  @ApiResponse({ status: 404, description: 'Service parameter identifier not found.' })
  public async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Service parameter identifier not found.' })
  public async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
