import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableService, Table } from '../Services/Table.service';
import { OrderService } from '../Services/order.service';
import { KhuVucService } from '../Services/KhuVuc.service';
import { LoaiBanService } from '../Services/LoaiBan.service';

interface KhuVuc {
  id: number;
  name: string;
  description: string;
}

interface LoaiBan {
  id: number;
  name: string;
  maxPeople: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tables: Table[] = [];
  filteredTables: Table[] = [];
  khuVucs: KhuVuc[] = [];
  loaiBans: LoaiBan[] = [];
  
  selectedKhuVuc: number | null = null;
  selectedLoaiBan: number | null = null;
  selectedStatus: number | null = null;

  constructor(
    private tableService: TableService,
    private orderService: OrderService,
    private khuVucService: KhuVucService,
    private loaiBanService: LoaiBanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTables();
    this.loadKhuVucs();
    this.loadLoaiBans();
  }

  loadTables(): void {
    this.tableService.getTables().subscribe(
      (data) => {
        console.log('Danh sách bàn:', data); // Kiểm tra dữ liệu
        this.tables = data;
        this.applyFilters();
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách bàn:', error);
      }
    );
  }

  loadKhuVucs(): void {
    this.khuVucService.getKhuVucs().subscribe({
      next: (data) => (this.khuVucs = data),
      error: (err) => console.error('Lỗi khi tải khu vực:', err)
    });
  }

  loadLoaiBans(): void {
    this.loaiBanService.getLoaibans().subscribe({
      next: (data) => (this.loaiBans = data),
      error: (err) => console.error('Lỗi khi tải loại bàn:', err)
    });
  }

  applyFilters(): void {
    this.filteredTables = this.tables.filter((table) => {
      const matchKhuVuc = this.selectedKhuVuc === null || 
        this.khuVucs.find(k => k.id === this.selectedKhuVuc)?.name === table.nameKhuVuc;
      const matchLoaiBan = this.selectedLoaiBan === null || 
        this.loaiBans.find(lb => lb.id === this.selectedLoaiBan)?.name === table.nameLoaiPhong;
      const matchStatus = this.selectedStatus === null || table.status === this.selectedStatus;
      return matchKhuVuc && matchLoaiBan && matchStatus;
    });
  }

  onKhuVucChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedKhuVuc = value === '' ? null : Number(value);
    this.applyFilters();
  }

  onLoaiBanChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLoaiBan = value === '' ? null : Number(value);
    this.applyFilters();
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStatus = value === '' ? null : Number(value);
    this.applyFilters();
  }

  goToOrder(table: Table): void {
    this.router.navigate(['/order', table.id], { queryParams: { name: table.name } });
  }

  goToAddItem(table: Table): void {
    this.router.navigate(['/add-item-to-order', table.orderID], {
      queryParams: { idBan: table.id, nameBan: table.name }
    });
  }

  payOrder(table: Table): void {
    if (!table.orderID) {
      alert('Lỗi: Không tìm thấy orderID của bàn này.');
      return;
    }

    this.orderService.payOrder({ orderId: table.orderID }).subscribe(
      (bill) => {
        this.router.navigate(['/bill'], { state: { billData: bill } });
      },
      (error) => {
        console.error('Lỗi khi thanh toán:', error);
        alert('Thanh toán thất bại!');
      }
    );
  }
}