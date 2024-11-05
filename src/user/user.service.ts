import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.getUserByUsername(createUserDto.userName);

    if (existingUser)
      throw new ConflictException(
        `Username ${createUserDto.userName} already exists. Please log in.`,
      );

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async getUserByUsername(userName: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { userName } });
    return user;
  }
}
