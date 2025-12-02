import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  standalone: false,
    selector: 'app-product-detail',
    template: `
    <div class="container section" *ngIf="product">
      <div class="grid grid-2">
        <div class="product-gallery">
          <div class="main-image-wrapper">
            <img [src]="getProductImage(product._id, selectedImageIndex)" [alt]="product.name" class="main-image">
          </div>
          <div class="thumbnails" *ngIf="product.images && product.images.length > 1">
            <div *ngFor="let image of product.images; let i = index" 
                 class="thumbnail" 
                 [class.active]="selectedImageIndex === i"
                 (click)="selectedImageIndex = i">
              <img [src]="getProductImage(product._id, i)" [alt]="product.name">
            </div>
          </div>
        </div>

        <div class="product-info">
          <span *ngIf="product.isRental" class="badge badge-rental mb-2">Rental</span>
          <h1 class="mb-2">{{product.name}}</h1>
          <p class="price mb-3">
            {{product.isRental ? 'Rental: ₹' + product.rentalPrice + '/day' : '₹' + product.price}}
          </p>
          
          <div class="description mb-4">
            <h3>Description</h3>
            <p>{{product.description}}</p>
          </div>

          <div class="actions">
            <button class="btn btn-primary w-100">
              {{product.isRental ? 'Book for Rent' : 'Add to Cart'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .main-image-wrapper {
      width: 100%;
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnails {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .thumbnail.active {
      border-color: var(--color-primary);
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .price {
      font-size: 2rem;
      color: var(--color-primary);
      font-weight: 600;
    }

    .description {
      color: var(--color-text-secondary);
      line-height: 1.8;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    selectedImageIndex = 0;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.productService.getProduct(id).subscribe(data => {
                this.product = data;
            });
        }
    }

    getProductImage(id: string, index: number): string {
        return this.productService.getProductImage(id, index);
    }
}
