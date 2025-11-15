import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);

  /**
   * Update document title and description meta tag
   */
  update(title: string, description: string): void {
    this.title.setTitle(title);

    // Update description (create if missing)
    this.meta.updateTag({ name: 'description', content: description });

    // Optionally update or create Open Graph tags (for social media)
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  /**
   * Optional: reset SEO tags to default site values
   */
  reset(): void {
    this.update(
      'FitZone | Fitness for Everyone',
      'Achieve your fitness goals with FitZone’s certified trainers and modern facilities.'
    );
  }
}
