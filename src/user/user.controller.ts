import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseManager } from '../common/utils/response-manager.util';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const user = await this.userService.create(createUserDto);
    return ResponseManager.created(
      user,
      'User created successfully',
      req.url,
    );
  }

  @Get()
  async findAll(@Req() req: Request) {
    const users = await this.userService.findAll();
    return ResponseManager.success(
      users,
      'Users retrieved successfully',
      HttpStatus.OK,
      req.url,
    );
  }

  @Get('count')
  async count(@Req() req: Request) {
    const count = await this.userService.count();
    return ResponseManager.success(
      { count },
      'User count retrieved successfully',
      HttpStatus.OK,
      req.url,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = await this.userService.findOne(id);
    return ResponseManager.success(
      user,
      'User retrieved successfully',
      HttpStatus.OK,
      req.url,
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return ResponseManager.updated(
      user,
      'User updated successfully',
      req.url,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    await this.userService.remove(id);
    return ResponseManager.deleted(
      'User deleted successfully',
      req.url,
    );
  }
}