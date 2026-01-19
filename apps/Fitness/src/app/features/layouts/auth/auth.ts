import { Component } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-auth',
  imports: [RouterModule  , RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {}
