// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ProductService } from 'src/app/services/product.service';

// @Component({
//   selector: 'app-product-add-edit',
//   templateUrl: './product-add-edit.component.html',
//   styleUrls: ['./product-add-edit.component.css']
// })
// export class ProductAddEditComponent implements OnInit {
// productForm!: FormGroup;
//   isEditMode = false;
//   productId!: any;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private productService: ProductService
//   ) {}

//   ngOnInit(): void {
//     this.productForm = this.fb.group({
//       name: ['', Validators.required],
//       description: ['', Validators.required],
//       category: ['', Validators.required],
//       price: [0, [Validators.required, Validators.min(1)]],
//       imageUrl: ['', Validators.required]
//     });

//     // Check if we’re editing
//     // this.route.paramMap.subscribe(params => {
//     //   const id = params.get('id');
//     //   if (id) {
//     //     this.isEditMode = true;
//     //     this.productId = id;
//     //     this.loadProduct(this.productId);
//     //   }
//     // });


//       const id = this.route.snapshot.paramMap.get('id');
//       if (id) {
//         this.isEditMode = true;
//         this.productId = id;
//         this.loadProduct(this.productId);
//       };
//   }

//   loadProduct(id: any): void {
//     this.productService.getProductById(id).subscribe(product => {
//       if (product) {
//         this.productForm.patchValue(product);
//       }
//     });
//   }

// onSubmit(): void {
//     if (this.productForm.valid) {
//       if (this.isEditMode) {
//         this.productService.updateProduct(this.productId, this.productForm.value).subscribe({
//           next: () => {
//             alert('Product updated successfully!');
//             this.router.navigate(['/admin']);
//           },
//           error: (err) => console.error('Error updating product:', err)
//         });
//       } else {
//         this.productService.addProduct(this.productForm.value).subscribe({
//           next: () => {
//             alert('Product added successfully!');
//             this.router.navigate(['/admin']);
//           },
//           error: (err) => console.error('Error adding product:', err)
//         });
//       }
//     }
//   }

// }
