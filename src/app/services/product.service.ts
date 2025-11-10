// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponseDTO, ProductRequestDTO } from '../models/products';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `http://localhost:8081/api/products`;

  constructor(private http: HttpClient) {}

  // -------------------- CREATE PRODUCT METHODS -------------------- //

  /**
   * Create product with multiple images
   */
  createProductWithMultipleImages(formData: FormData): Observable<ProductResponseDTO> {
    return this.http.post<ProductResponseDTO>(`${this.apiUrl}/create`, formData);
  }

  /**
   * Create product with single image (backward compatibility)
   */
  createProductWithSingleImage(productRequest: ProductRequestDTO, image: File): Observable<ProductResponseDTO> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productRequest)], { type: 'application/json' }));
    formData.append('image', image);
    
    return this.http.post<ProductResponseDTO>(`${this.apiUrl}/create-single`, formData);
  }

  /**
   * Create product without images
   */
  createProductWithoutImages(productRequest: ProductRequestDTO): Observable<ProductResponseDTO> {
    return this.http.post<ProductResponseDTO>(`${this.apiUrl}/create-no-images`, productRequest);
  }

  // -------------------- GET PRODUCT METHODS -------------------- //

  /**
   * Get all products
   */
  getAllProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(this.apiUrl);
  }

  /**
   * Get product by ID
   */
  getProductById(id: number): Observable<ProductResponseDTO> {
    return this.http.get<ProductResponseDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/featured`);
  }

  /**
   * Get best seller products
   */
  getBestSellerProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/best-sellers`);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  // -------------------- UPDATE PRODUCT METHODS -------------------- //

  /**
   * Update product with new images
   */
  updateProductWithImages(id: number, formData: FormData): Observable<ProductResponseDTO> {
    return this.http.put<ProductResponseDTO>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Update product details without images
   */
  updateProductDetails(id: number, productRequest: ProductRequestDTO): Observable<ProductResponseDTO> {
    return this.http.put<ProductResponseDTO>(`${this.apiUrl}/${id}/details`, productRequest);
  }

  // -------------------- IMAGE MANAGEMENT METHODS -------------------- //

  /**
   * Add more images to existing product
   */
  addMoreImages(productId: number, additionalImages: File[]): Observable<ProductResponseDTO> {
    const formData = new FormData();
    additionalImages.forEach(file => {
      formData.append('additionalImages', file);
    });
    
    return this.http.post<ProductResponseDTO>(`${this.apiUrl}/${productId}/images`, formData);
  }

  /**
   * Remove image from product
   */
  removeImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/images/${imageId}`);
  }

  /**
   * Set primary image for product
   */
  setPrimaryImage(productId: number, imageId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${productId}/images/${imageId}/set-primary`, {});
  }

  // -------------------- STOCK MANAGEMENT METHODS -------------------- //

  /**
   * Update product stock quantity
   */
  updateStockQuantity(productId: number, quantity: number): Observable<void> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.patch<void>(`${this.apiUrl}/${productId}/stock`, {}, { params });
  }

  // -------------------- DELETE PRODUCT METHODS -------------------- //

  /**
   * Delete product (soft delete)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Hard delete product (permanent deletion)
   */
  hardDeleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/hard`);
  }

  // -------------------- UTILITY METHODS -------------------- //

  /**
   * Search products by name or SKU
   */
  searchProducts(query: string): Observable<ProductResponseDTO[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get products with pagination
   */
  getProductsWithPagination(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }
}