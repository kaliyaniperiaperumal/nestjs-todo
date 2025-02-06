import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { TaskPriority } from "../types/TaskPriority";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDTO {
  @ApiProperty({
    example: "Sample test",
    required: true,
  })
  @IsString()
  @MinLength(2, { message: "Name must have atleast 2 characters." })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "0",
    required: true,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    example: "2025-04-23T18:25:43.511Z",
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;
}
