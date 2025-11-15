import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [NgOptimizedImage],
  templateUrl: './title.html',
  styleUrl: './title.scss',
})
export class Title {
  titleImg = input.required<string>()
}
