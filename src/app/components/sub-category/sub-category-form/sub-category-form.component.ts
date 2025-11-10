import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/sub-category';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-sub-category-form',
  templateUrl: './sub-category-form.component.html',
  styleUrls: ['./sub-category-form.component.css']
})
export class SubCategoryFormComponent implements OnInit {
  subCategory: SubCategory = { name: '', description: '', categoryId: 0 };
  categories: Category[] = [];

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  saveSubCategory(): void {
    if (this.subCategory.id) {
      this.subCategoryService
        .updateSubCategory(this.subCategory.id, this.subCategory)
        .subscribe({
          next: () => alert('SubCategory updated successfully!'),
          error: (err) => console.error('Error updating subcategory:', err)
        });
    } else {
      this.subCategoryService.createSubCategory(this.subCategory).subscribe({
        next: () => alert('SubCategory created successfully!'),
        error: (err) => console.error('Error creating subcategory:', err)
      });
    }
  }
}
