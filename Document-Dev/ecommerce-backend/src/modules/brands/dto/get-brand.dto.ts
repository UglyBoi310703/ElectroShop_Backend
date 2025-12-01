import { ApiProperty } from '@nestjs/swagger';

export class GetBrandDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    brandName: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    logoUrl: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    website: string;

    @ApiProperty()
    country: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
