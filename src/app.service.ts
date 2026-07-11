import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'EN2H Booking Platform API',
      version: '1.0.0',
      status: 'running',
      docs: '/api/docs',
      timestamp: new Date().toISOString(),
    };
  }
}
