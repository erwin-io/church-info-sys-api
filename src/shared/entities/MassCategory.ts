import { Column, Entity, Index, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Index("PK_MassCategory", ["massCategoryId"], { unique: true })
@Entity("MassCategory", { schema: "dbo" })
export class MassCategory {
  @Column("bigint", { primary: true, name: "MassCategoryId" })
  massCategoryId: string;

  @Column("nvarchar", { name: "Name", length: 50 })
  name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.massCategory)
  reservations: Reservation[];
}
