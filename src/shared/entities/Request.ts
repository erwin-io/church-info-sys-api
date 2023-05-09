import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { Relationship } from "./Relationship";
import { RequestStatus } from "./RequestStatus";
import { RequestType } from "./RequestType";

@Index("Request_pkey", ["requestId"], { unique: true })
@Entity("Request", { schema: "dbo" })
export class Request {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RequestId" })
  requestId: string;

  @Column("date", { name: "RequestDate" })
  requestDate: string;

  @Column("character varying", { name: "RequestersFullName", nullable: true })
  requestersFullName: string | null;

  @Column("character varying", { name: "HusbandFullName", nullable: true })
  husbandFullName: string | null;

  @Column("character varying", { name: "WifeFullName", nullable: true })
  wifeFullName: string | null;

  @Column("date", { name: "ReferenceDate" })
  referenceDate: string;

  @Column("character varying", { name: "Remarks", nullable: true })
  remarks: string | null;

  @Column("boolean", { name: "IsCancelledByAdmin", default: () => "false" })
  isCancelledByAdmin: boolean;

  @Column("character varying", { name: "AdminRemarks", nullable: true })
  adminRemarks: string | null;

  @ManyToOne(() => Clients, (clients) => clients.requests)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => Relationship, (relationship) => relationship.requests)
  @JoinColumn([
    { name: "RelationshipId", referencedColumnName: "relationshipId" },
  ])
  relationship: Relationship;

  @ManyToOne(() => RequestStatus, (requestStatus) => requestStatus.requests)
  @JoinColumn([
    { name: "RequestStatusId", referencedColumnName: "requestStatusId" },
  ])
  requestStatus: RequestStatus;

  @ManyToOne(() => RequestType, (requestType) => requestType.requests)
  @JoinColumn([
    { name: "RequestTypeId", referencedColumnName: "requestTypeId" },
  ])
  requestType: RequestType;
}
