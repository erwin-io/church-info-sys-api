import { Column, Entity, Index, OneToMany } from "typeorm";
import { Request } from "./Request";

@Index("RequestType_pkey", ["requestTypeId"], { unique: true })
@Entity("RequestType", { schema: "dbo" })
export class RequestType {
  @Column("bigint", { primary: true, name: "RequestTypeId" })
  requestTypeId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @OneToMany(() => Request, (request) => request.requestType)
  requests: Request[];
}
