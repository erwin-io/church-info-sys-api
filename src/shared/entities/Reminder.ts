import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EntityStatus } from "./EntityStatus";

@Index("PK_ReminderI", ["reminderId"], { unique: true })
@Entity("Reminder", { schema: "dbo" })
export class Reminder {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ReminderId" })
  reminderId: string;

  @Column("nvarchar", { name: "Title", length: 250 })
  title: string;

  @Column("nvarchar", { name: "Description" })
  description: string;

  @Column("datetime", { name: "DueDate" })
  dueDate: Date;

  @Column("bit", { name: "Delivered", default: () => "(0)" })
  delivered: boolean;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.reminders)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}
