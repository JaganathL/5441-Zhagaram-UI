import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  standalone: false,
  selector: 'app-home',
  template: `
    <div class="hero-section">
      <div class="container text-center">
        <h1 class="fade-in">Exquisite Jewellery for Every Occasion</h1>
        <p class="hero-subtitle fade-in">Discover our handcrafted collection of timeless pieces</p>
        <div class="hero-buttons fade-in">
          <a routerLink="/products" class="btn btn-primary">Shop Collection</a>
          <a routerLink="/rentals" class="btn btn-secondary">View Rentals</a>
        </div>
      </div>
    </div>

    <div class="section container">
      <h2 class="text-center mb-4">Featured Categories</h2>
      <div class="grid grid-3">
        <div *ngFor="let category of categories" class="category-card" [routerLink]="['/products']" [queryParams]="{category: category._id}">
          <div class="category-image-wrapper">
            <img *ngIf="category.image" [src]="getCategoryImage(category._id)" [alt]="category.name" class="category-image">
            <div *ngIf="!category.image" class="category-placeholder"></div>
          </div>
          <div class="category-overlay">
            <h3>{{category.name}}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="section container">
      <h2 class="text-center mb-4">New Arrivals</h2>
      <div class="grid grid-4">
        <div *ngFor="let product of featuredProducts" class="card" [routerLink]="['/products', product._id]">
          <div class="card-image-wrapper">
            <img *ngIf="product.images && product.images.length > 0" [src]="getProductImage(product._id)" [alt]="product.name" class="card-image">
            <div *ngIf="!product.images || product.images.length === 0" class="product-placeholder"></div>
            <span *ngIf="product.isRental" class="badge badge-rental product-badge">Rental</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{product.name}}</h3>
            <p class="card-price">₹{{product.price}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/hero-bg.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      margin-top: -72px;
      padding-top: 72px;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: var(--color-text-primary);
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .category-card {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      aspect-ratio: 4/5;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
    }

    .category-image-wrapper {
      width: 100%;
      height: 100%;
    }

    .category-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .category-card:hover .category-image {
      transform: scale(1.1);
    }

    .category-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: white;
      text-align: center;
    }

    .card-image-wrapper {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
    }

    .product-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .category-placeholder, .product-placeholder {
      width: 100%;
      height: 100%;
      background: var(--color-bg-card);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadFeaturedProducts() {
    this.productService.getProducts({ featured: true }).subscribe(data => {
      this.featuredProducts = data.slice(0, 4);
    });
  }

  getCategoryImage(id: string): string {
    return this.categoryService.getCategoryImage(id);
  }

  getProductImage(id: string): string {
    return this.productService.getProductImage(id, 0);
  }
}
