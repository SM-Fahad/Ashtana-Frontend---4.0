import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const backendUrl = 'http://localhost:8081';

    this.cartService.cart$.subscribe(items => {
      this.cartItems = items.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        imageUrl: item.imageUrl
          ? item.imageUrl
          : item.imageUrls && item.imageUrls.length > 0
          ? /^https?:\/\//.test(item.imageUrls[0])
            ? item.imageUrls[0]
            : `${backendUrl}${item.imageUrls[0]}`
          : 'assets/images/placeholder-product.jpg'
      }));
      this.calculateTotal();
    });
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.updateCart();
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.updateCart();
    }
  }

  updateCart(): void {
    this.calculateTotal();
    this.cartService.updateCart(this.cartItems);
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}