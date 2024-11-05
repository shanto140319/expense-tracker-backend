import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  categoryType: 'expense' | 'income';

  @Column({ default: '' })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.categories, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
