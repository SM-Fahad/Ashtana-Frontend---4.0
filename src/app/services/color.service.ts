import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Color } from '../models/color';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private baseUrl = 'http://localhost:8081/api/colors'; // ✅ adjust if needed

  constructor(private http: HttpClient) {}

  // ✅ Get all colors
  getAllColors(): Observable<Color[]> {
    return this.http.get<Color[]>(this.baseUrl);
  }

  // ✅ Get color by ID
  getColorById(id: number): Observable<Color> {
    return this.http.get<Color>(`${this.baseUrl}/${id}`);
  }

  // ✅ Create new color
  createColor(color: Color): Observable<Color> {
    return this.http.post<Color>(this.baseUrl, color);
  }

  getColorsByProductId(productId: number) {
  return this.http.get<Color[]>(`${this.baseUrl}/product/${productId}`);
  }

  // ✅ Update color
  updateColor(id: number, color: Color): Observable<Color> {
    return this.http.put<Color>(`${this.baseUrl}/${id}`, color);
  }

  // ✅ Delete color
  deleteColor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
