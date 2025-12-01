import { IsString, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    fullName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsString()
    dateOfBirth?: string;
}

export class ChangePasswordDto {
    @IsString()
    @MinLength(6)
    oldPassword: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}

export class GetUserProfileDto {
    userId: number;
    email: string;
    fullName: string;
    phone: string;
    avatarUrl: string;
    gender: string;
    dateOfBirth: Date;
    userType: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    lastLogin: Date;
}
