import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ProductResponseDTO } from 'src/app/models/products';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products: any[] = [];
  orders: any[] = [];
  product?: ProductResponseDTO;

  newProduct = {
    name: '',
    price: 0,
    image: ''
  };

  constructor(private http: HttpClient, 
    private cartService: CartService, 
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
  }

  // Load products from db.json (json-server running on port 3000)
  loadProducts() {
    this.http.get<any[]>('http://localhost:3000/products')
      .subscribe((data: any[]) => this.products = data);
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price) {
      this.http.post('http://localhost:3000/products', this.newProduct)
        .subscribe(() => {
          this.loadProducts();
          this.newProduct = { name: '', price: 0, image: '' };
        });
    } else {
      alert('Please fill product name and price');
    }
  }

  deleteProduct(id: number) {
    if (confirm('Delete this product?')) {
      this.http.delete(`http://localhost:3000/products/${id}`)
        .subscribe(() => this.loadProducts());
    }
  }

  loadOrders() {
    this.orders = this.cartService.getOrders();
  }

  deleteOrder(id: number) {
    if (confirm('Delete this order?')) {
      this.cartService.deleteOrder(id);
      this.loadOrders();
    }
  }

  clearAllOrders() {
    if (confirm('Clear all orders?')) {
      localStorage.removeItem('orders');
      this.loadOrders();
    }
  }

  editProduct(product: ProductResponseDTO) {
      this.router.navigate(['/edit-product', product.id]);
    }

    // Just static values
  totalRevenue = 12500;
  totalOrders = 15;

  // Static data for demo report
  reportData = [
    { month: 'January', revenue: 2000, orders: 3 },
    { month: 'February', revenue: 1500, orders: 2 },
    { month: 'March', revenue: 2500, orders: 4 },
    { month: 'April', revenue: 1800, orders: 2 },
    { month: 'May', revenue: 2700, orders: 3 },
    { month: 'June', revenue: 2000, orders: 1 }
  ];
}