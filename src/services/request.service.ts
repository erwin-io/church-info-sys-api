import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { UpdateRequestStatusDto } from "src/core/dto/request/request.update.dtos";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { RequestViewModel } from "src/core/view-model/request.view-model";
import { Clients } from "src/shared/entities/Clients";
import { RequestStatus } from "src/shared/entities/RequestStatus";
import { RequestType } from "src/shared/entities/RequestType";
import { Request } from "src/shared/entities/Request";
import { Repository } from "typeorm";
import { ReminderService } from "./reminder.service";
import { RequestStatusEnum } from "src/common/enums/request-status.enum";
import { CreateBaptismalCertificateRequestDto, CreateCertificateRequestDto, CreateConfirmationCertificateRequestDto, CreateMarriageContractCertificateRequestDto } from "src/core/dto/request/request.create.dto";
import { Relationship } from "src/shared/entities/Relationship";
import { RequestTypeEnum } from "src/common/enums/request-type.enum";

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly appointmentRepo: Repository<Request>,
    private firebaseProvoder: FirebaseProvider,
    private reminderService: ReminderService
  ) {}

  async findByFilter(
    advanceSearch: boolean,
    keyword: string,
    clientName: string,
    status: string[],
    requestType: string[],
    requestDateFrom: Date,
    requestDateTo: Date
  ) {
    try {
      const params: any = {
        keyword: `%${keyword}%`,
        clientName: `%${clientName}%`,
        status:
          status.length === 0
            ? ["Pending", "Approved", "Completed", "Cancelled"]
            : status,
      };

      let query = this.appointmentRepo.manager
        .createQueryBuilder("Request", "r")
        .leftJoinAndSelect("r.requestType", "rt")
        .leftJoinAndSelect("r.requestStatus", "rs")
        .leftJoinAndSelect("r.client", "c");
      if (advanceSearch) {
        if (
          requestDateFrom instanceof Date &&
          requestDateFrom.toDateString() !== "Invalid Date" &&
          requestDateTo instanceof Date &&
          requestDateTo.toDateString() !== "Invalid Date"
        ) {
          query = query.where(
            "r.requestDate between :requestDateFrom and :requestDateTo"
          );
          params.requestDateFrom = moment(requestDateFrom).format("YYYY-MM-DD");
          params.requestDateTo = moment(requestDateTo).format("YYYY-MM-DD");
        }
        query = query
          .andWhere("rs.name IN(:...status)")
          .andWhere(
            "CONCAT(c.firstName, ' ', c.middleName, ' ', c.lastName) LIKE :clientName"
          );
        if (requestType.length > 0) {
          query = query.andWhere("rt.name IN(:...requestType)");
          params.requestType = requestType;
        }
      } else {
        query = query
          .where("LOWER(cast(r.requestId as character varying)) like :keyword")
          .orWhere("LOWER(cast(r.requestDate as character varying)) like :keyword")
          .orWhere("LOWER(rt.name) like :keyword")
          .andWhere(
            "CONCAT(LOWER(c.firstName), ' ', LOWER(c.lastName)) LIKE :keyword"
          );
      }

      return <RequestViewModel[]>(
        await query
          .setParameters(params)
          .orderBy("rs.requestStatusId", "ASC")
          .addOrderBy("r.requestDate", "ASC")
          .getMany()
      ).map((r: Request) => {
        return new RequestViewModel(r);
      });
    } catch (e) {
      throw e;
    }
  }

  async getByStatus(clientId: string, status: string[]) {
    try {
      const params: any = {
        clientId,
        status:
          status.length === 0
            ? ["Pending", "Approved", "Completed", "Cancelled"]
            : status,
      };

      const query = this.appointmentRepo.manager
        .createQueryBuilder("Request", "r")
        .leftJoinAndSelect("r.requestType", "rt")
        .leftJoinAndSelect("r.requestStatus", "rs")
        .leftJoinAndSelect("r.client", "c")
        .where("c.clientId = :clientId")
        .andWhere("rs.name IN(:...status)")
        .setParameters(params);

      return <RequestViewModel[]>(await query.getMany()).map((r: Request) => {
        return new RequestViewModel(r);
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const query = <Request>(
        await this.appointmentRepo.manager
          .createQueryBuilder("Request", "r")
          .leftJoinAndSelect("r.requestType", "rt")
          .leftJoinAndSelect("r.requestStatus", "rs")
          .leftJoinAndSelect("r.client", "c")
          .leftJoinAndSelect("c.user", "u")
          .where(options)
          .getOne()
      );
      return new RequestViewModel(query);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(requestId: string) {
    try {
      const request = await this.findOne({ requestId });
      if (!request) {
        throw new HttpException("Request not found", HttpStatus.NOT_FOUND);
      }
      return request;
    } catch (e) {
      throw e;
    }
  }

  async createBaptismalCertificateRequest(
    dto: CreateBaptismalCertificateRequestDto
  ) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newRequest = new Request();
          newRequest.requestDate = moment(new Date()).format("YYYY-MM-DD");
          const requestType = await entityManager.findOne(RequestType, {
            where: { requestTypeId: RequestTypeEnum.BAPTISMAL_CERTIFICATE.toString() },
          });
          if (!requestType) {
            throw new HttpException(
              "Request type not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.requestType = requestType;
          const relationship = await entityManager.findOne(Relationship, {
            where: { relationshipId: dto.relationshipId },
          });
          if (!relationship) {
            throw new HttpException(
              "Relationship not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.relationship = relationship;
          newRequest.requestersFullName = dto.requestersFullName;
          newRequest.referenceDate = moment(dto.dateBaptized).format("YYYY-MM-DD");
          newRequest.remarks = dto.remarks;
          newRequest.client = await entityManager.findOne(Clients, {
            where: { clientId: dto.clientId },
          });
          return await entityManager.save(Request, newRequest);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async createConfirmationCertificateRequest(
    dto: CreateConfirmationCertificateRequestDto
  ) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newRequest = new Request();
          newRequest.requestDate = moment(new Date()).format("YYYY-MM-DD");
          const requestType = await entityManager.findOne(RequestType, {
            where: { requestTypeId: RequestTypeEnum.CONFIRMATION_CERTIFICATE.toString() },
          });
          if (!requestType) {
            throw new HttpException(
              "Request type not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.requestType = requestType;
          const relationship = await entityManager.findOne(Relationship, {
            where: { relationshipId: dto.relationshipId },
          });
          if (!relationship) {
            throw new HttpException(
              "Relationship not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.relationship = relationship;
          newRequest.requestersFullName = dto.requestersFullName;
          newRequest.referenceDate = moment(dto.dateOfConfirmation).format("YYYY-MM-DD");
          newRequest.remarks = dto.remarks;
          newRequest.client = await entityManager.findOne(Clients, {
            where: { clientId: dto.clientId },
          });
          return await entityManager.save(Request, newRequest);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async createMarriageContractCertificateRequest(
    dto: CreateMarriageContractCertificateRequestDto
  ) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newRequest = new Request();
          newRequest.requestDate = moment(new Date()).format("YYYY-MM-DD");
          const requestType = await entityManager.findOne(RequestType, {
            where: { requestTypeId: RequestTypeEnum.MARRIAGE_CERTIFICATE.toString() },
          });
          if (!requestType) {
            throw new HttpException(
              "Request type not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.requestType = requestType;
          const relationship = await entityManager.findOne(Relationship, {
            where: { relationshipId: dto.relationshipId },
          });
          if (!relationship) {
            throw new HttpException(
              "Relationship not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.relationship = relationship;
          newRequest.husbandFullName = dto.husbandFullName;
          newRequest.wifeFullName = dto.wifeFullName;
          newRequest.referenceDate = moment(dto.dateMarried).format("YYYY-MM-DD");
          newRequest.remarks = dto.remarks;
          newRequest.client = await entityManager.findOne(Clients, {
            where: { clientId: dto.clientId },
          });
          return await entityManager.save(Request, newRequest);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async createCertificateRequest(
    dto: CreateCertificateRequestDto
  ) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newRequest = new Request();
          newRequest.requestDate = moment(new Date()).format("YYYY-MM-DD");
          const requestType = await entityManager.findOne(RequestType, {
            where: { requestTypeId: RequestTypeEnum.OTHER_CERTIFICATE.toString() },
          });
          if (!requestType) {
            throw new HttpException(
              "Request type not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.requestType = requestType;
          const relationship = await entityManager.findOne(Relationship, {
            where: { relationshipId: dto.relationshipId },
          });
          if (!relationship) {
            throw new HttpException(
              "Relationship not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newRequest.relationship = relationship;
          newRequest.requestersFullName = dto.requestersFullName;
          newRequest.referenceDate = moment(dto.date).format("YYYY-MM-DD");
          newRequest.remarks = dto.remarks;
          newRequest.client = await entityManager.findOne(Clients, {
            where: { clientId: dto.clientId },
          });
          return await entityManager.save(Request, newRequest);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updateStatus(dto: UpdateRequestStatusDto) {
    try {
      const { requestId, requestStatusId } = dto;
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const request = await entityManager.findOne(Request, {
            where: { requestId },
            relations: ["requestStatus", "requestType"],
          });
          if (
            request.requestStatus.requestStatusId ===
              RequestStatusEnum.READYFORPICKUP.toString() &&
            requestStatusId === RequestStatusEnum.PENDING.toString()
          ) {
            throw new HttpException(
              "Unable to change status, request is already ready for pickup",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            request.requestStatus.requestStatusId ===
              RequestStatusEnum.CLOSED.toString() &&
            requestStatusId === RequestStatusEnum.READYFORPICKUP.toString()
          ) {
            throw new HttpException(
              "Unable to change status, request is already closed",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            request.requestStatus.requestStatusId !==
              RequestStatusEnum.CLOSED.toString() &&
            requestStatusId === RequestStatusEnum.PENDING.toString()
          ) {
            throw new HttpException(
              "Unable to change status, request is already ready closed",
              HttpStatus.BAD_REQUEST
            );
          }
          if (requestStatusId === RequestStatusEnum.CLOSED.toString()) {
            request.adminRemarks = dto.adminRemarks;
          }
          request.requestStatus = await entityManager.findOne(RequestStatus, {
            where: { requestStatusId },
          });
          return await entityManager.save(Request, request);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}
