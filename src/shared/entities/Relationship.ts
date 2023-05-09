import { Column, Entity, Index, OneToMany } from "typeorm";
import { Request } from "./Request";

@Index("pk_relationship", ["relationshipId"], { unique: true })
@Entity("Relationship", { schema: "dbo" })
export class Relationship {
  @Column("bigint", { primary: true, name: "RelationshipId" })
  relationshipId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @OneToMany(() => Request, (request) => request.relationship)
  requests: Request[];
}
