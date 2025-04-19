import { Component, OnInit } from '@angular/core';
import { KhuVucService } from '../Services/KhuVuc.service';

interface KhuVuc {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-khuvuc-list',
  templateUrl: './khu-vuc-manager.component.html',
  styleUrls: ['./khu-vuc-manager.component.css']
})
export class KhuVucManagerComponent implements OnInit {
  khuVucs: KhuVuc[] = [];
  khuVucData: KhuVuc = { id: 0, name: '', description: '' }; // Dữ liệu cho form
  isEditing: boolean = false; // Trạng thái chỉnh sửa

  constructor(private khuVucService: KhuVucService) {}

  ngOnInit(): void {
    this.loadKhuVucs();
  }

  // Load danh sách khu vực
  loadKhuVucs(): void {
    this.khuVucService.getKhuVucs().subscribe({
      next: (data) => (this.khuVucs = data),
      error: (err) => console.error('Lỗi khi tải danh sách:', err)
    });
  }

  // Thêm hoặc cập nhật khu vực
  saveKhuVuc(): void {
    if (this.khuVucData.name && this.khuVucData.description) {
      if (this.isEditing) {
        this.khuVucService.updateKhuVuc(this.khuVucData).subscribe({
          next: () => {
            const index = this.khuVucs.findIndex(k => k.id === this.khuVucData.id);
            this.khuVucs[index] = { ...this.khuVucData };
            this.resetForm();
          },
          error: (err) => console.error('Lỗi khi cập nhật:', err)
        });
      } else {
        this.khuVucService.addKhuVuc(this.khuVucData).subscribe({
          next: (result) => {
            this.khuVucs.push(result);
            this.resetForm();
          },
          error: (err) => console.error('Lỗi khi thêm:', err)
        });
      }
    }
  }

  // Chỉnh sửa khu vực
  editKhuVuc(khuVuc: KhuVuc): void {
    this.khuVucData = { ...khuVuc };
    this.isEditing = true;
  }

  // Xóa khu vực
  deleteKhuVuc(id: number): void {
    if (confirm('Bạn có chắc muốn xóa khu vực này?')) {
      this.khuVucService.deleteKhuVuc(id).subscribe({
        next: () => {
          this.khuVucs = this.khuVucs.filter(k => k.id !== id);
          this.resetForm();
        },
        error: (err) => console.error('Lỗi khi xóa:', err)
      });
    }
  }

  // Reset form
  resetForm(): void {
    this.khuVucData = { id: 0, name: '', description: '' };
    this.isEditing = false;
  }
}