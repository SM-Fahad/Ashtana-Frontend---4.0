import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-add',
  templateUrl: './color-add.component.html',
  styleUrls: ['./color-add.component.css']
})
export class ColorAddComponent implements OnInit {
  @Input() colorId?: number; // for edit mode
  colorForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.colorForm = this.fb.group({
      colorName: ['', Validators.required],
      colorCode: ['', [Validators.required, Validators.pattern(/^#([0-9A-Fa-f]{3}){1,2}$/)]]
    });

    if (this.colorId) {
      this.isEditMode = true;
      this.loadColor(this.colorId);
    }
  }

  // ✅ Load existing color for edit
  loadColor(id: number): void {
    this.colorService.getColorById(id).subscribe({
      next: (color) => this.colorForm.patchValue(color),
      error: (err) => console.error('Error loading color:', err)
    });
  }

  // ✅ Save (create or update)
  onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.colorForm.invalid) {
      return;
    }

    this.loading = true;
    const colorData: Color = this.colorForm.value;

    if (this.isEditMode && this.colorId) {
      this.colorService.updateColor(this.colorId, colorData).subscribe({
        next: () => {
          this.message = 'Color updated successfully!';
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.message = 'Failed to update color.';
          this.loading = false;
        }
      });
    } else {
      this.colorService.createColor(colorData).subscribe({
        next: () => {
          this.message = 'Color created successfully!';
          this.colorForm.reset();
          this.submitted = false;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.message = 'Failed to create color.';
          this.loading = false;
        }
      });
    }
  }
}
