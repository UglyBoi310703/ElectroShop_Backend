import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import {
    UpdateUserDto,
    ChangePasswordDto,
    GetUserProfileDto,
} from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getUserProfile(userId: number): Promise<GetUserProfileDto> {
        const user = await this.userRepository.findOne({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { password, ...result } = user;
        return result as GetUserProfileDto;
    }

    async updateUserProfile(
        userId: number,
        updateUserDto: UpdateUserDto,
    ): Promise<GetUserProfileDto> {
        const user = await this.userRepository.findOne({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);

        const { password, ...result } = user;
        return result as GetUserProfileDto;
    }

    async changePassword(
        userId: number,
        changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.oldPassword,
            user.password,
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Old password is incorrect');
        }

        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userRepository.save(user);

        return { message: 'Password changed successfully' };
    }

    async getUserById(userId: number): Promise<User> {
        return this.userRepository.findOne({
            where: { userId },
        });
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({
            where: { email },
        });
    }
}
