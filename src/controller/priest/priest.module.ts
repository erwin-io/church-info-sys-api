import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriestService } from 'src/services/priest.service';
import { Priest } from 'src/shared/entities/Priest';
import { PriestController } from './priest.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Priest])],
    controllers: [PriestController],
    providers: [PriestService],
    exports: [PriestService],
  })
  export class PriestModule {}
  