import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'includeChildren', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAll(@Query('includeChildren') includeChildren?: boolean) {
    return this.categoriesService.findAll(includeChildren);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get categories as tree structure' })
  @ApiResponse({ status: 200, description: 'Category tree retrieved successfully' })
  async getTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/spec-templates')
  @ApiOperation({ summary: 'Get specification templates for category' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async getSpecTemplates(@Param('id') id: number) {
    return this.categoriesService.getSpecTemplates(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new category (Admin only)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Post(':id/spec-templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create specification template (Admin only)' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createSpecTemplate(@Param('id') id: number, @Body() templateDto: any) {
    return this.categoriesService.createSpecTemplate(id, templateDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async remove(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
