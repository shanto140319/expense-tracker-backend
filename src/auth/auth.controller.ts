import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: { userName: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.userName,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('/refresh')
  async refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    try {
      const payload = this.jwtService.verify(refresh_token);
      const newAccessToken = this.jwtService.sign(
        { userName: payload.userName, sub: payload.sub },
        { expiresIn: '1h' },
      );
      return { access_token: newAccessToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
