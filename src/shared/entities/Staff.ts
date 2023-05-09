import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Gender } from "./Gender";
import { Users } from "./Users";

@Index("pk_staff", ["staffId"], { unique: true })
@Entity("Staff", { schema: "dbo" })
export class Staff {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StaffId" })
  staffId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "Email" })
  email: string;

  @Column("character varying", { name: "MobileNumber" })
  mobileNumber: string;

  @ManyToOne(() => Gender, (gender) => gender.staff)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;

  @ManyToOne(() => Users, (users) => users.staff)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
