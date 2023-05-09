import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityStatusEnum } from 'src/common/enums/entity-status.enum';
import { CreatePriestDto } from 'src/core/dto/priest/priest.create.dto';
import { PriestDto } from 'src/core/dto/priest/priest.update.dto';
import { Priest } from 'src/shared/entities/Priest';
import { Repository } from 'typeorm';

@Injectable()
export class PriestService {
    constructor(
      @InjectRepository(Priest)
      private readonly priestRepo: Repository<Priest>
    ) {}
    async findAll() {
      try {
        return await this.priestRepo.find({
          where: {
            entityStatus: { entityStatusId: EntityStatusEnum.ACTIVE.toString() }
          },
          relations: {
            entityStatus: true
          }
        });
      } catch (e) {
        throw e;
      }
    }
  
    async findByAvailability(dayNum = 0, timeNum = 0) {
      try {
        const availability = `%${dayNum}:${timeNum}%`;
        const priest: Priest = <any>await this.priestRepo.manager
          .createQueryBuilder("Priest", "p")
          .leftJoinAndSelect("p.entityStatus", "es")
          .where("es.entityStatusId = :entityStatusId AND p.availability like :availability",
          { entityStatusId: "1", availability }).getMany();
          return priest;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  
    async findOne(options?: any) {
      try {
        const priest = await this.priestRepo.findOne({
          where: options,
          relations: {
              entityStatus: true,
          },
        });
        return priest;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  
    async findById(priestId: string) {
      try {
        const priest = await this.findOne({
          priestId,
          entityStatus: { entityStatusId: EntityStatusEnum.ACTIVE.toString() },
        });
        if (!priest) {
          throw new HttpException("Priest not found", HttpStatus.NOT_FOUND);
        }
        return {
          ...priest,
          availability: JSON.parse(priest.availability)
        };
      } catch (e) {
        throw e;
      }
    }
  
    async add(createPriestDto: CreatePriestDto) {
      return await this.priestRepo.manager.transaction(
        async (entityManager) => {
          const isInDb = await this.findOne({
            priestName: createPriestDto.priestName,
            entityStatus: { entityStatusId: EntityStatusEnum.ACTIVE.toString() },
          });
          if (isInDb) {
            throw new HttpException(
              "Priest already exist",
              HttpStatus.CONFLICT
            );
          }
          let priest = new Priest();;
          createPriestDto.availability = createPriestDto.availability.length > 0 && createPriestDto.availability[0] && createPriestDto.availability[0] !== "" ? createPriestDto.availability : [];
          for(var a of createPriestDto.availability) {
            if(!(a && a.split(":") && a.split(":")[0] && Number(a.split(":")[0]) >= 0 && Number(a.split(":")[0]) <= 6) ||
              !(a && a.split(":") && a.split(":")[1] && Number(a.split(":")[1]) >= 1 && Number(a.split(":")[1]) <= 24)) {
                throw new HttpException(
                  "Invalid availability scheduler",
                  HttpStatus.BAD_REQUEST
                );
            } else {
              // conflict of schedule prevention
              // const priest = await this.findByAvailability(Number(a.split(":")[0]), Number(a.split(":")[1]));
              // if(priest) {
              //   throw new HttpException(
              //     "Conflict of availability!",
              //     HttpStatus.BAD_REQUEST
              //   );
              // }
            }
          }
          priest.availability = JSON.stringify(createPriestDto.availability);
          priest.priestName = createPriestDto.priestName;
          priest = await entityManager.save(Priest, priest);
          priest = await entityManager.findOne(Priest, { where: { priestId: priest.priestId, entityStatus: { entityStatusId: "1"}}});
          return {
            ...priest,
            availability: JSON.parse(priest.availability)
          };
        }
      );
    }
  
    async update(dto: PriestDto) {
      const priestId = dto.priestId;
      return await this.priestRepo.manager.transaction(
        async (entityManager) => {
          let priest: any = await this.findOne({
            priestId,
            entityStatus: { entityStatusId: EntityStatusEnum.ACTIVE.toString() },
          });
          if (!Priest) {
            throw new HttpException(
              `Priest doesn't exist`,
              HttpStatus.NOT_FOUND
            );
          }
          const isInDb = await this.findOne({
            priestName: dto.priestName,
            entityStatus: { entityStatusId: EntityStatusEnum.ACTIVE.toString() },
          });
          if (isInDb && isInDb.priestId != priestId) {
            throw new HttpException(
              "Priest already exist",
              HttpStatus.CONFLICT
            );
          }
          dto.availability = dto.availability.length > 0 && dto.availability[0] && dto.availability[0] !== "" ? dto.availability : [];
          for(var a of dto.availability) {
            if(!(a && a.split(":") && a.split(":")[0] && Number(a.split(":")[0]) >= 0 && Number(a.split(":")[0]) <= 6) ||
              !(a && a.split(":") && a.split(":")[1] && Number(a.split(":")[1]) >= 1 && Number(a.split(":")[1]) <= 24)) {
                throw new HttpException(
                  "Invalid availability scheduler",
                  HttpStatus.BAD_REQUEST
                );
            } else {
              // conflict of schedule prevention
              // const priest = await this.findByAvailability(Number(a.split(":")[0]), Number(a.split(":")[1]));
              // if(priest && priest.priestId !== dto.priestId) {
              //   throw new HttpException(
              //     "Conflict of availability!",
              //     HttpStatus.BAD_REQUEST
              //   );
              // }
            }
          }
          priest.availability = JSON.stringify(dto.availability);
          priest.priestName = dto.priestName;
          priest = await entityManager.save(Priest, priest);
          priest = await entityManager.findOne(Priest, { where: { priestId: priest.priestId, entityStatus: { entityStatusId: "1"}}});
          return {
            ...priest,
            availability: JSON.parse(priest.availability)
          };
        }
      );
    }
  
    async delete(priestId: string) {
      try {
        const priest = await this.findOne({
          priestId,
          entityStatus: { entityStatusId: EntityStatusEnum.ACTIVE.toString() },
        });
        if (!priest) {
          throw new HttpException("Priest not found", HttpStatus.NOT_FOUND);
        }
        priest.entityStatus.entityStatusId = EntityStatusEnum.DELETED.toString();
        return await this.priestRepo.save(priest);
      } catch (e) {
        throw e;
      }
    }
  }