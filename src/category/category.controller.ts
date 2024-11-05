import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { CreateCategoryDto } from 'src/dtos/createCategory.dto';
import { UpdateCategoryDto } from 'src/dtos/updateCategory.dto';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: any,
  ): Promise<Category> {
    return await this.categoryService.createCategory(
      req.user.userId,
      createCategoryDto,
    );
  }

  @Get('/getall')
  async getAllCategories(@Request() req: any): Promise<Category[]> {
    return await this.categoryService.getAllCategories(req.user.userId);
  }

  @Get('/get/:id')
  async getCategoryById(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<Category> {
    return await this.categoryService.getCategoryById(req.user.userId, id);
  }

  @Put('/update/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: any,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(
      id,
      req.user.userId,
      updateCategoryDto,
    );
  }

  @Delete('/delete/:id')
  async deleteCategory(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<void> {
    console.log('id====', id);
    console.log('req.user.userId', req.user.userId);
    return await this.categoryService.deleteCategory(id, req.user.userId);
  }
}
