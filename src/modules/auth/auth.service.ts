import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/modules/users/users.service';
import { LoginDto } from '../users/dtos/login.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role?.name,
      },
    };
  }
}
