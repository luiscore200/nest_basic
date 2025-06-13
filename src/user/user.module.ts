import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    // Importar la entidad User para que TypeORM la reconozca en este módulo
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService, // Exportar el servicio para usarlo en otros módulos
    TypeOrmModule // Exportar TypeOrmModule si otros módulos necesitan acceso directo al repositorio
  ],
})
export class UserModule {}
