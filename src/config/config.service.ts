import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('nodeEnv') ?? 'development';
  }

  get port(): number {
    return this.configService.get<number>('port') ?? 5000;
  }

  get database() {
    return this.configService.get('database');
  }

  get auth() {
    return this.configService.get('auth');
  }
}
