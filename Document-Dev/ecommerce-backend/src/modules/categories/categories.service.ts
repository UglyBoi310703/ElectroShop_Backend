import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CategorySpecificationTemplate } from '../../entities/category-specification-template.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategorySpecificationTemplate)
    private specTemplateRepository: Repository<CategorySpecificationTemplate>,
  ) {}

  async findAll(includeChildren: boolean = false) {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy('category.sortOrder', 'ASC');

    if (includeChildren) {
      query.leftJoinAndSelect('category.children', 'children');
    }

    return query.getMany();
  }

  async getCategoryTree() {
    // Get root categories (parent_id is null)
    const rootCategories = await this.categoryRepository.find({
      where: { parentId: IsNull(), isActive: true },
      relations: ['children'],
      order: { sortOrder: 'ASC' },
    });

    // Load children recursively
    for (const category of rootCategories) {
      if (category.children && category.children.length > 0) {
        await this.loadChildren(category.children);
      }
    }

    return rootCategories;
  }

  private async loadChildren(categories: Category[]) {
    for (const category of categories) {
      const withChildren = await this.categoryRepository.findOne({
        where: { categoryId: category.categoryId },
        relations: ['children'],
      });
      
      if (withChildren.children && withChildren.children.length > 0) {
        category.children = withChildren.children;
        await this.loadChildren(category.children);
      }
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async getSpecTemplates(categoryId: number) {
    await this.findOne(categoryId); // Verify category exists

    const templates = await this.specTemplateRepository.find({
      where: { categoryId },
      order: { specGroup: 'ASC', sortOrder: 'ASC' },
    });

    // Group by spec_group
    const grouped = templates.reduce((acc, template) => {
      const group = template.specGroup || 'Other';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(template);
      return acc;
    }, {});

    return {
      categoryId,
      templates: grouped,
      totalCount: templates.length,
    };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async createSpecTemplate(categoryId: number, templateDto: any) {
    await this.findOne(categoryId); // Verify category exists

    const template = this.specTemplateRepository.create({
      categoryId,
      ...templateDto,
    });

    return this.specTemplateRepository.save(template);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    
    // Check if category has children
    if (category.children && category.children.length > 0) {
      throw new Error('Cannot delete category with children');
    }

    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
