import { Body, Controller, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/core/decorators/decorators.service';
import { PaymentService } from './payment.service';

@Controller('Payment')
export class PaymentController {
     constructor(private paymentService: PaymentService) {}
 
    @ApiOperation({summary: "Check Payment | STUDENT"})
    @Auth(UserRole.STUDENT)
    @ApiBearerAuth()
    Craete(@Body() id: string) {
        return this.paymentService.checkPayment(id)
    }
}
