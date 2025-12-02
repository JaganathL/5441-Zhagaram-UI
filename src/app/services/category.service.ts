import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
    _id: string;
    name: string;
    description: string;
    image?: {
        contentType: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://localhost:3000/api/categories';

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }

    getCategory(id: string): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }

    createCategory(formData: FormData): Observable<Category> {
        return this.http.post<Category>(this.apiUrl, formData);
    }

    updateCategory(id: string, formData: FormData): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/${id}`, formData);
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getCategoryImage(id: string): string {
        return `${this.apiUrl}/${id}/image`;
    }
}
