// // import { Component, OnInit } from '@angular/core';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { ProductResponseDTO } from 'src/app/models/products';
// // import { CartService } from 'src/app/services/cart.service';
// // import { ProductService } from 'src/app/services/product.service';
// // import { ColorService } from 'src/app/services/color.service';
// // import { SizeService } from 'src/app/services/size.service';
// // import { Color } from 'src/app/models/color';
// // import { Size } from 'src/app/models/size';

// // @Component({
// //   selector: 'app-product-details',
// //   templateUrl: './product-details.component.html',
// //   styleUrls: ['./product-details.component.css']
// // })
// // export class ProductDetailsComponent implements OnInit {
// //   product: any = null;
// //   colors: Color[] = [];
// //   sizes: Size[] = [];
// //   productImages: string[] = [];
// //   selectedImage: string = '';
  
// //   selectedColor: Color | null = null;
// //   selectedSize: Size | null = null;
  
// //   loading: boolean = true;
// //   error: string = '';

// //   constructor(
// //     private route: ActivatedRoute,
// //     private productService: ProductService,
// //     private router: Router,
// //     private cartService: CartService,
// //     private colorService: ColorService,
// //     private sizeService: SizeService
// //   ) {}

// //   ngOnInit(): void {
// //     this.loadProduct();
// //   }

// //   loadProduct(): void {
// //     const idParam = this.route.snapshot.paramMap.get('id');
// //     if (idParam) {
// //       const id = +idParam;
// //       this.loading = true;
      
// //       this.productService.getProductById(id).subscribe({
// //         next: (p) => {
// //           this.product = p;
// //           this.loadProductImages();
// //           this.loadColorsAndSizes();
// //           this.loading = false;
// //         },
// //         error: (err) => {
// //           console.error('Error fetching product:', err);
// //           this.error = 'Failed to load product';
// //           this.loading = false;
// //         },
// //       });
// //     } else {
// //       this.error = 'Product ID not found';
// //       this.loading = false;
// //     }
// //   }

// //   loadProductImages(): void {
// //     // First try to use imageDetails if available (has all 13 images)
// //     if (this.product?.imageDetails && this.product.imageDetails.length > 0) {
// //       // Sort by sortOrder to maintain correct order
// //       const sortedImages = this.product.imageDetails.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
// //       this.productImages = sortedImages.map((imageDetail: any) => this.getImageUrl(imageDetail.url));
// //       this.selectedImage = this.productImages[0];
// //     }
// //     // Fallback to imageUrls if imageDetails is not available
// //     else if (this.product?.imageUrls && this.product.imageUrls.length > 0) {
// //       this.productImages = this.product.imageUrls.map((url: string) => this.getImageUrl(url));
// //       this.selectedImage = this.productImages[0];
// //     } else {
// //       this.selectedImage = 'assets/images/placeholder-product.jpg';
// //       this.productImages = [this.selectedImage];
// //     }
// //   }

// //   loadColorsAndSizes(): void {
// //     if (!this.product?.id) return;

// //     // Simple approach - use available data directly from product
// //     this.processColorsAndSizesFromProduct();
// //   }

// //   processColorsAndSizesFromProduct(): void {
// //     // Process colors from availableColors array
// //     if (this.product.availableColors && Array.isArray(this.product.availableColors)) {
// //       this.colors = this.product.availableColors.map((colorStr: string) => {
// //         const match = colorStr.match(/(.+)\s\((#[\w\d]+)\)/);
// //         if (match) {
// //           return {
// //             id: Math.random(), // temporary ID
// //             colorName: match[1].trim(),
// //             colorCode: match[2].trim(),
// //             description: ''
// //           } as Color;
// //         }
// //         return {
// //           id: Math.random(),
// //           colorName: colorStr,
// //           colorCode: '#CCCCCC',
// //           description: ''
// //         } as Color;
// //       });
// //     } else {
// //       // Fallback to all colors from service
// //       this.colorService.getAllColors().subscribe({
// //         next: (colors) => this.colors = colors,
// //         error: (err) => console.error('Error loading colors:', err)
// //       });
// //     }

// //     // Process sizes from availableSizes array
// //     if (this.product.availableSizes && Array.isArray(this.product.availableSizes)) {
// //       this.sizes = this.product.availableSizes.map((sizeStr: string) => {
// //         return {
// //           id: Math.random(), // temporary ID
// //           sizeName: sizeStr,
// //           description: ''
// //         } as Size;
// //       });
// //     } else {
// //       // Fallback to all sizes from service
// //       this.sizeService.getAllSizes().subscribe({
// //         next: (sizes) => this.sizes = sizes,
// //         error: (err) => console.error('Error loading sizes:', err)
// //       });
// //     }

