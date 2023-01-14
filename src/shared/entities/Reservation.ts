import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { ReservationStatus } from "./ReservationStatus";
import { ReservationType } from "./ReservationType";

@Index("PK_Reservation", ["reservationId"], { unique: true })
@Entity("Reservation", { schema: "dbo" })
export class Reservation {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ReservationId" })
  reservationId: string;

  @Column("date", { name: "ReservationDate" })
  reservationDate: Date;

  @Column("nvarchar", { name: "Time", length: 50 })
  time: string;

  @Column("nvarchar", { name: "Remarks", nullable: true })
  remarks: string | null;

  @Column("bit", { name: "IsCancelledByAdmin", default: () => "(0)" })
  isCancelledByAdmin: boolean;

  @Column("nvarchar", { name: "AdminRemarks", nullable: true })
  adminRemarks: string | null;

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

  @ManyToOne(
    () => ReservationType,
    (reservationType) => reservationType.reservations
  )
  @JoinColumn([
    { name: "ReservationTypeId", referencedColumnName: "reservationTypeId" },
  ])
  reservationType: ReservationType;
}
