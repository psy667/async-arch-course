import { IsEnum } from 'class-validator';
import { UserRoleEnum } from '../models/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleDto {
  @ApiProperty()
  @IsEnum(UserRoleEnum)
  role!: UserRoleEnum;
}
