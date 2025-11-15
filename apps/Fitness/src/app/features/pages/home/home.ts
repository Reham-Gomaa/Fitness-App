import { Component } from '@angular/core';
import { AboutUs } from './components/about-us/about-us';

@Component({
  selector: 'app-home',
  imports: [AboutUs],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
