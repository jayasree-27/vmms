import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from './permission.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private service: PermissionsService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

 @Post('assign')
  assignPermission(
    @Body('roleId') roleId: string,
    @Body('permissionId') permissionId: string,
  ) {
    console.log('ROLE ID:', roleId);
    console.log('PERMISSION ID:', permissionId);

    return this.service.assign(roleId, permissionId);
  }

  @Get()
  findAllPermissions() {
    return this.service.findAll();
  }

  @Delete(':roleId/:permissionId')
  deletePermissions(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.service.deletePermission(roleId, permissionId);
  }

}
