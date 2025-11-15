export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  pricePerItem: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userName: string;
  subtotalAmount: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  shippingAddress: Address;
  billingAddress: Address;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
}

export interface CheckoutRequest {
  userName: string;
  shippingAddressId: number;
  billingAddressId?: number;
  couponCode?: string;
  paymentMethod: string;
}

export interface Address {
  id: number;
  userName: string;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: string;
  phone: string;
}

export interface PaymentRequest {
  orderId: number;
  paymentMethod: string;
  amount: number;
  paymentToken?: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  discountAmount: number;
  maxDiscount: number;
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  couponType: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  discountAmount: number;
  message: string;
  coupon?: Coupon;
}