// //     // Auto-select first options
// //     if (this.colors.length > 0) {
// //       this.selectedColor = this.colors[0];
// //     }
// //     if (this.sizes.length > 0) {
// //       this.selectedSize = this.sizes[0];
// //     }
// //   }

// //   getImageUrl(imagePath: string): string {
// //     const backendUrl = 'http://localhost:8081';
// //     if (!imagePath) return 'assets/images/placeholder-product.jpg';
    
// //     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
// //       return imagePath;
// //     } else if (imagePath.startsWith('/')) {
// //       return `${backendUrl}${imagePath}`;
// //     } else {
// //       return `${backendUrl}/${imagePath}`;
// //     }
// //   }

// //   selectImage(image: string): void {
// //     this.selectedImage = image;
// //   }

// //   selectColor(color: Color) {
// //     this.selectedColor = color;
// //   }

// //   selectSize(size: Size) {
// //     this.selectedSize = size;
// //   }

// //   addToCart() {
// //     if (!this.selectedColor || !this.selectedSize) {
// //       alert('Please select both color and size before adding to cart.');
// //       return;
// //     }

// //     const cartItem = {
// //       ...this.product,
// //       selectedColor: this.selectedColor.colorName,
// //       selectedSize: this.selectedSize.sizeName,
// //       selectedColorCode: this.selectedColor.colorCode,
// //       selectedColorId: this.selectedColor.id,
// //       selectedSizeId: this.selectedSize.id,
// //       quantity: 1
// //     };

// //     this.cartService.addToCart(cartItem);
// //     alert('Product added to cart!');
// //     this.router.navigate(['/cart']);
// //   }

// //   hasMultipleImages(): boolean {
// //     return this.productImages.length > 1;
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ProductResponseDTO } from 'src/app/models/products';
// import { CartService } from 'src/app/services/cart.service';
// import { ProductService } from 'src/app/services/product.service';
// import { ColorService } from 'src/app/services/color.service';
// import { SizeService } from 'src/app/services/size.service';
// import { Color } from 'src/app/models/color';
// import { Size } from 'src/app/models/size';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-product-details',
//   templateUrl: './product-details.component.html',
//   styleUrls: ['./product-details.component.css']
// })
// export class ProductDetailsComponent implements OnInit {
//   product: any = null;
//   colors: Color[] = [];
//   sizes: Size[] = [];
//   productImages: string[] = [];
//   selectedImage: string = '';
  
//   selectedColor: Color | null = null;
//   selectedSize: Size | null = null;
  
//   loading: boolean = true;
//   error: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private productService: ProductService,
//     private router: Router,
//     private cartService: CartService,
//     private colorService: ColorService,
//     private sizeService: SizeService
//   ) {}

//   ngOnInit(): void {
//     this.loadProduct();
//   }

//   loadProduct(): void {
//     const idParam = this.route.snapshot.paramMap.get('id');
//     if (idParam) {
//       const id = +idParam;
//       this.loading = true;
      
//       this.productService.getProductById(id).subscribe({
//         next: (p) => {
//           this.product = p;
//           this.loadProductImages();
//           this.loadColorsAndSizes();
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error('Error fetching product:', err);
//           this.error = 'Failed to load product';
//           this.loading = false;
//         },
//       });
//     } else {
//       this.error = 'Product ID not found';
//       this.loading = false;
//     }
//   }

//   loadProductImages(): void {
//     // First try to use imageDetails if available (has all 13 images)
//     if (this.product?.imageDetails && this.product.imageDetails.length > 0) {
//       // Sort by sortOrder to maintain correct order
//       const sortedImages = this.product.imageDetails.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
//       this.productImages = sortedImages.map((imageDetail: any) => this.getImageUrl(imageDetail.url));
//       this.selectedImage = this.productImages[0];
//     }
//     // Fallback to imageUrls if imageDetails is not available
//     else if (this.product?.imageUrls && this.product.imageUrls.length > 0) {
//       this.productImages = this.product.imageUrls.map((url: string) => this.getImageUrl(url));
//       this.selectedImage = this.productImages[0];
//     } else {
//       this.selectedImage = 'assets/images/placeholder-product.jpg';
//       this.productImages = [this.selectedImage];
//     }
//   }

//   loadColorsAndSizes(): void {
//     if (!this.product?.id) return;

//     // Simple approach - use available data directly from product
//     this.processColorsAndSizesFromProduct();
//   }

