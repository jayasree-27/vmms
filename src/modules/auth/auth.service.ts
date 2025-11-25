import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/modules/users/users.service';
import { LoginDto } from '../users/dtos/login.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Redis } from 'ioredis';
import { LoginRateLimiterService } from 'src/common/services/rate-limiter.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly loginRateLimiter: LoginRateLimiterService, 

    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(dto: LoginDto) {

    const email=dto.email;

    if(await this.loginRateLimiter.isBlocked(email)){
      throw new UnauthorizedException(`Too many failed attempts. Please try again later after ${this.loginRateLimiter.BLOCK_DURATION / 60} minutes.`);
    }
    let user;

    try{
      user=await this.validateUser(dto.email, dto.password);
    }catch(e){
      await this.loginRateLimiter.recordFailedAttempt(email);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.loginRateLimiter.resetAttempts(email);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.toUpperCase(),
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '10d',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException("Token missing")
    }

    const decoded = await this.jwt.decode(accessToken)
    if (!decoded || !decoded.exp) {
      throw new UnauthorizedException("Invalid token")
    }

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    if (ttl <= 0) {
      return {
        message: 'Already expired',
        status: true,
      }
    }

    await this.redisClient.set(
      `blacklist:${accessToken}`,
      'true',
      'EX',
      ttl
    );

    return {
      message: 'Logout successfully',
      status: true,
    }
  }
}
