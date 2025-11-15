import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Category } from './../../../../../shared/models/meals';
import { MealService } from './../../../../../shared/services/meals/meals';
//reusable
import { Carousel } from './../../../../../shared/components/ui/carousel/carousel';
import { Header } from './../../../../../shared/components/ui/header/header';
import { Title } from './../../../../../shared/components/ui/title/title';

@Component({
  selector: 'app-meals',
  imports: [Title, Header, Carousel],
  templateUrl: './meals.html',
  styleUrl: './meals.scss',
})
export class Meals implements OnInit {
  private mealService = inject(MealService);
  mealCats: WritableSignal<Category[]> = signal([]);

  ngOnInit(): void {
    this.getMealCats();
  }
  getMealCats() {
    this.mealService.getMealsCats().subscribe({
      next: (res) => {
        this.mealCats.set(res.categories);
      },
    });
  }
}
