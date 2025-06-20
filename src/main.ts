import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor'; // Importar ResponseInterceptor

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor()); // Aplicar ResponseInterceptor globalmente
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
