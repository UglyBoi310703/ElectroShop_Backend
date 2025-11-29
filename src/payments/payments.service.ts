import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createPaymentRecord(order: Order, method: PaymentMethod) {
    const payment = this.paymentRepository.create({
      order,
      method,
      status: method === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.SUCCESS,
      amount: order.totalAmount,
    });
    return this.paymentRepository.save(payment);
  }

  findAll() {
    return this.paymentRepository.find({
      relations: ['order', 'order.user'],
    });
  }

  async updateStatus(paymentId: string, status: PaymentStatus, transactionId?: string) {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    payment.status = status;
    payment.transactionId = transactionId;
    return this.paymentRepository.save(payment);
  }
}
