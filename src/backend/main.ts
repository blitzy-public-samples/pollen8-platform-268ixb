import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Get the ConfigService to access environment variables
  const configService = app.get(ConfigService);

  // Set up global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set up global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set up global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configure security headers using Helmet
  app.use(helmet());

  // Enable compression
  app.use(compression());

  // Configure CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Set up Swagger API documentation
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Pollen8 API')
      .setDescription('The Pollen8 API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Start the application listening on the specified port
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Call the bootstrap function to start the application
bootstrap();