import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { StorageKeys } from "../../../../../core/constants/storage.config";
import { CLIENT_ROUTES } from "../../../../../core/constants/client-routes";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    AvatarModule,
    MenuModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  mobileMenuOpen = false;
  private authCheckInterval: any;

  navItems = [
    { label: 'Home', path: CLIENT_ROUTES.main.home },
    { label: 'About', path: CLIENT_ROUTES.main.about },
    { label: 'Classes', path: CLIENT_ROUTES.main.classes },
    { label: 'Healthy', path: CLIENT_ROUTES.main.meals }
  ];

  accountMenuItems: MenuItem[] = [
    {
      label: 'Account',
      icon: 'pi pi-user',
      command: () => this.navigateToAccount()
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.authCheckInterval = setInterval(() => {
      this.checkAuthStatus();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval);
    }
  }

  private checkAuthStatus() {
    const token = localStorage.getItem(StorageKeys.TOKEN);
    this.isLoggedIn = !!token;
  }

  getCurrentLang(): string {
    const lang = localStorage.getItem(StorageKeys.LANGUAGE) || 'en';
    return lang.toLowerCase(); // Force lowercase to match route parameters
  }

  // Simple route generation - FIXED
  getRoute(path: string){
    return [ path];
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onLogin() {
    this.router.navigate([this.getCurrentLang(), CLIENT_ROUTES.auth.base, CLIENT_ROUTES.auth.login]);
    this.mobileMenuOpen = false;
  }

  onSignup() {
    this.router.navigate([this.getCurrentLang(), CLIENT_ROUTES.auth.base, CLIENT_ROUTES.auth.register]);
    this.mobileMenuOpen = false;
  }

  navigateToAccount() {
    this.router.navigate([this.getCurrentLang(), 'main', CLIENT_ROUTES.main.account]);
    this.mobileMenuOpen = false;
  }

  logout() {
    localStorage.removeItem(StorageKeys.TOKEN);
    this.checkAuthStatus();
    this.mobileMenuOpen = false;
    this.router.navigate([this.getCurrentLang(), 'main', CLIENT_ROUTES.main.home]);
  }
}