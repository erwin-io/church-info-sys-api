import { Column, Entity, Index, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Index("PK_ReservationType", ["reservationTypeId"], { unique: true })
@Entity("ReservationType", { schema: "dbo" })
export class ReservationType {
  @Column("bigint", { primary: true, name: "ReservationTypeId" })
  reservationTypeId: string;

  @Column("nvarchar", { name: "Name", length: 250 })
  name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.reservationType)
  reservations: Reservation[];
}
