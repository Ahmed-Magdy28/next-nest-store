export interface OrderItemDto {
  id: string;
  productId: string | null;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  productSku: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  couponCode: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  notes: string | null;
  items: OrderItemDto[];
  createdAt: Date;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    country: string;
    city: string;
    area?: string;
    street: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
  };
  paymentMethod: "CASH_ON_DELIVERY" | "CREDIT_CARD" | "PAYPAL" | "WALLET";
  couponCode?: string;
  notes?: string;
}
