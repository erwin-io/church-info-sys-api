import { Column, Entity, Index, OneToMany } from "typeorm";
import { Request } from "./Request";

@Index("RequestStatus_pkey", ["requestStatusId"], { unique: true })
@Entity("RequestStatus", { schema: "dbo" })
export class RequestStatus {
  @Column("bigint", { primary: true, name: "RequestStatusId" })
  requestStatusId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @OneToMany(() => Request, (request) => request.requestStatus)
  requests: Request[];
}
