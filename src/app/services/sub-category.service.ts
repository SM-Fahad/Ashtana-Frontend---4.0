import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubCategory } from '../models/sub-category';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private baseUrl = 'http://localhost:8081/api/subcategories'; // ✅ Adjust backend port if needed

  constructor(private http: HttpClient) {}

  // ✅ Get all subcategories
  getAllSubCategories(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.baseUrl);
  }

  // ✅ Get subcategory by ID
  getSubCategoryById(id: number): Observable<SubCategory> {
    return this.http.get<SubCategory>(`${this.baseUrl}/${id}`);
  }

  // ✅ Create new subcategory
  createSubCategory(subCategory: SubCategory): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.baseUrl, subCategory);
  }

  // ✅ Update subcategory
  updateSubCategory(id: number, subCategory: SubCategory): Observable<SubCategory> {
    return this.http.put<SubCategory>(`${this.baseUrl}/${id}`, subCategory);
  }

  // ✅ Delete subcategory
  deleteSubCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}