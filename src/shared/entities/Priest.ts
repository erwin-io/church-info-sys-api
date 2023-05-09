import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EntityStatus } from "./EntityStatus";
import { Reservation } from "./Reservation";

@Index("pk_priest", ["priestId"], { unique: true })
@Entity("Priest", { schema: "dbo" })
export class Priest {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PriestId" })
  priestId: string;

  @Column("character varying", { name: "PriestName" })
  priestName: string;

  @Column("character varying", { name: "Availability" })
  availability: string;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.priests)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;

  @OneToMany(() => Reservation, (reservation) => reservation.priest)
  reservations: Reservation[];
}
