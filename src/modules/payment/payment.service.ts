import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class PaymentService {
    constructor(private prismaService: PrismaService) {}

    async checkPayment(courseId: string) {
        return {
            success: true,
            message: "OK",                       // Just ................................
            data: true
        }
    }
}
