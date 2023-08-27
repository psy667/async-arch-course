import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateUserDto } from '../dto/create-user.dto';
import { KafkaProducerService } from '@app/common/kafka/kafka-producer.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.beak = createUserDto.beak;
    user.role = createUserDto.role;
    user.email = createUserDto.email;
    user.name = createUserDto.name;

    await this.userRepository.getEntityManager().persistAndFlush(user);

    const createdUser = await this.userRepository.findOne(user.id);

    await this.kafkaProducerService.produceEvent('users_streaming', {
      event_version: 1,
      producer: 'auth',
      event_name: 'auth.user_created',
      data: {
        user_id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);

    Object.entries(updateUserDto).forEach(([key, value]) => {
      user[key] = value;
    });

    await this.userRepository.getEntityManager().persistAndFlush(user);

    await this.kafkaProducerService.produceEvent('users_streaming', {
      event_version: 1,
      producer: 'auth',
      event_name: 'auth.user_updated',
      data: {
        user_id: id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

    return user;
  }

  async changeRole(id: string, changeRoleDto: ChangeRoleDto): Promise<User> {
    const user = await this.userRepository.findOne(id);

    user.role = changeRoleDto.role;

    await this.userRepository.getEntityManager().persistAndFlush(user);

    await this.kafkaProducerService.produceEvent('users_streaming', {
      event_version: 1,
      producer: 'auth',
      event_name: 'auth.user_updated',
      data: {
        user_id: id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

    await this.kafkaProducerService.produceEvent('users', {
      event_version: 1,
      producer: 'auth',
      event_name: 'auth.role_changed',
      data: {
        user_id: id,
        role: changeRoleDto.role,
      },
    });

    return user;
  }
  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  findOneByBeak(beak: string): Promise<User> {
    return this.userRepository.findOne({ beak });
  }
}
