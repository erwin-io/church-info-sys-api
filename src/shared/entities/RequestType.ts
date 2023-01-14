import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Request } from "./Request";

@Index("PK_RequestType", ["requestTypeId"], { unique: true })
@Entity("RequestType", { schema: "dbo" })
export class RequestType {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RequestTypeId" })
  requestTypeId: string;

  @Column("nvarchar", { name: "Name", length: 250 })
  name: string;

  @OneToMany(() => Request, (request) => request.requestType)
  requests: Request[];
}
