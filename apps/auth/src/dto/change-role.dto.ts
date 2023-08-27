import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '@app/common/events';

export class ChangeRoleDto {
  @ApiProperty()
  @IsEnum(UserRoleEnum)
  role!: UserRoleEnum;
}
