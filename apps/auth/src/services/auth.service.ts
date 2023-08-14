import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from '../models/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.findOneByBeak(loginDto.beak);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const expires = new Date();

    expires.setSeconds(
      expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION'),
    );

    const jwtPayload = {
      userId: user.id,
      role: user.role as UserRoleEnum,
    };

    return this.jwtService.sign(jwtPayload);
  }

  async verifyUser(beak: string) {
    const user = await this.userService.findOneByBeak(beak);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
