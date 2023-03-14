import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReservationType } from "./ReservationType";
import { MassCategory } from "./MassCategory";
import { MassIntentionType } from "./MassIntentionType";
import { Clients } from "./Clients";
import { ReservationStatus } from "./ReservationStatus";

@Index("PK_Reservation", ["reservationId"], { unique: true })
@Entity("Reservation", { schema: "dbo" })
export class Reservation {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ReservationId" })
  reservationId: string;

  @Column("date", { name: "ReservationDate" })
  reservationDate: Date;

  @Column("nvarchar", { name: "Time", length: 50 })
  time: string;

  @Column("nvarchar", { name: "FirstName", nullable: true, length: 250 })
  firstName: string | null;

  @Column("nvarchar", { name: "LastName", nullable: true, length: 250 })
  lastName: string | null;

  @Column("nvarchar", { name: "WeddingWifeName", nullable: true })
  weddingWifeName: string | null;

  @Column("nvarchar", { name: "WeddingHusbandName", nullable: true })
  weddingHusbandName: string | null;

  @Column("nvarchar", { name: "Remarks", nullable: true })
  remarks: string | null;

  @Column("bit", { name: "IsCancelledByAdmin", default: () => "(0)" })
  isCancelledByAdmin: boolean;

  @Column("nvarchar", { name: "AdminRemarks", nullable: true })
  adminRemarks: string | null;

  @ManyToOne(
    () => ReservationType,
    (reservationType) => reservationType.reservations
  )
  @JoinColumn([
    { name: "ReservationTypeId", referencedColumnName: "reservationTypeId" },
  ])
  reservationType: ReservationType;

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

  @ManyToOne(() => Clients, (clients) => clients.reservations)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

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
}
