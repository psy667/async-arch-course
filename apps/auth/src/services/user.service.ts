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

    await this.kafkaProducerService.produce({
      topic: 'users-cud',
      messages: [
        {
          key: 'user_created',
          value: JSON.stringify({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
          }),
        },
      ],
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);

    Object.entries(updateUserDto).forEach(([key, value]) => {
      user[key] = value;
    });

    await this.userRepository.getEntityManager().persistAndFlush(user);

    await this.kafkaProducerService.produce({
      topic: 'users-cud',
      messages: [
        {
          key: 'user_updated',
          value: JSON.stringify({ ...updateUserDto, id }),
        },
      ],
    });

    return user;
  }

  async changeRole(id: string, changeRoleDto: ChangeRoleDto): Promise<User> {
    const user = await this.userRepository.findOne(id);

    user.role = changeRoleDto.role;

    await this.userRepository.getEntityManager().persistAndFlush(user);

    await this.kafkaProducerService.produce({
      topic: 'users',
      messages: [
        {
          key: 'user_role_updated',
          value: JSON.stringify({ id, newRole: changeRoleDto.role }),
        },
      ],
    });

    return user;
  }

  async delete(id: string): Promise<string> {
    const user = await this.userRepository.findOne(id);

    await this.userRepository.getEntityManager().removeAndFlush(user);

    await this.kafkaProducerService.produce({
      topic: 'users-cud',
      messages: [
        {
          key: 'user_deleted',
          value: JSON.stringify({ id }),
        },
      ],
    });

    return id;
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
