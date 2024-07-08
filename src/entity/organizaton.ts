import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { User } from "./User";

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  orgId!: number;

  @Column()
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.organisations)
  users!: User[];
}
