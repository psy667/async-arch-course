import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'beak',
    });
  }

  async validate(beak: string) {
    try {
      return await this.authService.verifyUser(beak);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
