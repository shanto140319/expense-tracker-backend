export class UpdateCategoryDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  categoryType?: 'income' | 'expense';
  userId: number;
}
