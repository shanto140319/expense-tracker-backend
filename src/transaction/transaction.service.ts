import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from 'src/dtos/createTransaction.dto';
import { UpdateTransactionDto } from 'src/dtos/UpdateTransactio.dto';
import { Transaction } from 'src/entities/transaction.entity';
import { User } from 'src/entities/user.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createExpense(
    createTransactionDto: CreateTransactionDto,
    userId: any,
  ): Promise<Transaction> {
    if (!userId) throw new NotFoundException('User not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user,
    });
    return await this.transactionRepository.save(transaction);
  }

  async getTransactions(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<Transaction[]> {
    if (!userId) throw new Error('User not found');
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate) {
      throw new NotFoundException('start date and end date empty');
    }
    return await this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdDate: Between(start, end),
      },
      relations: ['category', 'user'],
      order: {
        createdDate: 'DESC', // Sort by createdDate in descending order
      },
    });
  }

  async getTransaction(id: number, userId: number): Promise<Transaction> {
    if (!userId) throw new Error('User not found');
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category', 'user'],
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async updateExpense(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    if (!userId) throw new Error('User not found');
    const transaction = await this.getTransaction(id, userId);
    Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: number, userId: number): Promise<void> {
    if (!userId) throw new Error('User not found');
    const transaction = await this.getTransaction(id, userId);
    if (!transaction) {
      throw new NotFoundException(
        'Transaction not found or user not authorized to delete this category',
      );
    }

    await this.transactionRepository.delete(id);
  }
}
