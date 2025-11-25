import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from 'src/config/config.module';
import { LoginRateLimiterService } from 'src/common/services/rate-limiter.service';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET123',
      signOptions: { expiresIn: '10d' },
    }),
    RedisModule
  ],
  providers: [AuthService, JwtStrategy, LoginRateLimiterService],
  controllers: [],
  exports:[AuthService]
})
export class AuthModule {}
