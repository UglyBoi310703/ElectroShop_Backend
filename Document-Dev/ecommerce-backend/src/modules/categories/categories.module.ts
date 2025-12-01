import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from '../../entities/category.entity';
import { CategorySpecificationTemplate } from '../../entities/category-specification-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategorySpecificationTemplate])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
