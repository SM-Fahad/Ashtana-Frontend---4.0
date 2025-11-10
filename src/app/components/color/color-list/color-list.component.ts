import { Component, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color.service';
import { Color } from 'src/app/models/color';

@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html'
})
export class ColorListComponent implements OnInit {
  colors: Color[] = [];

  constructor(private colorService: ColorService) {}

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.colorService.getAllColors().subscribe({
      next: (data) => this.colors = data,
      error: (err) => console.error('Error loading colors:', err)
    });
  }
}
