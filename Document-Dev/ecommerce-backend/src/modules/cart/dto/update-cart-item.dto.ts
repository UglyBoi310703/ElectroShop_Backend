import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
    @ApiProperty({ example: 5 })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}
