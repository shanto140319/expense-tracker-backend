import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CreateTransactionDto } from 'src/dtos/createTransaction.dto';
import { UpdateTransactionDto } from 'src/dtos/UpdateTransactio.dto';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/create')
  async createExpense(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ): Promise<Transaction> {
    return await this.transactionService.createExpense(
      createTransactionDto,
      req.user.userId,
    );
  }

  @Get('/getall')
  async getExpenses(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Transaction[]> {
    return await this.transactionService.getTransactions(
      req.user.userId,
      startDate,
      endDate,
    );
  }

  @Get('/get/:id')
  async getExpenseById(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<Transaction> {
    return await this.transactionService.getTransaction(id, req.user.userId);
  }

  @Put('/update/:id')
  async updateExpense(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: any,
  ): Promise<Transaction> {
    return await this.transactionService.updateExpense(
      id,
      req.user.userId,
      updateTransactionDto,
    );
  }

  @Delete('/delete/:id')
  async deleteExpense(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<void> {
    return await this.transactionService.deleteTransaction(id, req.user.userId);
  }
}
