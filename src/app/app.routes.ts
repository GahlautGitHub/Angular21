import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // Products
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products')
        .then(m => m.Products)
  },

  // About Us
  {
    path: 'aboutus',
    loadComponent: () =>
      import('./features/aboutus/aboutus')
        .then(m => m.Aboutus)
  },

  // Contact
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact')
        .then(m => m.Contact)
  },

  // Blog
  {
    path: 'blog',
    loadComponent: () =>
      import('./features/blog/blog')
        .then(m => m.Blog)
  },

  // Wildcard
  { path: '**', redirectTo: 'products' }
];