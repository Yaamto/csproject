import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  @UseGuards(AuthGuard)
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount } = createPaymentDto;
    const paymentIntent = await this.paymentService.createPaymentIntent(amount);
    return { clientSecret: paymentIntent.client_secret };
  }

}
