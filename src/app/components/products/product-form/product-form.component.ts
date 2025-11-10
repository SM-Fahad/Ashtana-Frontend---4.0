import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Color } from 'src/app/models/color';
import { ProductResponseDTO, ProductRequestDTO } from 'src/app/models/products';
import { Size } from 'src/app/models/size';
import { SubCategory } from 'src/app/models/sub-category';
import { CategoryService } from 'src/app/services/category.service';
import { ColorService } from 'src/app/services/color.service';
import { ProductService } from 'src/app/services/product.service';
import { SizeService } from 'src/app/services/size.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;
  error = '';

  // Data for dropdowns
  categories: Category[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];
  subCategories: SubCategory[] = [];

  // Image handling
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  existingImages: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private sizeService: SizeService,
    private colorService: ColorService
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDropdownData();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(1000)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      subCategoryId: [''],
      status: ['ACTIVE'],
      sku: [''],
      weight: [''],
      dimensions: [''],
      material: [''],
      brand: [''],
      isFeatured: [false],
      isBestSeller: [false],
      sizeIds: [[]],
      colorIds: [[]]
    });
  }

  loadDropdownData(): void {
    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });

    // Load subCategories

    this.subCategoryService.getAllSubCategories().subscribe({
      next: (subCategories) => this.subCategories = subCategories,
      error: (error: any) => console.error('Error loading subcategories:', error)
    });

    // Load sizes
    this.sizeService.getAllSizes().subscribe({
      next: (sizes) => this.sizes = sizes,
      error: (error) => console.error('Error loading sizes:', error)
    });

    // Load colors
    this.colorService.getAllColors().subscribe({
      next: (colors) => this.colors = colors,
      error: (error) => console.error('Error loading colors:', error)
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.populateForm(product);
        this.existingImages = product.imageUrls || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load product';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  populateForm(product: ProductResponseDTO): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      status: product.status,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      material: product.material,
      brand: product.brand,
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
      sizeIds: product.availableSizes ? Object.keys(product.availableSizes) : [],
      colorIds: product.availableColors ? Object.keys(product.availableColors) : []
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.isValidImage(file)) {
          this.selectedFiles.push(file);

          // Create preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('Please select valid image files (JPEG, PNG, GIF, WebP)');
        }
      }
    }
  }

  isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  removeSelectedImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  removeExistingImage(imageUrl: string): void {
    // In a real implementation, you would call the remove image API
    this.existingImages = this.existingImages.filter(img => img !== imageUrl);
  }

  setPrimaryImage(imageUrl: string): void {
    // In a real implementation, you would call the set primary image API
    console.log('Set primary image:', imageUrl);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      this.error = '';

      const formData = new FormData();
      const productData: ProductRequestDTO = this.productForm.value;

      // Append product data as JSON
      formData.append('product', new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      }));

      // Append images if any
      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      if (this.isEditMode && this.productId) {
        // Update existing product
        this.productService.updateProductWithImages(this.productId, formData).subscribe({
          next: (product) => {
            this.submitting = false;
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.error = 'Failed to update product';
            this.submitting = false;
            console.error('Error updating product:', error);
          }
        });
      } else {
        // Create new product
        this.productService.createProductWithMultipleImages(formData).subscribe({
          next: (product) => {
            this.submitting = false;
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.error = 'Failed to create product';
            this.submitting = false;
            console.error('Error creating product:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.productForm.controls;
  }

  // Add these methods to the ProductFormComponent class

  onSizeChange(event: any, sizeId: number): void {
    const sizeIds = this.productForm.get('sizeIds')?.value || [];
    if (event.target.checked) {
      sizeIds.push(sizeId);
    } else {
      const index = sizeIds.indexOf(sizeId);
      if (index > -1) {
        sizeIds.splice(index, 1);
      }
    }
    this.productForm.patchValue({ sizeIds });
  }

  onColorChange(event: any, colorId: number): void {
    const colorIds = this.productForm.get('colorIds')?.value || [];
    if (event.target.checked) {
      colorIds.push(colorId);
    } else {
      const index = colorIds.indexOf(colorId);
      if (index > -1) {
        colorIds.splice(index, 1);
      }
    }
    this.productForm.patchValue({ colorIds });
  }
}