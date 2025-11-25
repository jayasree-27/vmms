import { BadRequestException, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import * as bcrypt from 'bcryptjs';
import { CustomerRegisterDto } from "./dtos/customer-register";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    this.createAdmin();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  private async createAdmin() {
    const admin = await this.userRepository.findOne({
      where: { role: UserRole.ADMIN }
    });

    if (admin) {
      return;
    }

    const hashed = await bcrypt.hash('admin@123', 10);

    const newAdmin=await this.userRepository.create({
      email: 'admin@vmms.com',
      password: hashed,
      firstName: 'SystemAdmin',
      role: UserRole.ADMIN
    });

    this.userRepository.save(newAdmin);
    console.log('Defaault admin created');
  }

  async registerCustomer(dto: CustomerRegisterDto) {
    const exists=await this.userRepository.findOne({
      where:{email:dto.email} 
    })

    if(exists){
      throw new NotAcceptableException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const customer=this.userRepository.create({
      email:dto.email,
      password:hashedPassword,
      firstName :dto.firstName,
      role:UserRole.CUSTOMER
    })

    return this.userRepository.save(customer);
  }

  async createUser(dto:CreateUserDto){
    const exists=await this.userRepository.findOne({
      where:{email:dto.email} 
    })
    if(exists){
      throw new NotAcceptableException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const customer=this.userRepository.create({
      email:dto.email,
      password:hashedPassword,
      firstName :dto.firstName,
      role:dto.role
    })

    return this.userRepository.save(customer);
  } 
}

  