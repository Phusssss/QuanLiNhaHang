import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  idTypeProduct: number;
  nameTypeProduct?: string;
}

interface TypeProduct {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdcutService {
  private apiUrl = 'https://localhost:7157/api/Product';
  private typeProductUrl = 'https://localhost:7157/api/TypeProduct';

  constructor(private http: HttpClient) { }

  // Lấy danh sách sản phẩm
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Thêm sản phẩm
  addProduct(product: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('idTypeProduct', product.idTypeProduct.toString());
    formData.append('image', file); // Thêm ảnh vào FormData
  
    return this.http.post(this.apiUrl, formData);
  }
  

  // Cập nhật sản phẩm
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Xóa sản phẩm
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Lấy danh sách loại sản phẩm
  getTypeProducts(): Observable<TypeProduct[]> {
    return this.http.get<TypeProduct[]>(this.typeProductUrl);
  }
}
