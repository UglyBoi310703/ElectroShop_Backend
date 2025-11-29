import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { StatisticsFilterDto } from './dto/statistics-filter.dto';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async revenue(filter: StatisticsFilterDto) {
    const groupBy = filter.groupBy ?? 'daily';
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalRevenue');

    qb.where('order.status = :status', { status: OrderStatus.COMPLETED });

    if (groupBy === 'monthly') {
      qb.addSelect("DATE_FORMAT(order.createdAt, '%Y-%m')", 'bucket');
    } else if (groupBy === 'yearly') {
      qb.addSelect("DATE_FORMAT(order.createdAt, '%Y')", 'bucket');
    } else {
      qb.addSelect("DATE_FORMAT(order.createdAt, '%Y-%m-%d')", 'bucket');
    }

    if (filter.startDate) {
      qb.andWhere('order.createdAt >= :startDate', { startDate: filter.startDate });
    }
    if (filter.endDate) {
      qb.andWhere('order.createdAt <= :endDate', { endDate: filter.endDate });
    }

    qb.groupBy('bucket').orderBy('bucket', 'ASC');
    return qb.getRawMany();
  }

  async summary() {
    const totalOrders = await this.orderRepository.count({
      where: { status: OrderStatus.COMPLETED },
    });
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'sum')
      .getRawOne();

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue.sum ?? 0),
    };
  }
}
