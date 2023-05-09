import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Notifications } from "./Notifications";
import { Clients } from "./Clients";
import { MassCategory } from "./MassCategory";
import { MassIntentionType } from "./MassIntentionType";
import { Priest } from "./Priest";
import { ReservationStatus } from "./ReservationStatus";
import { ReservationType } from "./ReservationType";

@Index("pk_reservation_1890105774", ["reservationId"], { unique: true })
@Entity("Reservation", { schema: "dbo" })
export class Reservation {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ReservationId" })
  reservationId: string;

  @Column("date", { name: "ReservationDate" })
  reservationDate: string;

  @Column("character varying", { name: "Time" })
  time: string;

  @Column("character varying", { name: "FullName", nullable: true })
  fullName: string | null;

  @Column("character varying", { name: "WeddingWifeName", nullable: true })
  weddingWifeName: string | null;

  @Column("character varying", { name: "WeddingHusbandName", nullable: true })
  weddingHusbandName: string | null;

  @Column("character varying", { name: "Remarks", nullable: true })
  remarks: string | null;

  @Column("boolean", { name: "IsCancelledByAdmin", default: () => "false" })
  isCancelledByAdmin: boolean;

  @Column("character varying", { name: "AdminRemarks", nullable: true })
  adminRemarks: string | null;

  @OneToMany(() => Notifications, (notifications) => notifications.reservation)
  notifications: Notifications[];

  @ManyToOne(() => Clients, (clients) => clients.reservations)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => MassCategory, (massCategory) => massCategory.reservations)
  @JoinColumn([
    { name: "MassCategoryId", referencedColumnName: "massCategoryId" },
  ])
  massCategory: MassCategory;

  @ManyToOne(
    () => MassIntentionType,
    (massIntentionType) => massIntentionType.reservations
  )
  @JoinColumn([
    {
      name: "MassIntentionTypeId",
      referencedColumnName: "massIntentionTypeId",
    },
  ])
  massIntentionType: MassIntentionType;

  @ManyToOne(() => Priest, (priest) => priest.reservations)
  @JoinColumn([{ name: "PriestId", referencedColumnName: "priestId" }])
  priest: Priest;

  @ManyToOne(
    () => ReservationStatus,
    (reservationStatus) => reservationStatus.reservations
  )
  @JoinColumn([
    {
      name: "ReservationStatusId",
      referencedColumnName: "reservationStatusId",
    },
  ])
  reservationStatus: ReservationStatus;

  @ManyToOne(
    () => ReservationType,
    (reservationType) => reservationType.reservations
  )
  @JoinColumn([
    { name: "ReservationTypeId", referencedColumnName: "reservationTypeId" },
  ])
  reservationType: ReservationType;
}
