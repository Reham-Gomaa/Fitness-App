import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [Navbar, Footer, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
