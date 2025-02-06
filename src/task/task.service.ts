import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRespository: Repository<Task>,
  ) {}
  create(task: Task) {
    return this.taskRespository.save(task);
  }

  findAll() {
    return this.taskRespository.find({});
  }

  findByMe(userId: UUID) {
    return this.taskRespository.find({ where: { user: { id: userId } } });
  }

  findOneById(id: UUID) {
    return this.taskRespository.findOneBy({ id });
  }

  async update(id: UUID, updateTaskDto: UpdateTaskDto, userId: UUID) {
    const task = await this.taskRespository.findOneBy({ id });
    if (task.userId !== userId)
      throw new BadRequestException(
        "You donot have permission to edit this task",
      );
    return this.taskRespository.update(id, updateTaskDto);
  }

  async remove(id: UUID, userId: UUID) {
    const task = await this.taskRespository.findOneBy({ id });
    if (task.userId !== userId)
      throw new BadRequestException(
        "You donot have permission to delete this task",
      );
    return this.taskRespository.delete(id);
  }
}
