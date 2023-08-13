import { IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from '../models/user-role.enum';

export class ChangeRoleDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  role!: UserRoleEnum;
}
