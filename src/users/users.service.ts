import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { PasswordUtil } from '../common/utils/password.util';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto, role: UserRole = UserRole.CUSTOMER) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds =
      this.configService.get<number>('auth.bcryptSaltRounds') ?? 12;
    const password = await PasswordUtil.hash(dto.password, saltRounds);

    const user = this.usersRepository.create({
      ...dto,
      password,
      role,
    });

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({
      relations: ['addresses'],
    });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'name',
        'phone',
        'role',
        'isBanned',
        'refreshToken',
      ],
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['addresses'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.findOne(id);
    const matches = await PasswordUtil.compare(dto.currentPassword, user.password);
    if (!matches) {
      throw new ConflictException('Current password is incorrect');
    }
    const saltRounds =
      this.configService.get<number>('auth.bcryptSaltRounds') ?? 12;
    user.password = await PasswordUtil.hash(dto.newPassword, saltRounds);
    return this.usersRepository.save(user);
  }

  async banUser(id: string) {
    const user = await this.findOne(id);
    user.isBanned = true;
    return this.usersRepository.save(user);
  }

  async unbanUser(id: string) {
    const user = await this.findOne(id);
    user.isBanned = false;
    return this.usersRepository.save(user);
  }

  async storeRefreshToken(userId: string, refreshToken: string) {
    const saltRounds =
      this.configService.get<number>('auth.bcryptSaltRounds') ?? 12;
    const hashed = await PasswordUtil.hash(refreshToken, saltRounds);
    await this.usersRepository.update(userId, { refreshToken: hashed });
  }

  async clearRefreshToken(userId: string) {
    await this.usersRepository.update(userId, { refreshToken: null });
  }
}
