// expense.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal')
  categoryId: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
