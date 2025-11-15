import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';
import { Address } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserAddresses(userName: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/addresses/user/${userName}`);
  }

  createAddress(address: any): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/addresses`, address);
  }

  updateAddress(id: number, address: any): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/addresses/${id}`, address);
  }

  deleteAddress(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/addresses/${id}`);
  }

  getAddressById(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}/addresses/${id}`);
  }
}