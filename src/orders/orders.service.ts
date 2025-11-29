import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const cart = await this.cartService.findCart(userId);
    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const order = this.orderRepository.create({
      user: { id: userId } as any,
      status: OrderStatus.PENDING,
      paymentMethod: dto.paymentMethod ?? PaymentMethod.COD,
      shippingAddress: dto.shippingAddress,
      phone: dto.phone,
      recipientName: dto.recipientName,
      totalAmount: 0,
    });

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of cart.items) {
      await this.productsService.decreaseInventory(item.product.id, item.quantity);
      const orderItem = this.orderItemRepository.create({
        order,
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.product.price,
      });
      total += item.quantity * Number(item.product.price);
      orderItems.push(orderItem);
    }

    order.totalAmount = total;
    const savedOrder = await this.orderRepository.save(order);
    const persistedItems: OrderItem[] = [];
    for (const orderItem of orderItems) {
      orderItem.order = savedOrder;
      persistedItems.push(await this.orderItemRepository.save(orderItem));
    }
    savedOrder.items = persistedItems;
    await this.paymentsService.createPaymentRecord(savedOrder, savedOrder.paymentMethod);
    await this.cartService.clearCart(userId);
    return savedOrder;
  }

  findAll() {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  findByUser(userId: string) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(orderId: string, userId?: string, role?: UserRole) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product', 'payment'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (userId && role !== UserRole.ADMIN && order.user.id !== userId) {
      throw new ForbiddenException();
    }
    return order;
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(orderId);
    this.assertValidTransition(order.status, dto.status);
    order.status = dto.status;
    return this.orderRepository.save(order);
  }

  private assertValidTransition(current: OrderStatus, next: OrderStatus) {
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPING, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPING]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };
    if (!allowed[current].includes(next)) {
      throw new BadRequestException('Invalid status transition');
    }
  }
}
