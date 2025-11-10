import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Size } from 'src/app/models/size';
import { SizeService } from 'src/app/services/size.service';

@Component({
  selector: 'app-size-form',
  templateUrl: './size-form.component.html',
  styleUrls: ['./size-form.component.css']
})
export class SizeFormComponent implements OnInit {
  @Input() sizeId?: number;
  sizeForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  message = '';

  constructor(private fb: FormBuilder, private sizeService: SizeService) {}

  ngOnInit(): void {
    this.sizeForm = this.fb.group({
      sizeName: ['', Validators.required]
    });

    if (this.sizeId) {
      this.isEditMode = true;
      this.loadSize(this.sizeId);
    }
  }

  loadSize(id: number): void {
    this.sizeService.getSizeById(id).subscribe({
      next: (size) => this.sizeForm.patchValue(size),
      error: (err) => console.error('Error loading size:', err)
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.sizeForm.invalid) return;

    this.loading = true;
    const sizeData: Size = this.sizeForm.value;

    if (this.isEditMode && this.sizeId) {
      this.sizeService.updateSize(this.sizeId, sizeData).subscribe({
        next: () => {
          this.message = 'Size updated successfully!';
          this.loading = false;
        },
        error: () => {
          this.message = 'Failed to update size.';
          this.loading = false;
        }
      });
    } else {
      this.sizeService.createSize(sizeData).subscribe({
        next: () => {
          this.message = 'Size created successfully!';
          this.sizeForm.reset();
          this.submitted = false;
          this.loading = false;
        },
        error: () => {
          this.message = 'Failed to create size.';
          this.loading = false;
        }
      });
    }
  }
}