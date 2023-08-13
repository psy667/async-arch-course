import { IsBoolean } from 'class-validator';

export class CompleteTaskDto {
  @IsBoolean()
  completed: boolean;
}
