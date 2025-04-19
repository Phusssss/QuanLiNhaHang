import { Component, OnInit } from '@angular/core';
import { LoaiBanService } from '../Services/LoaiBan.service';

interface LoaiBan {
  id: number;
  name: string;
  maxPeople: number;
}

@Component({
  selector: 'app-loai-ban-manager',
  templateUrl: './loai-ban-manager.component.html',
  styleUrls: ['./loai-ban-manager.component.css']
})
export class LoaiBanManagerComponent implements OnInit {
  loaiBans: LoaiBan[] = []; // Sửa tên biến cho đúng với loại bàn
  loaiBanData: LoaiBan = { id: 0, name: '', maxPeople: 0 }; // Dữ liệu cho form
  isEditing: boolean = false; // Trạng thái chỉnh sửa

  constructor(private loaiBanService: LoaiBanService) {}

  ngOnInit(): void {
    this.loadLoaiBans();
  }

  // Load danh sách loại bàn
  loadLoaiBans(): void {
    this.loaiBanService.getLoaibans().subscribe({
      next: (data) => (this.loaiBans = data),
      error: (err) => console.error('Lỗi khi tải danh sách:', err)
    });
  }

  // Thêm hoặc cập nhật loại bàn
  saveLoaiBan(): void {
    if (this.loaiBanData.name && this.loaiBanData.maxPeople > 0) {
      if (this.isEditing) {
        this.loaiBanService.updateLoaiBan(this.loaiBanData).subscribe({
          next: () => {
            const index = this.loaiBans.findIndex(lb => lb.id === this.loaiBanData.id);
            this.loaiBans[index] = { ...this.loaiBanData };
            this.resetForm();
          },
          error: (err) => console.error('Lỗi khi cập nhật:', err)
        });
      } else {
        this.loaiBanService.addLoaiBan(this.loaiBanData).subscribe({
          next: (result) => {
            this.loaiBans.push(result);
            this.resetForm();
          },
          error: (err) => console.error('Lỗi khi thêm:', err)
        });
      }
    }
  }

  // Chỉnh sửa loại bàn
  editLoaiBan(loaiBan: LoaiBan): void {
    this.loaiBanData = { ...loaiBan };
    this.isEditing = true;
  }

  // Xóa loại bàn
  deleteLoaiBan(id: number): void {
    if (confirm('Bạn có chắc muốn xóa loại bàn này?')) {
      this.loaiBanService.deleteLoaiBan(id).subscribe({
        next: () => {
          this.loaiBans = this.loaiBans.filter(lb => lb.id !== id);
          this.resetForm();
        },
        error: (err) => console.error('Lỗi khi xóa:', err)
      });
    }
  }

  // Reset form
  resetForm(): void {
    this.loaiBanData = { id: 0, name: '', maxPeople: 0 };
    this.isEditing = false;
  }
}