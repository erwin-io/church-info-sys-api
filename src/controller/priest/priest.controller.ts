import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/helper/customresponse.helpers';
import { JwtAuthGuard } from 'src/core/auth/jwt.auth.guard';
import { CreatePriestDto } from 'src/core/dto/priest/priest.create.dto';
import { PriestDto } from 'src/core/dto/priest/priest.update.dto';
import { PriestService } from 'src/services/priest.service';

@ApiTags("priest")
@Controller("priest")
// @ApiBearerAuth()
export class PriestController {
    constructor(
      private readonly priestService: PriestService
    ) {}
  
    @Get("")
    // @UseGuards(JwtAuthGuard)
    async getAll() {
      const res: CustomResponse = {};
      try {
        res.data = await this.priestService.findAll();
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  
    @Get("findByAvailability")
    // @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: "dayNum", required: true, type: Number })
    @ApiQuery({ name: "timeNum", required: true, type: Number })
    async findByAvailability(
      @Query("dayNum") dayNum: number = 0,
      @Query("timeNum") timeNum: number = 0) {
      const res: CustomResponse = {};
      try {
        res.data = await this.priestService.findByAvailability(
          !isNaN(dayNum) ? dayNum : 0,!isNaN(timeNum) ? timeNum : 0
        );
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  
    @Get(":priestId")
    // @UseGuards(JwtAuthGuard)
    async findOne(@Param("priestId") priestId: string) {
      const res: CustomResponse = {};
      try {
        res.data = await this.priestService.findById(
          priestId
        );
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  
    @Post()
    // @UseGuards(JwtAuthGuard)
    async create(@Body() createPriestDto: CreatePriestDto) {
      const res: CustomResponse = {};
      try {
        res.data = await this.priestService.add(
          createPriestDto
        );
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  
    @Put()
    // @UseGuards(JwtAuthGuard)
    async update(@Body() priestDto: PriestDto) {
      const res: CustomResponse = {};
      try {
        res.data = await this.priestService.update(priestDto);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  
    @Delete(":priestId")
    async delete(@Param("priestId") priestId: string) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.priestService.delete(priestId);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  }
  