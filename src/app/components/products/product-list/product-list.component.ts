import { Component, OnInit } from '@angular/core';
import { ProductResponseDTO } from 'src/app/models/products';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: ProductResponseDTO[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== productId);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }

  // getPrimaryImage(product: ProductResponseDTO): string {
  //   if (product.imageUrls && product.imageUrls.length > 0) {
  //     return product.imageUrls[0];
  //   }
  //   return 'assets/images/placeholder-product.jpg';
  // }

getPrimaryImage(product: ProductResponseDTO): string {
  const backendUrl = 'http://localhost:8081'; // ✅ backend base URL

  if (product.imageUrls?.length) {
    const firstImage = product.imageUrls[0];
    // Return absolute URL if already absolute
    if (/^https?:\/\//.test(firstImage)) {
      return firstImage;
    }
    // Prepend backend URL for local files
    return `${backendUrl}${firstImage}`;
  }

  // fallback placeholder
  return 'assets/images/placeholder-product.jpg';
}


handleImageError(product: ProductResponseDTO, index: number = 0): void {
  if (product.imageUrls?.length && product.imageUrls[index]) {
    product.imageUrls[index] = 'assets/images/placeholder-product.jpg';
  }
}


  // Safe check for available sizes
  getAvailableSizes(product: ProductResponseDTO): string[] {
    if (!product.availableSizes) return [];
    return Object.values(product.availableSizes);
  }

  // Safe check for available colors
  getAvailableColors(product: ProductResponseDTO): string[] {
    if (!product.availableColors) return [];
    return Object.values(product.availableColors);
  }
}