import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RefreshToken } from './refresh-token.entity';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { AuthUseCases } from './auth.use-cases';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../users/user.repository';
import { AuthController } from '../../application/controllers/auth.controller';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, User]),
    PassportModule,
    JwtModule.register({}), // Configuration will be done in strategies
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthUseCases,
    AuthRepository,
    UserRepository,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
