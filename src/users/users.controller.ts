import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user) {
    const entity = await this.usersService.findOne(user.id);
    return this.sanitize(entity);
  }

  @Patch('me/profile')
  async updateProfile(@CurrentUser() user, @Body() dto: UpdateProfileDto) {
    const entity = await this.usersService.updateProfile(user.id, dto);
    return this.sanitize(entity);
  }

  @Patch('me/password')
  changePassword(@CurrentUser() user, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => this.sanitize(user));
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/ban')
  async ban(@Param('id') id: string) {
    const user = await this.usersService.banUser(id);
    return this.sanitize(user);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/unban')
  async unban(@Param('id') id: string) {
    const user = await this.usersService.unbanUser(id);
    return this.sanitize(user);
  }

  private sanitize(user) {
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
