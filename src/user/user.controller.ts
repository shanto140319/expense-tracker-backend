import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Body() creaUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(creaUserDto);
  }

  @Get('/get/:userName')
  async getUserById(@Param('userName') userName: string): Promise<User> {
    return await this.userService.getUserByUsername(userName);
  }
}
