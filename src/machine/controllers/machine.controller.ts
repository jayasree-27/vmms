import { Controller,Post,Get,Param,Body } from "@nestjs/common";
import { MachineService } from "../services/machine.service";
import { CreateMachineDto } from "../dto/create-machine.dto";

@Controller('machines')
export class MachineController{
    constructor(
        private readonly machineService:MachineService,
    ) {}

    @Post()
    async create(@Body() dto:CreateMachineDto){
        const machine=await this.machineService.create(dto);
        return machine;
    }

    @Get(':id/inventory')
    async getInventory(@Param('id') id:string){
        return this.machineService.getInventory(id);
    }
}