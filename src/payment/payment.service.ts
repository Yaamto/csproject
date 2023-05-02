import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

 async createPaymentIntent(amount: number) {
  amount = amount * 100;
    try {
      const paymentIntent = await this.stripeClient.paymentIntents.create({
        amount,
        currency: 'usd',
        });
        return paymentIntent;
    }catch(err)
      {
        throw new BadRequestException('Error with creating payment intent')
      }
  }

}
