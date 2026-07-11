import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

// PartialType makes all fields from CreateServiceDto optional for update requests
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
