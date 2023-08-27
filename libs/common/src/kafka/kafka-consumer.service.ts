import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNames } from '@app/common/events';

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    // TODO: move to config
    brokers: ['kafka:9092'],
  });
  private readonly consumers: Consumer[] = [];

  async consume(
    groupId: string,
    topics: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
  ) {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async consumeWithEventEmitter(
    groupId: string,
    topics: ConsumerSubscribeTopics,
    eventEmitter: EventEmitter2,
  ) {
    await this.consume(groupId, topics, {
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        const eventName = message.key.toString() + '.v' + event.event_version;
        console.log('event', eventName);
        eventEmitter.emit(eventName, event);
      },
    });
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
