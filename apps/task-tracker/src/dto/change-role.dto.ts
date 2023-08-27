import { IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from '@app/common/events';

export class ChangeRoleDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  role!: UserRoleEnum;
}
