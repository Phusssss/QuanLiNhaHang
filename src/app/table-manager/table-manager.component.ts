import { Component, OnInit } from '@angular/core';
import { TableService, Table } from '../Services/Table.service';
import { KhuVucService } from '../Services/KhuVuc.service';
import { LoaiBanService } from '../Services/LoaiBan.service';

@Component({
  selector: 'app-table-manager',
  templateUrl: './table-manager.component.html',
  styleUrls: ['./table-manager.component.css']
})
export class TableManagerComponent implements OnInit {
  tables: Table[] = [];
  khuVucs: { id: number; name: string }[] = [];
  loaiBans: { id: number; name: string }[] = [];
  
  tableData = {
    id: 0,
    name: '',
    idLoaiBan: 0,
    idKhuVuc: 0
  };

  isEditing = false;

  constructor(
    private tableService: TableService,
    private khuVucService: KhuVucService,
    private loaiBanService: LoaiBanService
  ) {}

  ngOnInit(): void {
    this.loadTables();
    this.loadKhuVucs();
    this.loadLoaiBans();
  }

  loadTables(): void {
    this.tableService.getTables().subscribe({
      next: (data) => { this.tables = data; },
      error: (err) => console.error('Lỗi khi tải danh sách bàn:', err)
    });
  }

  loadKhuVucs(): void {
    this.khuVucService.getKhuVucs().subscribe({
      next: (data) => { this.khuVucs = data; },
      error: (err) => console.error('Lỗi khi tải danh sách khu vực:', err)
    });
  }

  loadLoaiBans(): void {
    this.loaiBanService.getLoaibans().subscribe({
      next: (data) => { this.loaiBans = data; },
      error: (err) => console.error('Lỗi khi tải danh sách loại bàn:', err)
    });
  }

  saveTable(): void {
    if (this.isEditing) {
      this.tableService.updateTable(this.tableData.id, this.tableData).subscribe({
        next: () => {
          this.loadTables();
          this.resetForm();
        },
        error: (err) => console.error('Lỗi khi cập nhật bàn:', err)
      });
    } else {
      this.tableService.addTable(this.tableData).subscribe({
        next: (data) => {
          this.tables.push(data);
          this.resetForm();
        },
        error: (err) => console.error('Lỗi khi thêm bàn:', err)
      });
    }
  }

  editTable(table: Table): void {
    this.tableData = {
      id: table.id,
      name: table.name,
      idLoaiBan: table.idLoaiBan, // Đảm bảo truyền đúng giá trị
      idKhuVuc: table.idKhuVuc    // Đảm bảo truyền đúng giá trị
    };
    this.isEditing = true;
  }
  deleteTable(id: number) {
    if (confirm('Bạn có chắc muốn xóa bàn này không?')) {
      this.tableService.deleteTable(id).subscribe(() => {
        alert('Xóa bàn thành công');
        this.loadTables();  // Tải lại danh sách bàn sau khi xóa
      });
    }
  }

  resetForm(): void {
    this.tableData = { id: 0, name: '', idLoaiBan: 0, idKhuVuc: 0 };
    this.isEditing = false;
  }
}
