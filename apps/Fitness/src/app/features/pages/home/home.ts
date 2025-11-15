import { Component } from '@angular/core';
import { Workouts } from './components/workouts/workouts';
import { Meals } from "./components/meals/meals";

@Component({
  selector: 'app-home',
  imports: [Meals, Workouts, Meals],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
