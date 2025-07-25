import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedersService implements OnModuleInit {
  private readonly logger = new Logger(SeedersService.name);

  constructor(
    private prismaService: PrismaService,
  ) { }

  //                                                       << BU ALBATTA YARALIB BOLGAN
  async onModuleInit() {                                      
    await this.userSeeder();
  }

  async userSeeder() {

    const fullName = "Ozodbek Nasriddinov"
    const password = "cRcD+2WQNGu("
    const phone = "+998941111111"


    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prismaService.users.create({data: {fullName: fullName, password: hashedPassword, phone: phone, role: 'STUDENT'}})

    this.logger.log('✅ Admin successfully created!');
  }
}
