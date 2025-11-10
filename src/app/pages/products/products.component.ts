import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductResponseDTO } from 'src/app/models/products';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service'; // Add this import

interface ProductSelection {
  selectedSize?: string;
  selectedColor?: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductResponseDTO[] = [];
  favoritedProducts: Set<number> = new Set();
  productSelections: Map<number, ProductSelection> = new Map();
  recentlyAddedProductId: number | null = null;

  constructor(
    private productService: ProductService, 
    private router: Router,
    private cartService: CartService // Inject cart service
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      // Initialize default selections for each product
      this.products.forEach(product => {
        if (product.id) {
          const selection: ProductSelection = {};
          
          // Set first available size as default if available
          const availableSizes = this.getAvailableSizes(product);
          if (availableSizes.length > 0) {
            selection.selectedSize = availableSizes[0];
          }
          
          // Set first available color as default if available
          const availableColors = this.getAvailableColors(product);
          if (availableColors.length > 0) {
            selection.selectedColor = availableColors[0];
          }
          
          this.productSelections.set(product.id, selection);
        }
      });
    });
    this.loadFavorites();
  }

  viewProduct(product: ProductResponseDTO) {
    if (product.id) {
      this.router.navigate(['/products', product.id]);
    }
  }

  getPrimaryImage(product: ProductResponseDTO): string {
    const backendUrl = 'http://localhost:8081';

    if (product.imageUrls?.length) {
      const firstImage = product.imageUrls[0];
      if (/^https?:\/\//.test(firstImage)) {
        return firstImage;
      }
      return `${backendUrl}${firstImage}`;
    }

    return 'assets/images/placeholder-product.jpg';
  }

  // Favorite functionality
  toggleFavorite(product: ProductResponseDTO) {
    if (product.id) {
      if (this.favoritedProducts.has(product.id)) {
        this.favoritedProducts.delete(product.id);
      } else {
        this.favoritedProducts.add(product.id);
      }
      localStorage.setItem('favoriteProducts', JSON.stringify([...this.favoritedProducts]));
    }
  }

  isProductFavorited(product: ProductResponseDTO): boolean {
    return product.id ? this.favoritedProducts.has(product.id) : false;
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem('favoriteProducts');
    if (savedFavorites) {
      this.favoritedProducts = new Set(JSON.parse(savedFavorites));
    }
  }

  // Size & Color Selection Methods
  getAvailableSizes(product: ProductResponseDTO): string[] {
    if (product.availableSizes) {
      return Object.values(product.availableSizes);
    }
    return [];
  }

  getAvailableColors(product: ProductResponseDTO): string[] {
    if (product.availableColors) {
      return Object.values(product.availableColors);
    }
    return [];
  }

  selectSize(product: ProductResponseDTO, size: string) {
    if (product.id) {
      const selection = this.productSelections.get(product.id) || {};
      selection.selectedSize = size;
      this.productSelections.set(product.id, selection);
    }
  }

  selectColor(product: ProductResponseDTO, color: string) {
    if (product.id) {
      const selection = this.productSelections.get(product.id) || {};
      selection.selectedColor = color;
      this.productSelections.set(product.id, selection);
    }
  }

  getSelectedSize(product: ProductResponseDTO): string {
    if (product.id) {
      const selection = this.productSelections.get(product.id);
      return selection?.selectedSize || '';
    }
    return '';
  }

  getSelectedColor(product: ProductResponseDTO): string {
    if (product.id) {
      const selection = this.productSelections.get(product.id);
      return selection?.selectedColor || '';
    }
    return '';
  }

  canAddToBag(product: ProductResponseDTO): boolean {
    if (!product.id) return false;
    
    const selection = this.productSelections.get(product.id);
    const hasSizes = this.getAvailableSizes(product).length > 0;
    const hasColors = this.getAvailableColors(product).length > 0;

    if (hasSizes && !selection?.selectedSize) return false;
    if (hasColors && !selection?.selectedColor) return false;
    
    return true;
  }

  // Add to cart functionality - FIXED
  addToCart(product: ProductResponseDTO) {
    if (!product.id || !this.canAddToBag(product)) return;

    const selection = this.productSelections.get(product.id);
    
    // Create cart item with selected variants
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: this.getPrimaryImage(product),
      selectedSize: selection?.selectedSize,
      selectedColor: selection?.selectedColor,
      quantity: 1
    };

    console.log('Adding to cart:', cartItem);
    
    // Actually add to cart using the cart service
    this.cartService.addToCart(cartItem);
    
    // Show success feedback
    this.showAddToCartFeedback(product.id);
  }

  private showAddToCartFeedback(productId: number) {
    this.recentlyAddedProductId = productId;
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
      this.recentlyAddedProductId = null;
    }, 2000);
  }

  getRecentlyAddedProductId(): number | null {
    return this.recentlyAddedProductId;
  }
}