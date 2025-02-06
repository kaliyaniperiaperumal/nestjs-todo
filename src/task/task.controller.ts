import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UUID } from "crypto";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";

@Controller("task")
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Task created successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request with Mandatory field missing.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: CreateTaskDTO,
    description: "Json structure for user object",
  })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDTO, @Request() req: any) {
    const user: User = await this.userService.findOneById(req.user.id);
    return this.taskService.create({
      ...createTaskDto,
      user,
    });
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Successfully fetched all the tasks under logged in user",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Get("me")
  findByMe(@Request() req: any) {
    return this.taskService.findByMe(req.user.id as UUID);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Successfully fetched all the tasks.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Successfully fetched specific task.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Get(":id")
  findOne(@Param("id") id: UUID) {
    return this.taskService.findOneById(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Task updated successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request with Mandatory field missing.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: CreateTaskDTO,
    description: "Json structure for user object",
  })
  @Patch(":id")
  update(
    @Param("id") id: UUID,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any,
  ) {
    return this.taskService.update(id, updateTaskDto, req.user.id as UUID);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Task deleted successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request. You donot have permission to edit this task.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":id")
  remove(@Param("id") id: UUID, @Request() req: any) {
    return this.taskService.remove(id, req.user.id as UUID);
  }
}
