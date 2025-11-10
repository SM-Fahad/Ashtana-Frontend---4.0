import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Size } from '../models/size';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private baseUrl = 'http://localhost:8081/api/sizes'; // ✅ adjust if needed

  constructor(private http: HttpClient) {}

  // ✅ Get all sizes
  getAllSizes(): Observable<Size[]> {
    return this.http.get<Size[]>(this.baseUrl);
  }

  // ✅ Get size by ID
  getSizeById(id: number): Observable<Size> {
    return this.http.get<Size>(`${this.baseUrl}/${id}`);
  }

  getSizesByProductId(productId: number) {
  return this.http.get<Size[]>(`${this.baseUrl}/product/${productId}`);
}

  // ✅ Create new size
  createSize(size: Size): Observable<Size> {
    return this.http.post<Size>(this.baseUrl, size);
  }

  // ✅ Update size
  updateSize(id: number, size: Size): Observable<Size> {
    return this.http.put<Size>(`${this.baseUrl}/${id}`, size);
  }

  // ✅ Delete size
  deleteSize(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
