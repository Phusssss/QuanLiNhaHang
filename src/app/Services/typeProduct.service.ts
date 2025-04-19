import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TypeProduct {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TypeProductService {
  private apiUrl = 'https://localhost:7157/api/TypeProduct';

  constructor(private http: HttpClient) { }

  getTypeProducts(): Observable<TypeProduct[]> {
    return this.http.get<TypeProduct[]>(this.apiUrl);
  }
}
