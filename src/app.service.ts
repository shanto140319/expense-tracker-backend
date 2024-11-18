import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      success: true,
      message: 'I am running',
    };
  }
  getStatus(): any {
    return {
      success: true,
      message: 'Operation completed successfully',
    };
  }
}
