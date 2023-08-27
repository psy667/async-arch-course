import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { EntityManager } from '@mikro-orm/core';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRoleEnum } from '@app/common/events';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async selectRandomEmployee(): Promise<User> {
    return this.userRepository
      .createQueryBuilder()
      .select('*')
      .where({ role: UserRoleEnum.EMPLOYEE })
      .getKnexQuery()
      .orderByRaw('RANDOM()')
      .limit(1)
      .then((it) => it[0]);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({ ...userDto });

    console.log({ user });

    await this.entityManager.persistAndFlush(user);
    return user;
  }

  async findOne(userId: string) {
    return this.userRepository.findOne({ id: userId });
  }

  async deleteUser(id: string) {
    return this.userRepository.getEntityManager().removeAndFlush({ id });
  }

  async updateUser(params: {
    role: UserRoleEnum;
    name: string;
    id: string;
    email: string;
  }) {
    const user = await this.userRepository.findOne(params.id);
    user.role = params.role;
    user.name = params.name;
    user.email = params.email;

    await this.userRepository.getEntityManager().persistAndFlush(user);
    return user;
  }
}
