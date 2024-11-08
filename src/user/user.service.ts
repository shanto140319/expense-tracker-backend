import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { User } from 'src/entities/user.entity';
import { sendPasswordResetEmail } from 'src/util/nodeMailer';
import { ILike, MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userName, email, password } = createUserDto;

    // Check if the username has only alphanumeric characters and underscores, with no spaces
    const isValidUsername = /^[a-zA-Z0-9_]+$/.test(userName);
    if (!isValidUsername) {
      throw new BadRequestException(
        'Username can only contain letters, numbers, and underscores, with no spaces.',
      );
    }

    // Check if the user or email already exists
    const existingUser = await this.getUserByUsernameOrEmail(userName);
    const existingEmail = await this.getUserByUsernameOrEmail(email);

    if (existingUser || existingEmail) {
      throw new ConflictException(
        `Username or email already exists. Please log in.`,
      );
    }

    // Hash the password and create a new user
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async getUserByUsernameOrEmail(
    identifier: string,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: [
        { userName: ILike(`%${identifier}%`) },
        { email: ILike(`%${identifier}%`) },
      ],
    });
    return user;
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.getUserByUsernameOrEmail(email);

    if (!user) throw new NotFoundException('User not found');

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 mins

    // Save token and expiration in user record
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await this.userRepository.save(user);
    return sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { resetToken, resetTokenExpires: MoreThan(new Date()) },
    });
    if (!user) throw new NotFoundException('User not found');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    // Clear the reset token and expiration
    user.resetToken = null;
    user.resetTokenExpires = null;

    return await this.userRepository.update(user.id, user);
  }
}
