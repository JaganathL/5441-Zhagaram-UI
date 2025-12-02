import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  standalone: false,
  selector: 'app-admin-dashboard',
  template: `
    <div class="container section">
      <h1 class="mb-4">Admin Dashboard</h1>

      <div class="tabs mb-4">
        <button class="btn" [class.btn-primary]="activeTab === 'products'" [class.btn-ghost]="activeTab !== 'products'" (click)="activeTab = 'products'">Products</button>
        <button class="btn" [class.btn-primary]="activeTab === 'categories'" [class.btn-ghost]="activeTab !== 'categories'" (click)="activeTab = 'categories'">Categories</button>
      </div>

      <!-- Products Tab -->
      <div *ngIf="activeTab === 'products'">
        <div class="card mb-4 p-4">
          <h3>{{editingProduct ? 'Edit Product' : 'Add New Product'}}</h3>
          <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Name</label>
                <input type="text" formControlName="name" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select formControlName="category" class="form-select">
                  <option *ngFor="let cat of categories" [value]="cat._id">{{cat.name}}</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Price</label>
                <input type="number" formControlName="price" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Stock</label>
                <input type="number" formControlName="stock" class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea formControlName="description" class="form-textarea"></textarea>
            </div>

            <div class="grid grid-2">
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="isRental"> Is Rental Item
                </label>
              </div>
              <div class="form-group" *ngIf="productForm.get('isRental')?.value">
                <label class="form-label">Rental Price (per day)</label>
                <input type="number" formControlName="rentalPrice" class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="featured"> Featured Product
              </label>
            </div>

            <div class="form-group">
              <label class="form-label">Images</label>
              <input type="file" multiple (change)="onProductFileChange($event)" class="form-input">
            </div>

            <div class="actions">
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                {{editingProduct ? 'Update' : 'Create'}} Product
              </button>
              <button type="button" class="btn btn-ghost" *ngIf="editingProduct" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>

        <div class="grid grid-4">
          <div *ngFor="let product of products" class="card">
            <div class="card-content">
              <h4>{{product.name}}</h4>
              <p>₹{{product.price}}</p>
              <div class="actions mt-2">
                <button class="btn btn-sm btn-secondary" (click)="editProduct(product)">Edit</button>
                <button class="btn btn-sm btn-ghost" (click)="deleteProduct(product._id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Tab -->
      <div *ngIf="activeTab === 'categories'">
        <div class="card mb-4 p-4">
          <h3>{{editingCategory ? 'Edit Category' : 'Add New Category'}}</h3>
          <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" formControlName="name" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea formControlName="description" class="form-textarea"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Image</label>
              <input type="file" (change)="onCategoryFileChange($event)" class="form-input">
            </div>

            <div class="actions">
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                {{editingCategory ? 'Update' : 'Create'}} Category
              </button>
              <button type="button" class="btn btn-ghost" *ngIf="editingCategory" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>

        <div class="grid grid-4">
          <div *ngFor="let category of categories" class="card">
            <div class="card-content">
              <h4>{{category.name}}</h4>
              <div class="actions mt-2">
                <button class="btn btn-sm btn-secondary" (click)="editCategory(category)">Edit</button>
                <button class="btn btn-sm btn-ghost" (click)="deleteCategory(category._id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs {
      display: flex;
      gap: 1rem;
    }

    .p-4 {
      padding: 1.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      min-height: 32px;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'products';
  products: Product[] = [];
  categories: Category[] = [];

  productForm: FormGroup;
  categoryForm: FormGroup;

  editingProduct: Product | null = null;
  editingCategory: Category | null = null;

  productImages: FileList | null = null;
  categoryImage: File | null = null;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      category: ['', Validators.required],
      isRental: [false],
      rentalPrice: [0],
      stock: [1],
      featured: [false]
    });

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  onProductFileChange(event: any) {
    this.productImages = event.target.files;
  }

  onCategoryFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.categoryImage = event.target.files[0];
    }
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    this.loading = true;
    const formData = new FormData();
    Object.keys(this.productForm.value).forEach(key => {
      formData.append(key, this.productForm.value[key]);
    });

    if (this.productImages) {
      for (let i = 0; i < this.productImages.length; i++) {
        formData.append('images', this.productImages[i]);
      }
    }

    if (this.editingProduct) {
      formData.append('keepExistingImages', 'true');
      this.productService.updateProduct(this.editingProduct._id, formData).subscribe(() => {
        this.loadProducts();
        this.cancelEdit();
        this.loading = false;
      });
    } else {
      this.productService.createProduct(formData).subscribe(() => {
        this.loadProducts();
        this.productForm.reset();
        this.productImages = null;
        this.loading = false;
      });
    }
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;

    this.loading = true;
    const formData = new FormData();
    Object.keys(this.categoryForm.value).forEach(key => {
      formData.append(key, this.categoryForm.value[key]);
    });

    if (this.categoryImage) {
      formData.append('image', this.categoryImage);
    }

    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory._id, formData).subscribe(() => {
        this.loadCategories();
        this.cancelEdit();
        this.loading = false;
      });
    } else {
      this.categoryService.createCategory(formData).subscribe(() => {
        this.loadCategories();
        this.categoryForm.reset();
        this.categoryImage = null;
        this.loading = false;
      });
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      isRental: product.isRental,
      rentalPrice: product.rentalPrice,
      stock: product.stock,
      featured: product.featured
    });
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }

  cancelEdit() {
    this.editingProduct = null;
    this.editingCategory = null;
    this.productForm.reset();
    this.categoryForm.reset();
  }
}
