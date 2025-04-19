import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoaiBan {
  id: number;
  name: string;
  maxPeople: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoaiBanService {
  private apiUrl = 'https://quanlinhahang1-3.onrender.com/api/LoaiBan';

  constructor(private http: HttpClient) { }

  // Lấy danh sách loại bàn
  getLoaibans(): Observable<LoaiBan[]> {
    return this.http.get<LoaiBan[]>(this.apiUrl);
  }

  // Thêm loại bàn mới
  addLoaiBan(loaiBan: LoaiBan): Observable<LoaiBan> {
    return this.http.post<LoaiBan>(this.apiUrl, loaiBan);
  }

  // Sửa thông tin loại bàn
  updateLoaiBan(loaiBan: LoaiBan): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${loaiBan.id}`, loaiBan);
  }

  // Xóa loại bàn
  deleteLoaiBan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}