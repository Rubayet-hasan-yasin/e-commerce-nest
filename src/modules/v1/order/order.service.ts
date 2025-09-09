import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTable } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { DataSource, Repository } from 'typeorm';
import { Customer } from 'src/modules/v1/customer/entities/customer.entity';
import { Payment } from './entities/payment.entity';
import { Address } from 'src/modules/v1/address/entities/address.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderTable)
    private readonly orderRepository: Repository<OrderTable>,
    @InjectRepository(OrderItem)
    private readonly OrderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
  ) {}
  async create(dto: CreateOrderDto) {
    const {
      customer,
      totalAmount,
      createForm,
      orderItems,
      paymentMethod,
      shippingCostId,
      packetSize,
    } = dto;

    if (!customer?.phone) {
      throw new BadRequestException('Customer phone is required');
    }

    return await this.dataSource.transaction(async (manager) => {
      let existingCustomer = await manager.findOne(Customer, {
        where: { phone: customer.phone },
      });

      if (!existingCustomer) {
        existingCustomer = manager.create(Customer, {
          phone: customer.phone,
          fullName: customer.fullName,
        });

        existingCustomer = await manager.save(Customer, existingCustomer);
      }

      //payment
      let payment = await manager.findOne(Payment, {
        where: { method: paymentMethod, customer: { id: existingCustomer.id } },
        relations: ['customer'],
      });

      if (payment) {
        payment.amount = totalAmount;
        payment.status = 'Received';
        payment = await manager.save(Payment, payment);
      } else {
        payment = manager.create(Payment, {
          method: paymentMethod,
          amount: totalAmount,
          status: 'Received',
          customer: existingCustomer,
        });

        payment = await manager.save(Payment, payment);
      }

      //Address
      let address: Address | null = null;

      if (!customer.addressId) {
        address = manager.create(Address, {
          phone: customer.phone,
          fullName: customer.fullName,
          address: customer.address,
        });

        address = await manager.save(Address, address);
      }

      const addressId = customer.addressId || address?.id;

      if (!addressId) {
        throw new BadRequestException('No address found or provided');
      }

      const order = manager.create(OrderTable, {
        Customer: existingCustomer,
        totalAmount,
        createForm,
        packetSize: packetSize,
        address: customer.address,
        Address: { id: addressId },
        ShippingCost: { id: shippingCostId },
        Payment: { id: payment.id },
        orderItems: orderItems.map((item) => ({
          product: { id: item.productId },
          // size: { id: item.sizeId },
          weight: item.weight,
          price: item.price,
          sizeId: item.sizeId,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
      });

      const savedOrder = await manager.save(OrderTable, order);

      savedOrder.orderId = this.generateOrderId(savedOrder.id);
      await manager.save(OrderTable, savedOrder);

      return {
        success: true,
        message: 'Order created successfully',
        order: savedOrder,
      };
    });
  }

  generateOrderId(id: number): string {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const date = today.getDate().toString().padStart(2, '0');
    // const paddedId = id.toString().padStart(3, "0");

    const paddedId = id.toString().padStart(4, '0');
    // return paddedId;

    return `${year}${paddedId}${date}${month}`;
    // return `${paddedId}`;
  }

  async findAll() {
    const orders = await this.orderRepository.find({
      relations: [
        'orderItems',
        'orderItems.product',
        'ShippingCost',
        'Payment',
        'Customer',
        'Address',
      ],
      order: { createdAt: 'DESC' },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderId: order.orderId,
      orderDate: order.createdAt,
      status: order.status,
      userName: order.Address ? order.Address.fullName : '',
      userPhone: order.Customer.phone,
      createForm: order.createForm,
      address: order.Address ? order.Address.address : '',
      shippingCost: order.ShippingCost ? order.ShippingCost.cost : 0,
      totalAmount: order.totalAmount || 0,
      paymentStatus: order.Payment ? order.Payment.status : null,
      orderItems: order.orderItems.map((item) => ({
        productName: item.product.name,
        productCategory: item.product.category?.name,
        price: item.price,
        weight: item.weight ? item.weight : '',
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        // discountPrice: item.discountPrice || null,
      })),
    }));

    return formattedOrders;
  }

  async updateStatus(dto: UpdateOrderStatusDto) {
    const { id, status } = dto;

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    return {
      message: 'Order status updated successfully',
      updatedOrder,
    };
  }

  async OrderByCutomer(id: number) {
    const orders = await this.orderRepository.find({
      where: { customerId: id },
      relations: [
        'orderItems',
        'orderItems.product',
        'ShippingCost',
        'Payment',
        'Customer',
        'Address',
      ],
      order: { createdAt: 'DESC' },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderId: order.orderId,
      orderDate: order.createdAt,
      status: order.status,
      userName: order.Address ? order.Address.fullName : '',
      userPhone: order.Customer.phone,
      address: order.Address ? order.Address.address : '',
      shippingCost: order.ShippingCost ? order.ShippingCost.cost : 0,
      totalAmount: order.totalAmount || 0,
      paymentStatus: order.Payment ? order.Payment.status : null,
      orderItems: order.orderItems.map((item) => ({
        productName: item.product.name,
        productCategory: item.product.category?.name,
        price: item.price,
        weight: item.weight ? item.weight : '',
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        // discountPrice: item.discountPrice || null,
      })),
    }));

    return formattedOrders;
  }
}
