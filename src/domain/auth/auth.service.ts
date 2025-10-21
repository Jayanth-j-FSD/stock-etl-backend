import { Injectable } from '@nestjs/common';
import { AuthUseCases } from './auth.use-cases';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authUseCases: AuthUseCases) {}

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    return this.authUseCases.register(registerDto);
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authUseCases.login(loginDto);
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponseDto> {
    return this.authUseCases.refreshTokens(refreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    return this.authUseCases.logout(refreshToken);
  }

  async validateUser(userId: string) {
    return this.authUseCases.validateUser(userId);
  }
}
