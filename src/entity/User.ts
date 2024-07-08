import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Organisation } from "./organizaton";

@Entity()
@Unique(["userId", "email"])
export class User {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column()
  @IsNotEmpty({ message: "First name is required" })
  firstName!: string;

  @Column()
  @IsNotEmpty({ message: "Last name is required" })
  lastName!: string;

  @Column()
  @IsEmail({}, { message: "Email must be valid" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @Column()
  @IsNotEmpty({ message: "Password is required" })
  password!: string;

  @Column({ nullable: true })
  phone!: string;

  @ManyToMany(() => Organisation, (organisation) => organisation.users)
  @JoinTable()
  organisations!: Organisation[];
}
