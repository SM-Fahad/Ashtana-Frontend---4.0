import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  cartCount: number = 0;
  showPulse: boolean = false;
  userName: string = '';
  
  private authSubscription: Subscription = new Subscription();
  private adminSubscription: Subscription = new Subscription();
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Check initial authentication status
    this.isLoggedIn = this.authService.getToken() !== null;
    this.isAdmin = this.authService.isUserAdmin();
    
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.userName = user?.userFirstName || user?.userName || 'User';
    }

    // Subscribe to authentication status
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const user = this.authService.getUser();
        this.userName = user?.userFirstName || user?.userName || 'User';
      } else {
        this.userName = '';
      }
    });

    // Subscribe to admin status changes
    this.adminSubscription = this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    // Subscribe to cart count changes
    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      // Only show pulse animation when count increases
      if (count > this.cartCount) {
        this.triggerPulseAnimation();
      }
      this.cartCount = count;
    });

    // Initialize cart count from service
    this.cartCount = this.cartService.getCartCount();
  }

  triggerPulseAnimation() {
    this.showPulse = true;
    // Remove pulse class after animation completes
    setTimeout(() => {
      this.showPulse = false;
    }, 600);
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}