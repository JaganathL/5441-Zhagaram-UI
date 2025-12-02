import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  standalone: false,
    selector: 'app-product-list',
    template: `
    <div class="container section">
      <div class="filters mb-4">
        <button class="btn" [class.btn-primary]="!selectedCategory" [class.btn-ghost]="selectedCategory" (click)="filterByCategory(null)">All</button>
        <button *ngFor="let category of categories" 
                class="btn" 
                [class.btn-primary]="selectedCategory === category._id" 
                [class.btn-ghost]="selectedCategory !== category._id"
                (click)="filterByCategory(category._id)">
          {{category.name}}
        </button>
      </div>

      <div class="grid grid-4">
        <div *ngFor="let product of products" class="card" [routerLink]="['/products', product._id]">
          <div class="card-image-wrapper">
            <img *ngIf="product.images && product.images.length > 0" [src]="getProductImage(product._id)" [alt]="product.name" class="card-image">
            <div *ngIf="!product.images || product.images.length === 0" class="product-placeholder"></div>
            <span *ngIf="product.isRental" class="badge badge-rental product-badge">Rental</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{product.name}}</h3>
            <p class="card-price">
              {{product.isRental ? 'Rental: ₹' + product.rentalPrice + '/day' : '₹' + product.price}}
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="products.length === 0" class="text-center mt-4">
        <p>No products found in this category.</p>
      </div>
    </div>
  `,
    styles: [`
    .filters {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      -webkit-overflow-scrolling: touch;
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

    .product-placeholder {
      width: 100%;
      height: 100%;
      background: var(--color-bg-card);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    selectedCategory: string | null = null;
    isRental = false;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.selectedCategory = params['category'] || null;
            this.loadProducts();
        });

        this.route.url.subscribe(url => {
            this.isRental = url[0]?.path === 'rentals';
            this.loadProducts();
        });

        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe(data => {
            this.categories = data;
        });
    }

    loadProducts() {
        const filters: any = {};
        if (this.selectedCategory) filters.category = this.selectedCategory;
        if (this.isRental) filters.isRental = true;

        this.productService.getProducts(filters).subscribe(data => {
            this.products = data;
        });
    }

    filterByCategory(categoryId: string | null) {
        this.selectedCategory = categoryId;
        this.loadProducts();
    }

    getProductImage(id: string): string {
        return this.productService.getProductImage(id, 0);
    }
}
