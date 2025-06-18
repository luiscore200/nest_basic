import { Module, ValidationPipe } from '@nestjs/common';

import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { RoleModule } from './role/role.module';
import { JwtService } from './auth/jwt/jwt.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { CommonModule } from './common/common.module';
import { LocationModule } from './location/location.module';


@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,

    RoleModule,

    AuthModule,

    UserModule,

    CommonModule,

    LocationModule, 
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Validación global
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
   
  ],
})
export class AppModule {}
