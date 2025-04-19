import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VietQRService } from '../Services/VietQR.service'; // Import service

export interface BillItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;

}

export interface Bill {
  orderId: number;
  idTable: number;
  nameTable:string;
  userName: string;
  timeCreate: string;
  timePay: string;
  items: BillItem[];
  totalAmount: number;
}

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  bill!: Bill;
  qrUrl: string = '';

  constructor(private router: Router, private vietQRService: VietQRService) {
    const navigation = this.router.getCurrentNavigation();
    this.bill = navigation?.extras.state?.['billData'];

    if (!this.bill) {
      alert('Không tìm thấy dữ liệu hóa đơn!');
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.generateQR(); // Gọi API để lấy QR Code khi component được load
  }

  generateQR(): void {
    if (!this.bill) return;

    this.vietQRService.generateQRCode("0395752407", this.bill.totalAmount, `Thanh toán đơn hàng ${this.bill.orderId}`)
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.qrUrl = response.data.qrDataURL; // Gán URL ảnh QR vào biến qrUrl
          } else {
            console.error('Lỗi: Không có dữ liệu QR');
          }
        },
        error: (err) => {
          console.error('Lỗi khi gọi API VietQR:', err);
        }
      });
  }

  print(): void {
    window.print();
  }

  back(): void {
    this.router.navigate(['/home']);
  }
}
