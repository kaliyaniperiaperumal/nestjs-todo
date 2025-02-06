import { UUID } from "crypto";
import { User } from "src/user/entities/user.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TaskPriority } from "../types/TaskPriority";

@Entity({ name: "task" })
export class Task {
  @PrimaryGeneratedColumn()
  id?: UUID;

  @Column()
  name: string;

  @Column()
  dueDate: Date;

  @Column({ type: "enum", enum: TaskPriority })
  priority: TaskPriority;

  @Column({ name: "user_id" })
  userId?: UUID;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user?: User;
}
