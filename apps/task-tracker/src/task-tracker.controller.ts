import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskTrackerService } from './services/task-tracker.service';
import { CurrentUser } from '@app/common/utils/current-user.decorator';
import { User } from './entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('task-tracker')
export class TaskTrackerController {
  constructor(private readonly taskTrackerService: TaskTrackerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.taskTrackerService.create(createTaskDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.taskTrackerService.findAll();
  }

  @Post('reassign')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  reassignTasks() {
    return this.taskTrackerService.reassignTasks();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyTasks(@CurrentUser() user: User) {
    return this.taskTrackerService.findMyTasks(user);
  }

  @Put(':id/complete')
  @UseGuards(JwtAuthGuard)
  completeTask(@Param('id') id: string) {
    return this.taskTrackerService.completeTask(id);
  }
}
