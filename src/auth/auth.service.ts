import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { PasswordUtil } from '../common/utils/password.util';
import { CartService } from '../cart/cart.service';
import { AddCartItemDto } from '../cart/dto/add-cart-item.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cartService: CartService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    await this.usersService.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.isBanned) {
      throw new UnauthorizedException('Account is banned');
    }
    const matches = await PasswordUtil.compare(dto.password, user.password);
    if (!matches) {
      throw new UnauthorizedException();
    }
    if (dto.guestCartItems?.length) {
      await this.cartService.mergeGuestCart(user.id, dto.guestCartItems);
    }
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    await this.usersService.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user.refreshToken) {
      throw new UnauthorizedException();
    }
    const matches = await PasswordUtil.compare(refreshToken, user.refreshToken);
    if (!matches) {
      throw new UnauthorizedException();
    }
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    await this.usersService.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out' };
  }

  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.accessTokenSecret'),
        expiresIn: this.configService.get<string>('auth.accessTokenExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.refreshTokenSecret'),
        expiresIn: this.configService.get<string>('auth.refreshTokenExpiresIn'),
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
