import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    const message = 'Hello API';
    console.log(message)
    return { message: 'Hello API' };
  }
}
