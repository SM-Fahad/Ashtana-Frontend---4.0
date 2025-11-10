import { Component, OnInit } from '@angular/core';
import { SubCategory } from 'src/app/models/sub-category';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.css']
})
export class SubCategoryListComponent implements OnInit {
  subCategories: SubCategory[] = [];

  constructor(private subCategoryService: SubCategoryService) {}

  ngOnInit(): void {
    this.loadSubCategories();
  }

  loadSubCategories(): void {
    this.subCategoryService.getAllSubCategories().subscribe({
      next: (data) => (this.subCategories = data),
      error: (err) => console.error('Error loading subcategories:', err)
    });
  }

  editSubCategory(id?: number): void {
    if (!id) return;
    console.log('Editing subcategory ID:', id);
    // navigate to form or open modal
  }

  deleteSubCategory(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.subCategoryService.deleteSubCategory(id).subscribe({
        next: () => this.loadSubCategories(),
        error: (err) => console.error('Error deleting subcategory:', err)
      });
    }
  }
}