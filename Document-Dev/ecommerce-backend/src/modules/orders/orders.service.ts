import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { OrderStatusHistory } from '../../entities/order-status-history.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Product } from '../../entities/product.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { Address } from '../../entities/address.entity';

export class CreateOrderDto {
    shippingAddressId: number;
    paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet';
    customerNote?: string;
    couponCode?: string;
}

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(OrderStatusHistory)
        private statusHistoryRepository: Repository<OrderStatusHistory>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
    ) { }

    async createOrder(
        userId: number,
        createOrderDto: CreateOrderDto,
    ): Promise<Order> {
        const { shippingAddressId, paymentMethod, customerNote, couponCode } =
            createOrderDto;

        // Get shipping address
        const address = await this.addressRepository.findOne({
            where: { addressId: shippingAddressId, userId },
        });

        if (!address) {
            throw new NotFoundException('Shipping address not found');
        }

        // Get cart items
        const cartItems = await this.cartItemRepository.find({
            where: { cartId: userId }, // Note: Adjust based on actual cart structure
            relations: ['product', 'variant'],
        });

        if (cartItems.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Calculate totals
        let subtotal = 0;
        const orderItems: OrderItem[] = [];

        for (const cartItem of cartItems) {
            const lineTotal = cartItem.price * cartItem.quantity;
            subtotal += lineTotal;

            const orderItem = this.orderItemRepository.create({
                productId: cartItem.productId,
                variantId: cartItem.variantId,
                productName: cartItem.product?.productName || '',
                quantity: cartItem.quantity,
                price: cartItem.price,
                subtotal: lineTotal,
            });

            orderItems.push(orderItem);
        }

        // Calculate discount (if coupon applied)
        let discountAmount = 0;
        // TODO: Implement coupon validation logic

        // Calculate shipping fee
        const shippingFee = subtotal > 500000 ? 0 : 30000; // Free shipping > 500k

        // Calculate tax (10%)
        const taxAmount = Math.floor(subtotal * 0.1);

        // Total
        const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;

        // Create order
        const order = this.orderRepository.create({
            userId,
            orderCode: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            shippingAddressId,
            subtotal,
            shippingFee,
            discountAmount,
            taxAmount,
            totalAmount,
            paymentMethod,
            customerNote,
            orderStatus: 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        });

        const savedOrder = await this.orderRepository.save(order);

        // Save order items
        for (const orderItem of orderItems) {
            orderItem.orderId = savedOrder.orderId;
            await this.orderItemRepository.save(orderItem);
        }

        // Record status history
        await this.statusHistoryRepository.save({
            orderId: savedOrder.orderId,
            newStatus: 'pending',
            note: 'Order created',
        });

        // TODO: Clear cart after order created

        return this.getOrderById(userId, savedOrder.orderId);
    }

    async getOrderById(userId: number, orderId: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { orderId, userId },
            relations: ['items', 'address', 'statusHistory'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async getOrderByCode(userId: number, orderCode: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { orderCode, userId },
            relations: ['items', 'address', 'statusHistory'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async getUserOrders(
        userId: number,
        page: number = 1,
        limit: number = 10,
    ): Promise<{ data: Order[]; total: number }> {
        const [data, total] = await this.orderRepository.findAndCount({
            where: { userId },
            relations: ['items', 'address'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return { data, total };
    }

    async updateOrderStatus(
        orderId: number,
        newStatus: string,
        adminNote?: string,
        changedBy?: number,
    ): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const oldStatus = order.orderStatus;
        order.orderStatus = newStatus as any;

        if (newStatus === 'delivered') {
            order.deliveredAt = new Date();
        } else if (newStatus === 'completed') {
            order.completedAt = new Date();
        } else if (newStatus === 'cancelled') {
            order.cancelledAt = new Date();
        }

        const savedOrder = await this.orderRepository.save(order);

        // Record status history
        await this.statusHistoryRepository.save({
            orderId,
            oldStatus,
            newStatus,
            note: adminNote,
            changedBy,
        });

        return savedOrder;
    }

    async updatePaymentStatus(
        orderId: number,
        paymentStatus: string,
    ): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.paymentStatus = paymentStatus as any;

        if (paymentStatus === 'paid') {
            order.paidAt = new Date();
        }

        return this.orderRepository.save(order);
    }

    async cancelOrder(orderId: number, cancelReason: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
            throw new BadRequestException(
                'Can only cancel pending or confirmed orders',
            );
        }

        order.orderStatus = 'cancelled';
        order.cancelReason = cancelReason;
        order.cancelledAt = new Date();

        const savedOrder = await this.orderRepository.save(order);

        // Record status history
        await this.statusHistoryRepository.save({
            orderId,
            oldStatus: 'pending',
            newStatus: 'cancelled',
            note: cancelReason,
        });

        return savedOrder;
    }

    async getOrderStats(userId?: number) {
        const query = this.orderRepository.createQueryBuilder('order');

        if (userId) {
            query.where('order.userId = :userId', { userId });
        }

        const stats = await query
            .select('COUNT(*)', 'totalOrders')
            .addSelect('SUM(order.totalAmount)', 'totalRevenue')
            .addSelect(
                'COUNT(CASE WHEN order.orderStatus = "completed" THEN 1 END)',
                'completedOrders',
            )
            .getRawOne();

        return stats;
    }
}
