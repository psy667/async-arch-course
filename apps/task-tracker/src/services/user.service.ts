import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { EntityManager } from '@mikro-orm/core';
import { ChangeRoleDto } from '../dto/change-role.dto';

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
      .getKnexQuery()
      .orderByRaw('RANDOM()')
      .limit(1);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({ ...userDto });

    await this.entityManager.persistAndFlush(user);
    return user;
  }

  async findOne(userId: string) {
    return this.userRepository.findOne({ id: userId });
  }

  async deleteUser(id: string) {
    return this.userRepository.getEntityManager().removeAndFlush({ id });
  }

  async updateUser(id: string, userDto: CreateUserDto) {
    const user = await this.userRepository.findOne(id);
    Object.entries(userDto).forEach(([key, value]) => {
      user[key] = value;
    });
    await this.userRepository.getEntityManager().persistAndFlush(user);
    return user;
  }

  async changeRole(changeRoleDto: ChangeRoleDto) {
    const user = await this.userRepository.findOne(changeRoleDto.userId);

    user.role = changeRoleDto.role;
    await this.userRepository.getEntityManager().persistAndFlush(user);

    return user;
  }
}
