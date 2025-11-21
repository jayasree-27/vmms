import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const jwtConfig = async (configService: ConfigService) => ({
  secret: configService.get('JWT_SECRET'),
});
