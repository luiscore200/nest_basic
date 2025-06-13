import { 
    Injectable, 
    NotFoundException, 
    ConflictException, 
    InternalServerErrorException 
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from './user.entity';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  
  @Injectable()
  export class UserService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}
  
    async create(createUserDto: CreateUserDto): Promise<User> {
      try {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
      } catch (error) {
        // Manejo de errores específicos de SQLite
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === 'SQLITE_CONSTRAINT') {
          throw new ConflictException('Email already exists');
        }
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  
    async findAll(): Promise<User[]> {
      try {
        return await this.userRepository.find({
          where: { isActive: true },
          select: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt'],
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to retrieve users');
      }
    }
  
    async findOne(id: number): Promise<User> {
      try {
        const user = await this.userRepository.findOne({
          where: { id, isActive: true },
          select: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt'],
        });
  
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
  
        return user;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to retrieve user');
      }
    }
  
    async findByEmail(email: string): Promise<User | null> {
      try {
        return await this.userRepository.findOne({
          where: { email, isActive: true },
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to find user by email');
      }
    }
  
    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
      try {
        const user = await this.findOne(id);
        
        // Si se está actualizando el email, verificar que no exista
        if (updateUserDto.email && updateUserDto.email !== user.email) {
          const existingUser = await this.findByEmail(updateUserDto.email);
          if (existingUser) {
            throw new ConflictException('Email already exists');
          }
        }
  
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
      } catch (error) {
        if (error instanceof NotFoundException || error instanceof ConflictException) {
          throw error;
        }
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === 'SQLITE_CONSTRAINT') {
          throw new ConflictException('Email already exists');
        }
        throw new InternalServerErrorException('Failed to update user');
      }
    }
  
    async remove(id: number): Promise<void> {
      try {
        const user = await this.findOne(id);
        // Soft delete - marcar como inactivo
        user.isActive = false;
        await this.userRepository.save(user);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to delete user');
      }
    }
  
    async hardDelete(id: number): Promise<void> {
      try {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to permanently delete user');
      }
    }
  
    // Método útil para contar usuarios activos
    async count(): Promise<number> {
      try {
        return await this.userRepository.count({
          where: { isActive: true },
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to count users');
      }
    }
  }
  