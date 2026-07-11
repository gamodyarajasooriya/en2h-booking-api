import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: dto,
    });
  }

  public async findAll() {
    return this.prisma.service.findMany();
  }

  public async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  public async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id); // Ensures service exists first
    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  public async remove(id: string) {
    await this.findOne(id); // Ensures service exists first
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
