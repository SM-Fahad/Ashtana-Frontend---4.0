import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();
  
  // Cart count observable
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cart.next(this.cartItems);
      this.updateCartCount();
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cart.next(this.cartItems);
    this.updateCartCount(); // Update count when cart changes
  }

  private updateCartCount() {
    const totalItems = this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    this.cartCount.next(totalItems);
  }

  addToCart(product: any) {
    // Check if product with same ID, size, and color exists
    const existingIndex = this.cartItems.findIndex(
      item =>
        item.id === product.id &&
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
    );

    if (existingIndex > -1) {
      // Increment quantity if already in cart
      this.cartItems[existingIndex].quantity = (this.cartItems[existingIndex].quantity || 1) + (product.quantity || 1);
    } else {
      // Add new item
      this.cartItems.push({ ...product, quantity: product.quantity || 1 });
    }

    this.saveCart();
  }

  updateCart(items: any[]) {
    this.cartItems = items.map(item => ({ ...item, quantity: item.quantity || 1 }));
    this.saveCart();
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
    this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    localStorage.removeItem('cart');
  }

  getCart() {
    return this.cartItems;
  }

  getCartCount() {
    return this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  // Orders handling
  saveOrder(order: any) {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

  deleteOrder(orderId: string | number) {
    const orders = this.getOrders().filter((o: any) => {
      // Compare both as strings to handle both number and string IDs
      return o.id.toString() !== orderId.toString();
    });
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  // Optional: Get order by ID
  getOrderById(orderId: string | number) {
    const orders = this.getOrders();
    return orders.find((o: any) => o.id.toString() === orderId.toString());
  }

  // Optional: Update order status
  updateOrderStatus(orderId: string | number, status: string) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o: any) => o.id.toString() === orderId.toString());
    
    if (orderIndex > -1) {
      orders[orderIndex].status = status;
      localStorage.setItem('orders', JSON.stringify(orders));
      return true;
    }
    return false;
  }

  // Optional: Check if product is already in cart
  isProductInCart(productId: number, selectedSize?: string, selectedColor?: string): boolean {
    return this.cartItems.some(item => 
      item.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );
  }

  // Optional: Get product quantity in cart
  getProductQuantity(productId: number, selectedSize?: string, selectedColor?: string): number {
    const item = this.cartItems.find(item => 
      item.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );
    return item ? item.quantity : 0;
  }
}