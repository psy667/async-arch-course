import { Controller, Get, Param } from '@nestjs/common';
import { AccountingService } from './services/accounting.service';

@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('balance/:accountId')
  async getBalance(@Param('accountId') accountId: string) {
    return this.accountingService.getBalance(accountId);
  }

  @Get('transactions/:accountId')
  async getTransactions(@Param('accountId') accountId: string) {
    return this.accountingService.getTransactions(accountId);
  }

  @Get('transactions')
  async getAllTransactions() {
    return this.accountingService.getAllTransactions();
  }
}
