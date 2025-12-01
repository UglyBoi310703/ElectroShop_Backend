import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../../entities/product.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { ProductSpecification } from '../../entities/product-specification.entity';
import { ProductImage } from '../../entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductSpecification,
      ProductImage,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
