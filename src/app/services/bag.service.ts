import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyBag, MyBagItem, AddToBagRequest } from '../models/bag';
import { environment } from '../env/environment';

@Injectable({
  providedIn: 'root'
})
export class BagService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBagByUserName(userName: string): Observable<MyBag> {
    return this.http.get<MyBag>(`${this.apiUrl}/mybag/user/${userName}`);
  }

  addItemToBag(request: AddToBagRequest): Observable<MyBagItem> {
    return this.http.post<MyBagItem>(`${this.apiUrl}/bag_items`, request);
  }

  updateItemQuantity(itemId: number, quantity: number): Observable<MyBagItem> {
    return this.http.put<MyBagItem>(`${this.apiUrl}/bag_items/${itemId}/quantity?quantity=${quantity}`, {});
  }

  removeItemFromBag(itemId: number): Observable<MyBagItem> {
    const url = `${this.apiUrl}/bag_items/${itemId}`;
    console.log('DELETE request to:', url);
    return this.http.delete<MyBagItem>(url);
  }

  clearBag(bagId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/mybag/${bagId}`, { responseType: 'text' as 'json' });
  }
}