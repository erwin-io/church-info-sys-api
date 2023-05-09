import { Column, Entity, Index, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Index("ReservationType_pkey", ["reservationTypeId"], { unique: true })
@Entity("ReservationType", { schema: "dbo" })
export class ReservationType {
  @Column("bigint", { primary: true, name: "ReservationTypeId" })
  reservationTypeId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.reservationType)
  reservations: Reservation[];
}
