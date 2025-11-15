import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';
import { Coupon, CouponValidationResponse } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  validateCoupon(code: string, orderAmount: number): Observable<CouponValidationResponse> {
    return this.http.get<CouponValidationResponse>(`${this.apiUrl}/coupons/validate?code=${code}&orderAmount=${orderAmount}`);
  }

  getActiveCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiUrl}/coupons`);
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.apiUrl}/coupons`, coupon);
  }
}