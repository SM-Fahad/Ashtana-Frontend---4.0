import { Component, OnInit } from '@angular/core';
import { Size } from 'src/app/models/size';
import { SizeService } from 'src/app/services/size.service';

@Component({
  selector: 'app-size-list',
  templateUrl: './size-list.component.html',
  styleUrls: ['./size-list.component.css']
})
export class SizeListComponent implements OnInit {
  sizes: Size[] = [];
  selectedId?: number;

  constructor(private sizeService: SizeService) {}

  ngOnInit(): void {
    this.loadSizes();
  }

  loadSizes(): void {
    this.sizeService.getAllSizes().subscribe({
      next: (data) => (this.sizes = data),
      error: (err) => console.error('Error loading sizes:', err)
    });
  }

  editSize(id: number): void {
    this.selectedId = id;
  }

  deleteSize(id: number): void {
    if (confirm('Are you sure you want to delete this size?')) {
      this.sizeService.deleteSize(id).subscribe({
        next: () => this.loadSizes(),
        error: (err) => console.error('Error deleting size:', err)
      });
    }
  }
}