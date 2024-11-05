import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
