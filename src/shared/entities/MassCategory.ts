import { Column, Entity, Index, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Index("pk_masscategory", ["massCategoryId"], { unique: true })
@Entity("MassCategory", { schema: "dbo" })
export class MassCategory {
  @Column("bigint", { primary: true, name: "MassCategoryId" })
  massCategoryId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.massCategory)
  reservations: Reservation[];
}
