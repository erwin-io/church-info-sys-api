import { Column, Entity, Index, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Index("pk_massIntentiontype", ["massIntentionTypeId"], { unique: true })
@Entity("MassIntentionType", { schema: "dbo" })
export class MassIntentionType {
  @Column("bigint", { primary: true, name: "MassIntentionTypeId" })
  massIntentionTypeId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.massIntentionType)
  reservations: Reservation[];
}
