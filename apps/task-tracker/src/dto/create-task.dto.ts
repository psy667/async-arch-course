import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @NotContains('[]', { message: 'Description should not contain [] symbols' })
  description: string;

  @IsString()
  ticket: string;
}
