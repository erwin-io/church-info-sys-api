import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { EntityStatus } from "./EntityStatus";

@Index("PK_Notifications", ["notificationId"], { unique: true })
@Entity("Notifications", { schema: "dbo" })
export class Notifications {
  @PrimaryGeneratedColumn({ type: "bigint", name: "NotificationId" })
  notificationId: string;

  @Column("datetime", { name: "Date" })
  date: Date;

  @Column("nvarchar", { name: "Title" })
  title: string;

  @Column("nvarchar", { name: "Description" })
  description: string;

  @Column("bit", { name: "IsReminder", default: () => "(0)" })
  isReminder: boolean;

  @Column("bit", { name: "IsRead", default: () => "(0)" })
  isRead: boolean;

  @ManyToOne(() => Clients, (clients) => clients.notifications)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.notifications)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}
