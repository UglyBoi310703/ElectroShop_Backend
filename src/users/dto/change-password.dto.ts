import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty()
  @MinLength(8)
  newPassword: string;
}
