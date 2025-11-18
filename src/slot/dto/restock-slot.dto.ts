import { IsUUID,IsInt,Min,Max, MAX } from "class-validator";

export class RestockSlotDto{
    @IsUUID()
    machineId:string;

    @IsInt()
    @Min(1)
    @Max(10)
    slotNumber:number;

    @IsInt()
    @Min(1)
    @Max(10)
    quantityToAdd:number;
}

