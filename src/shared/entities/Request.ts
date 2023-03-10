import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RequestType } from "./RequestType";
import { Clients } from "./Clients";
import { RequestStatus } from "./RequestStatus";

@Index("PK_Request", ["requestId"], { unique: true })
@Entity("Request", { schema: "dbo" })
export class Request {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RequestId" })
  requestId: string;

  @Column("date", { name: "RequestDate" })
  requestDate: Date;

  @Column("nvarchar", { name: "RequestersFullName", nullable: true })
  requestersFullName: string | null;

  @Column("nvarchar", { name: "HusbandFullName", nullable: true })
  husbandFullName: string | null;

  @Column("nvarchar", { name: "WifeFullName", nullable: true })
  wifeFullName: string | null;

  @Column("date", { name: "ReferenceDate" })
  referenceDate: Date;

  @Column("nvarchar", { name: "Remarks", nullable: true })
  remarks: string | null;

  @Column("bit", { name: "IsCancelledByAdmin", default: () => "(0)" })
  isCancelledByAdmin: boolean;

  @Column("nvarchar", { name: "AdminRemarks", nullable: true })
  adminRemarks: string | null;

  @ManyToOne(() => RequestType, (requestType) => requestType.requests)
  @JoinColumn([
    { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
  ])
  requestType: RequestType;

  @ManyToOne(() => Clients, (clients) => clients.requests)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => RequestStatus, (requestStatus) => requestStatus.requests)
  @JoinColumn([
    { name: "RequestStatusId", referencedColumnName: "requestStatusId" },
  ])
  requestStatus: RequestStatus;
}
