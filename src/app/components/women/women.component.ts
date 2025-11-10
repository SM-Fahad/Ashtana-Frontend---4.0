import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductResponseDTO } from 'src/app/models/products';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-women',
  templateUrl: './women.component.html',
  styleUrls: ['./women.component.css']
})
export class WomenComponent implements OnInit {
  products: ProductResponseDTO[] = [];
  
    constructor(private productService: ProductService, private router: Router) { }
  
    ngOnInit(): void {
      this.productService.getAllProducts().subscribe(data => this.products = data);
    }
  
    viewProduct(product: ProductResponseDTO) {
      this.router.navigate(['/products', product.id]);
    }
}
