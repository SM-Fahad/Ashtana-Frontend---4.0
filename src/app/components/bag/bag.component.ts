import { Component, OnInit } from '@angular/core';
import { BagService } from '../../services/bag.service';
import { AuthService } from '../../services/auth.service';
import { MyBag, MyBagItem } from '../../models/bag';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bag',
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class BagComponent implements OnInit {
  bag: MyBag | null = null;
  loading = false;
  error: string | null = null;
  updatingItems = new Set<number>();
  private backendUrl = 'http://localhost:8081';

  constructor(
    private bagService: BagService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBag();
  }

  loadBag(): void {
    this.loading = true;
    this.error = null;
    
    const userName = this.getCurrentUserName();
    
    if (!userName) {
      this.error = 'Please log in to view your bag';
      this.loading = false;
      return;
    }
    
    this.bagService.getBagByUserName(userName).subscribe({
      next: (bag) => {
        this.bag = bag;
        this.loading = false;
        console.log('Bag loaded:', bag); // Debug log
      },
      error: (error) => {
        console.error('Error loading bag:', error);
        this.error = `Failed to load bag: ${error.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  updateQuantity(item: MyBagItem, newQuantity: number): void {
    if (newQuantity < 1 || this.updatingItems.has(item.id)) return;

    this.updatingItems.add(item.id);

    this.bagService.updateItemQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        this.updatingItems.delete(item.id);
        this.loadBag();
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.error = 'Failed to update quantity';
        this.updatingItems.delete(item.id);
      }
    });
  }

  removeItem(itemId: number): void {
    if (this.updatingItems.has(itemId)) return;

    this.updatingItems.add(itemId);

    this.bagService.removeItemFromBag(itemId).subscribe({
      next: () => {
        this.updatingItems.delete(itemId);
        this.loadBag();
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.error = 'Failed to remove item';
        this.updatingItems.delete(itemId);
      }
    });
  }

  clearBag(): void {
    if (!this.bag || !confirm('Are you sure you want to clear your entire bag?')) return;

    this.bagService.clearBag(this.bag.id).subscribe({
      next: () => {
        this.bag = null;
      },
      error: (error) => {
        console.error('Error clearing bag:', error);
        this.error = 'Failed to clear bag';
      }
    });
  }

  proceedToCheckout(): void {
    // Implement checkout logic here
    alert('Proceeding to checkout...');
  }

  // Image handling - ROBUST VERSION
  getProductImage(item: MyBagItem): string {
    // Debug log to see what's in the item
    console.log('Image data for item:', {
      itemId: item?.id,
      productName: item?.productName,
      primaryImageUrl: item?.primaryImageUrl,
      productImageUrls: item?.productImageUrls
    });

    if (!item) {
      return 'assets/images/placeholder-product.jpg';
    }

    // Check primaryImageUrl first
    if (item.primaryImageUrl && 
        typeof item.primaryImageUrl === 'string' && 
        item.primaryImageUrl.trim() !== '') {
      console.log('Using primary image URL:', item.primaryImageUrl);
      return item.primaryImageUrl;
    }

    // Check productImageUrls array
    if (item.productImageUrls && 
        Array.isArray(item.productImageUrls) && 
        item.productImageUrls.length > 0) {
      
      const validImage = item.productImageUrls.find(url => 
        url && typeof url === 'string' && url.trim() !== ''
      );
      
      if (validImage) {
        console.log('Using product image URL:', validImage);
        return validImage;
      }
    }

    // Fallback to placeholder
    console.log('No valid image found, using placeholder');
    return 'assets/images/placeholder-product.jpg';
  }

  handleImageError(event: any): void {
    console.warn('Image failed to load, switching to placeholder');
    const target = event.target as HTMLImageElement;
    if (target && target.tagName === 'IMG') {
      target.src = 'assets/images/placeholder-product.jpg';
      target.alt = 'Product image not available';
    }
  }

  // Safe getters
  get bagItems(): MyBagItem[] {
    return this.bag?.items || [];
  }

  get totalItems(): number {
    return this.bag?.totalItems || 0;
  }

  get totalPrice(): number {
    return this.bag?.totalPrice || 0;
  }

  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  private getCurrentUserName(): string | null {
    const user = this.authService.getUser();
    return user?.userName || user?.username || null;
  }

  isItemUpdating(itemId: number): boolean {
    return this.updatingItems.has(itemId);
  }
  
}