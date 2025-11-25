import { Body, Controller,  Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dtos/login.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  //login for all 
  @Post('login')
  login(@Body() dto:LoginDto){
    return this.authService.login(dto)
  }


  //customer registration
  @Post('register')
  register(@Body() dto:CreateUserDto){
    return this.usersService.registerCustomer(dto)
  }

  //add user for manager and staff only
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('add-user')
  addUser(@Req() req,@Body() dto:CreateUserDto){
    return this.usersService.createUser(dto)
  }

  @Post('logout')
  async logout(@Req() req){
    const token=req.headers.authorization?.replace('Bearer ','');

    return this.authService.logout(token);
  }
}
