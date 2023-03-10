import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("PK_Messages", ["messageId"], { unique: true })
@Entity("Messages", { schema: "dbo" })
export class Messages {
  @PrimaryGeneratedColumn({ type: "bigint", name: "MessageId" })
  messageId: string;

  @Column("text", { name: "Message" })
  message: string;

  @Column("datetime", { name: "DateTime" })
  dateTime: Date;

  @Column("bit", { name: "IsClient", default: () => "(0)" })
  isClient: boolean;

  @ManyToOne(() => Users, (users) => users.messages)
  @JoinColumn([{ name: "FromUserId", referencedColumnName: "userId" }])
  fromUser: Users;

  @ManyToOne(() => Users, (users) => users.messages2)
  @JoinColumn([{ name: "ToUserId", referencedColumnName: "userId" }])
  toUser: Users;
}
