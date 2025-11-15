import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';
import { Order, CheckoutRequest, PaymentRequest, PaymentResponse } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  checkout(checkoutRequest: CheckoutRequest): Observable<Order> {
    let url = `${this.apiUrl}/orders/checkout?userName=${checkoutRequest.userName}&shippingAddressId=${checkoutRequest.shippingAddressId}&paymentMethod=${checkoutRequest.paymentMethod}`;
    
    if (checkoutRequest.billingAddressId) {
      url += `&billingAddressId=${checkoutRequest.billingAddressId}`;
    }
    
    if (checkoutRequest.couponCode) {
      url += `&couponCode=${checkoutRequest.couponCode}`;
    }

    return this.http.post<Order>(url, {});
  }

  applyCoupon(orderId: number, couponCode: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/apply-coupon?couponCode=${couponCode}`, {});
  }

  removeCoupon(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/remove-coupon`, {});
  }

  getUserOrders(userName: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user/${userName}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  // New method to handle payment after order creation
  processPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/payments/initiate`, paymentRequest);
  }
}