import { Injectable } from "@nestjs/common";
import { PrismaService, type Prisma, type Order } from "@repo/database";

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly fullInclude = {
    items: true,
    couponUsage: true,
  };

  findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: this.fullInclude,
    });
  }

  findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { orderNumber },
      include: this.fullInclude,
    });
  }

  findManyByUserId(userId: string, params: { skip: number; take: number }) {
    return this.prisma.order.findMany({
      where: { userId },
      include: this.fullInclude,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  }

  countByUserId(userId: string): Promise<number> {
    return this.prisma.order.count({ where: { userId } });
  }

  findManyAdmin(params: {
    skip: number;
    take: number;
    status?: any;
    paymentStatus?: any;
    search?: string;
  }) {
    return this.prisma.order.findMany({
      where: this.buildAdminWhere(params),
      include: this.fullInclude,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  }

  countAdmin(params: {
    status?: any;
    paymentStatus?: any;
    search?: string;
  }): Promise<number> {
    return this.prisma.order.count({ where: this.buildAdminWhere(params) });
  }

  updateStatus(id: string, status: any): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: this.fullInclude,
    });
  }

  updatePaymentStatus(id: string, paymentStatus: any): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: this.fullInclude,
    });
  }

  async createFromCart(
    tx: Prisma.TransactionClient,
    data: {
      orderNumber: string;
      userId: string | null;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      shippingAddress: Prisma.InputJsonValue;
      subtotal: number;
      shippingCost: number;
      discountAmount: number;
      taxAmount: number;
      total: number;
      couponId: string | null;
      couponCode: string | null;
      paymentMethod: string;
      notes: string | null;
      items: Array<{
        productId: string;
        variantId: string | null;
        productName: string;
        variantName: string | null;
        productSku: string;
        productImage: string | null;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }>;
    },
  ): Promise<Order> {
    return tx.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: data.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        discountAmount: data.discountAmount,
        taxAmount: data.taxAmount,
        total: data.total,
        couponId: data.couponId,
        couponCode: data.couponCode,
        paymentMethod: data.paymentMethod as any,
        notes: data.notes,
        items: {
          create: data.items,
        },
      },
      include: this.fullInclude,
    });
  }

  async runTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  private buildAdminWhere(params: {
    status?: any;
    paymentStatus?: any;
    search?: string;
  }): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.paymentStatus) where.paymentStatus = params.paymentStatus;
    if (params.search) {
      where.OR = [
        { orderNumber: { contains: params.search, mode: "insensitive" } },
        { customerEmail: { contains: params.search, mode: "insensitive" } },
        { customerPhone: { contains: params.search } },
        { customerName: { contains: params.search, mode: "insensitive" } },
      ];
    }
    return where;
  }
}
