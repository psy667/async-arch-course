import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '@app/common/kafka/kafka-consumer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    private readonly consumerService: KafkaConsumerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    console.log('Initializing consumer in Task Tracker ms');
    await this.consumerService.consumeWithEventEmitter(
      'task-tracker',
      { topics: ['users', 'users_streaming'], fromBeginning: true },
      this.eventEmitter,
    );
    console.log('Consumer in Task Tracker ms is initialized');
  }
}
