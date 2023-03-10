import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Gender } from "./Gender";

@Index("PK_Staff", ["staffid"], { unique: true })
@Entity("Staff", { schema: "dbo" })
export class Staff {
  @PrimaryGeneratedColumn({ type: "bigint", name: "Staffid" })
  staffid: string;

  @Column("nvarchar", { name: "Name", length: 250 })
  name: string;

  @Column("nvarchar", { name: "Email", length: 250 })
  email: string;

  @Column("nvarchar", { name: "MobileNumber", length: 250 })
  mobileNumber: string;

  @ManyToOne(() => Users, (users) => users.staff)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Gender, (gender) => gender.staff)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;
}
