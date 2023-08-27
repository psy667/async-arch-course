import { Kafka, ProducerRecord } from 'kafkajs';
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { v4 } from 'uuid';
import schema from '../schema';
import Ajv from 'ajv';
import { AllEvents, Event } from '@app/common/events';

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly kafka = new Kafka({
    // TODO: move to config
    brokers: ['kafka:9092'],
  });

  private readonly ajv = new Ajv();
  private readonly schema = schema;

  private readonly producer = this.kafka.producer({
    allowAutoTopicCreation: true,
  });

  async onModuleInit() {
    this.validateSchema();
    await this.producer.connect().then(() => {
      console.log('Kafka producer is connected');
    });
  }
  async validateSchema() {
    for (const key in this.schema) {
      this.ajv.validateSchema(this.schema[key]);
    }
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async produceEvent<T extends AllEvents>(
    topic: string,
    event: Omit<T, 'event_id' | 'event_timestamp'>,
  ) {
    const eventTitle = `${event.event_name}.v${event.event_version}`;

    const validate = this.ajv.compile(this.schema[eventTitle]);
    const eventData = {
      ...event,
      event_id: v4(),
      event_timestamp: Date.now(),
    };

    if (!validate(eventData)) {
      console.log({ errors: validate.errors });
      throw new Error('Invalid event data');
    }

    console.log({ eventData });
    return await this.producer
      .send({
        topic: topic,
        messages: [
          {
            key: event.event_name,
            value: JSON.stringify(eventData),
          },
        ],
      })
      .then(() => {
        console.log('Message sent successfully', {
          topic,
          event_id: eventData.event_id,
        });
      });
  }
}
