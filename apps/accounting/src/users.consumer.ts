import { OnEvent } from '@nestjs/event-emitter';
import { AccountingService } from './services/accounting.service';
import { EventNameAndVersion, UserCreatedV1Event } from '@app/common/events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersConsumer {
  constructor(private readonly accountingService: AccountingService) {}

  @OnEvent('auth.user_created.v1' satisfies EventNameAndVersion)
  async handleTaskCreated(payload: UserCreatedV1Event) {
    console.log('UserCreatedV1Event');
    await this.accountingService.createAccount(payload.data);
  }
}
