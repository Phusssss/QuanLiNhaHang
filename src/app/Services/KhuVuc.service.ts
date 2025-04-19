import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface KhuVuc {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class KhuVucService {
  private apiUrl = 'https://quanlinhahang1-3.onrender.com/api/KhuVuc';

  constructor(private http: HttpClient) { }

  // Lấy danh sách khu vực
  getKhuVucs(): Observable<KhuVuc[]> {
    return this.http.get<KhuVuc[]>(this.apiUrl);
  }

  // Thêm khu vực mới
  addKhuVuc(khuVuc: KhuVuc): Observable<KhuVuc> {
    return this.http.post<KhuVuc>(this.apiUrl, khuVuc);
  }

  // Sửa thông tin khu vực
  updateKhuVuc(khuVuc: KhuVuc): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${khuVuc.id}`, khuVuc);
  }

  // Xóa khu vực
  deleteKhuVuc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}