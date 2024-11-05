import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
