import { Column, Entity, Index, OneToMany } from "typeorm";
import { Request } from "./Request";

@Index("PK_RequestStatus", ["requestStatusId"], { unique: true })
@Entity("RequestStatus", { schema: "dbo" })
export class RequestStatus {
  @Column("bigint", { primary: true, name: "RequestStatusId" })
  requestStatusId: string;

  @Column("nvarchar", { name: "Name", length: 250 })
  name: string;

  @OneToMany(() => Request, (request) => request.requestStatus)
  requests: Request[];
}