//   processColorsAndSizesFromProduct(): void {
//     // Process colors from availableColors array
//     if (this.product.availableColors && Array.isArray(this.product.availableColors)) {
//       this.colors = this.product.availableColors.map((colorStr: string) => {
//         const match = colorStr.match(/(.+)\s\((#[\w\d]+)\)/);
//         if (match) {
//           return {
//             id: Math.random(), // temporary ID
//             colorName: match[1].trim(),
//             colorCode: match[2].trim(),
//             description: ''
//           } as Color;
//         }
//         return {
//           id: Math.random(),
//           colorName: colorStr,
//           colorCode: '#CCCCCC',
//           description: ''
//         } as Color;
//       });
//     } else {
//       // Fallback to all colors from service
//       this.colorService.getAllColors().subscribe({
//         next: (colors) => this.colors = colors,
//         error: (err) => console.error('Error loading colors:', err)
//       });
//     }

//     // Process sizes from availableSizes array
//     if (this.product.availableSizes && Array.isArray(this.product.availableSizes)) {
//       this.sizes = this.product.availableSizes.map((sizeStr: string) => {
//         return {
//           id: Math.random(), // temporary ID
//           sizeName: sizeStr,
//           description: ''
//         } as Size;
//       });
//     } else {
//       // Fallback to all sizes from service
//       this.sizeService.getAllSizes().subscribe({
//         next: (sizes) => this.sizes = sizes,
//         error: (err) => console.error('Error loading sizes:', err)
//       });
//     }

//     // Auto-select first options
//     if (this.colors.length > 0) {
//       this.selectedColor = this.colors[0];
//     }
//     if (this.sizes.length > 0) {
//       this.selectedSize = this.sizes[0];
//     }
//   }

