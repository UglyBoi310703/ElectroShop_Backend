import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Static files (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger Documentation
  if (configService.get<boolean>('SWAGGER_ENABLED', true)) {
    const config = new DocumentBuilder()
      .setTitle(configService.get<string>('SWAGGER_TITLE', 'E-commerce API'))
      .setDescription(
        configService.get<string>(
          'SWAGGER_DESCRIPTION',
          'E-commerce Backend API Documentation',
        ),
      )
      .setVersion(configService.get<string>('SWAGGER_VERSION', '1.0'))
      .addBearerAuth()
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management')
      .addTag('Categories', 'Category management')
      .addTag('Brands', 'Brand management')
      .addTag('Products', 'Product management')
      .addTag('Specifications', 'Product specifications')
      .addTag('Variants', 'Product variants')
      .addTag('Cart', 'Shopping cart')
      .addTag('Orders', 'Order management')
      .addTag('Reviews', 'Product reviews')
      .addTag('Coupons', 'Coupon management')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log(`📚 Swagger documentation: http://localhost:${configService.get<number>('PORT', 3000)}/${swaggerPath}`);
  }

  // Start server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`🌍 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
}

bootstrap();
