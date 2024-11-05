import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dtos/createCategory.dto';
import { UpdateCategoryDto } from 'src/dtos/updateCategory.dto';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createCategory(
    userId: any,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    if (!userId) throw new NotFoundException('User not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      user,
    });
    return await this.categoryRepository.save(newCategory);
  }

  async getAllCategories(userId: number): Promise<Category[]> {
    if (!userId) throw new NotFoundException('User not found');
    return await this.categoryRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getCategoryById(userId: number, categoryId: number): Promise<Category> {
    if (!userId) throw new NotFoundException('User not found');

    return await this.categoryRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
    });
  }

  async updateCategory(
    id: number,
    userId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (!userId) throw new NotFoundException('User not found');

    const category = await this.categoryRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!category) {
      throw new Error(
        'Category not found or user not authorized to update this category',
      );
    }

    const updatedCategory = Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(updatedCategory);
  }

  async deleteCategory(id: number, userId: number): Promise<void> {
    if (!userId) throw new NotFoundException('User not found');
    const category = await this.categoryRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!category) {
      throw new Error(
        'Category not found or user not authorized to delete this category',
      );
    }

    await this.categoryRepository.delete(id);
  }
}