//   getImageUrl(imagePath: string): string {
//     const backendUrl = 'http://localhost:8081';
//     if (!imagePath) return 'assets/images/placeholder-product.jpg';
    
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     } else if (imagePath.startsWith('/')) {
//       return `${backendUrl}${imagePath}`;
//     } else {
//       return `${backendUrl}/${imagePath}`;
//     }
//   }

//   selectImage(image: string): void {
//     this.selectedImage = image;
//   }

//   selectColor(color: Color) {
//     this.selectedColor = color;
//   }

//   selectSize(size: Size) {
//     this.selectedSize = size;
//   }

//   addToCart() {
//     if (!this.selectedColor || !this.selectedSize) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Selection Required',
//         text: 'Please select both color and size before adding to cart.',
//         confirmButtonColor: '#000',
//         confirmButtonText: 'OK'
//       });
//       return;
//     }

//     const cartItem = {
//       ...this.product,
//       selectedColor: this.selectedColor.colorName,
//       selectedSize: this.selectedSize.sizeName,
//       selectedColorCode: this.selectedColor.colorCode,
//       selectedColorId: this.selectedColor.id,
//       selectedSizeId: this.selectedSize.id,
//       quantity: 1
//     };

//     this.cartService.addToCart(cartItem);

//     // SweetAlert success message
//     Swal.fire({
//       icon: 'success',
//       title: 'Added to Bag!',
//       text: `${this.product.name} has been added to your shopping bag`,
//       showCancelButton: true,
//       showConfirmButton: true,
//       confirmButtonText: 'View Bag',
//       cancelButtonText: 'Continue Shopping',
//       confirmButtonColor: '#000',
//       cancelButtonColor: '#6c757d',
//       reverseButtons: true
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.router.navigate(['/bag']);
//       }
//       // If they click "Continue Shopping", the alert just closes and they stay on the page
//     });
//   }

//   hasMultipleImages(): boolean {
//     return this.productImages.length > 1;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ColorService } from 'src/app/services/color.service';
import { SizeService } from 'src/app/services/size.service';
import { BagService } from 'src/app/services/bag.service';
import { AuthService } from 'src/app/services/auth.service';
import { Color } from 'src/app/models/color';
import { Size } from 'src/app/models/size';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  colors: Color[] = [];
  sizes: Size[] = [];
  productImages: string[] = [];
  selectedImage: string = '';
  
  selectedColor: Color | null = null;
  selectedSize: Size | null = null;
  
  loading: boolean = true;
  error: string = '';
  addingToBag: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private bagService: BagService,
    private authService: AuthService,
    private colorService: ColorService,
    private sizeService: SizeService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loading = true;
      
      this.productService.getProductById(id).subscribe({
        next: (p) => {
          this.product = p;
          this.loadProductImages();
          this.loadColorsAndSizes();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.error = 'Failed to load product';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Product ID not found';
      this.loading = false;
    }
  }

  loadProductImages(): void {
    // First try to use imageDetails if available (has all 13 images)
    if (this.product?.imageDetails && this.product.imageDetails.length > 0) {
      // Sort by sortOrder to maintain correct order
      const sortedImages = this.product.imageDetails.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
      this.productImages = sortedImages.map((imageDetail: any) => this.getImageUrl(imageDetail.url));
      this.selectedImage = this.productImages[0];
    }
    // Fallback to imageUrls if imageDetails is not available
    else if (this.product?.imageUrls && this.product.imageUrls.length > 0) {
      this.productImages = this.product.imageUrls.map((url: string) => this.getImageUrl(url));
      this.selectedImage = this.productImages[0];
    } else {
      this.selectedImage = 'assets/images/placeholder-product.jpg';
      this.productImages = [this.selectedImage];
    }
  }

  loadColorsAndSizes(): void {
    if (!this.product?.id) return;

    // Simple approach - use available data directly from product
    this.processColorsAndSizesFromProduct();
  }

  processColorsAndSizesFromProduct(): void {
    // Process colors from availableColors array
    if (this.product.availableColors && Array.isArray(this.product.availableColors)) {
      this.colors = this.product.availableColors.map((colorStr: string) => {
        const match = colorStr.match(/(.+)\s\((#[\w\d]+)\)/);
        if (match) {
          return {
            id: Math.random(), // temporary ID
            colorName: match[1].trim(),
            colorCode: match[2].trim(),
            description: ''
          } as Color;
        }
        return {
          id: Math.random(),
          colorName: colorStr,
          colorCode: '#CCCCCC',
          description: ''
        } as Color;
      });
    } else {
      // Fallback to all colors from service
      this.colorService.getAllColors().subscribe({
        next: (colors) => this.colors = colors,
        error: (err) => console.error('Error loading colors:', err)
      });
    }

    // Process sizes from availableSizes array
    if (this.product.availableSizes && Array.isArray(this.product.availableSizes)) {
      this.sizes = this.product.availableSizes.map((sizeStr: string) => {
        return {
          id: Math.random(), // temporary ID
          sizeName: sizeStr,
          description: ''
        } as Size;
      });
    } else {
      // Fallback to all sizes from service
      this.sizeService.getAllSizes().subscribe({
        next: (sizes) => this.sizes = sizes,
        error: (err) => console.error('Error loading sizes:', err)
      });
    }

    // Auto-select first options
    if (this.colors.length > 0) {
      this.selectedColor = this.colors[0];
    }
    if (this.sizes.length > 0) {
      this.selectedSize = this.sizes[0];
    }
  }

  getImageUrl(imagePath: string): string {
    const backendUrl = 'http://localhost:8081';
    if (!imagePath) return 'assets/images/placeholder-product.jpg';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    } else if (imagePath.startsWith('/')) {
      return `${backendUrl}${imagePath}`;
    } else {
      return `${backendUrl}/${imagePath}`;
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: Color) {
    this.selectedColor = color;
  }

  selectSize(size: Size) {
    this.selectedSize = size;
  }

  addToCart() {
    // Check if user is logged in
    if (!this.authService.getToken()) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to add items to your bag.',
        showCancelButton: true,
        confirmButtonText: 'Log In',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#000',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    if (!this.selectedColor || !this.selectedSize) {
      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select both color and size before adding to cart.',
        confirmButtonColor: '#000',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.addingToBag = true;

    // Get current user
    const user = this.authService.getUser();
    const userName = user?.userName || user?.username;

    if (!userName) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to get user information. Please log in again.',
        confirmButtonColor: '#000'
      });
      this.addingToBag = false;
      return;
    }

    // Create the request for backend
    const addToBagRequest = {
      userName: userName,
      productId: this.product.id,
      quantity: 1
    };

    // Call the BagService to add to backend
    this.bagService.addItemToBag(addToBagRequest).subscribe({
      next: (response) => {
        this.addingToBag = false;
        
        // SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Added to Bag!',
          text: `${this.product.name} has been added to your shopping bag`,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'View Bag',
          cancelButtonText: 'Continue Shopping',
          confirmButtonColor: '#000',
          cancelButtonColor: '#6c757d',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/bag']);
          }
        });
      },
      error: (error) => {
        this.addingToBag = false;
        console.error('Error adding to bag:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add',
          text: 'There was an error adding the item to your bag. Please try again.',
          confirmButtonColor: '#000'
        });
      }
    });
  }

  hasMultipleImages(): boolean {
    return this.productImages.length > 1;
  }
}