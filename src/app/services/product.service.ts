import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: any;
    isRental: boolean;
    rentalPrice?: number;
    stock: number;
    featured: boolean;
    images: any[];
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/api/products';

    constructor(@Inject(HttpClient) private http: HttpClient) { }

    getProducts(filters?: any): Observable<Product[]> {
        let params = new HttpParams();
        if (filters) {
            if (filters.category) params = params.set('category', filters.category);
            if (filters.isRental !== undefined) params = params.set('isRental', filters.isRental);
            if (filters.featured !== undefined) params = params.set('featured', filters.featured);
        }
        return this.http.get<Product[]>(this.apiUrl, { params });
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(formData: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, formData);
    }

    updateProduct(id: string, formData: FormData): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getProductImage(id: string, index: number = 0): string {
        return `${this.apiUrl}/${id}/image/${index}`;
    }
}
