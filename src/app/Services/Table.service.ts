import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Table {
    id: number;
    name: string;
    idLoaiBan: number;
    idKhuVuc: number;
    nameKhuVuc?: string;  // Tên khu vực (nếu cần)
    nameLoaiPhong?: string; // Tên loại bàn (nếu cần)
    status : number;
    orderID : number;
}

@Injectable({
    providedIn: 'root'
})
export class TableService {
    private apiUrl = 'https://quanlinhahang1-3.onrender.com/api/Table';

    constructor(private http: HttpClient) { }

    // Lấy danh sách bàn
    getTables(): Observable<Table[]> {
        return this.http.get<Table[]>(this.apiUrl);
    }

    // Thêm bàn mới
    addTable(table: { name: string; idLoaiBan: number; idKhuVuc: number }): Observable<Table> {
        return this.http.post<Table>(this.apiUrl, table);
    }

    // Cập nhật bàn
    updateTable(id: number, table: { name: string; idLoaiBan: number; idKhuVuc: number }): Observable<Table> {
        return this.http.put<Table>(`${this.apiUrl}/${id}`, table);
    }

    // Xóa bàn
    deleteTable(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
