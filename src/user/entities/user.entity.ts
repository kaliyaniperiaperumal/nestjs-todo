import { UUID } from "crypto";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id?: UUID;
  @Column()
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  accessToken?: string;
}
