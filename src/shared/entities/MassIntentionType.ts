import { Column, Entity, Index, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Index("PK_MassIntentionType", ["massIntentionTypeId"], { unique: true })
@Entity("MassIntentionType", { schema: "dbo" })
export class MassIntentionType {
  @Column("bigint", { primary: true, name: "MassIntentionTypeId" })
  massIntentionTypeId: string;

  @Column("nvarchar", { name: "Name", length: 50 })
  name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.massIntentionType)
  reservations: Reservation[];
}
