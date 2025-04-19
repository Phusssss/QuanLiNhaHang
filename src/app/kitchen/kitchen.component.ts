import { Component, OnInit } from '@angular/core';
import { OrderService } from '../Services/order.service';

interface OrderDetail {
  orderId: number;
  tableName: string;
  timeCreate: string;
  status: number;
  areaId: number;
  areaName: string;
  items: { 
    productId: number; 
    productName: string; 
    quantity: number; 
    price: number; 
    itemStatus: number;
    id?: number;
  }[];
}

interface Area {
  id: number;
  name: string;
}

@Component({
  selector: 'app-kitchen',
  template: `
    <div class="page-container">
      <div class="content-container">
        <div class="container">
          <h2>Khu bếp</h2>
          <div class="inner-container">
            <div class="left">
              <div *ngFor="let order of filteredOrders" class="order-card">
                <h3>Đơn hàng #{{ order.orderId }} - Bàn {{ order.tableName }} ({{ order.areaName }})</h3>
                <p>Thời gian tạo: {{ order.timeCreate | date:'dd/MM/yyyy HH:mm' }}</p>
                <p>Trạng thái đơn: 
                  <span [ngClass]="{
                    'status-pending': order.status === 0,
                    'status-paid': order.status === 1
                  }">
                    {{ order.status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán' }}
                  </span>
                </p>
                <div class="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Món ăn</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tổng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of order.items">
                        <td>{{ item.productName }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.price | currency:'VND' }}</td>
                        <td>{{ (item.price * item.quantity) | currency:'VND' }}</td>
                        <td>
                          <span [ngClass]="{
                            'item-pending': item.itemStatus === 0,
                            'item-processing': item.itemStatus === 1,
                            'item-completed': item.itemStatus === 2
                          }">
                            {{ item.itemStatus === 0 ? 'Chưa chế biến' : item.itemStatus === 1 ? 'Đang chế biến' : 'Đã hoàn thành' }}
                          </span>
                        </td>
                        <td>
                          <button 
                            *ngIf="item.itemStatus !== 2" 
                            (click)="updateItemStatus(order.orderId, item.id, item.itemStatus + 1)"
                            [disabled]="item.itemStatus === 2">
                            {{ item.itemStatus === 0 ? 'Bắt đầu chế biến' : 'Hoàn thành' }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div class="right">
              <h3>Lọc đơn hàng</h3>
              <form>
                <label for="areaFilter">Khu vực:</label>
                <select 
                  id="areaFilter" 
                  [(ngModel)]="selectedAreaId" 
                  (change)="filterOrders()"
                  name="areaFilter">
                  <option [ngValue]="null">Tất cả khu vực</option>
                  <option *ngFor="let area of areas" [ngValue]="area.id">
                    {{ area.name }}
                  </option>
                </select>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Page container */
    .page-container {
      min-height: 100vh;
      width: 100%;
      justify-content: center;
      background-color: #f5f5f5;
    }

    /* Content container */
    .content-container {
      width: 100%;
      max-width: 1400px;
      min-width: 320px;
      padding: 20px;
      box-sizing: border-box;
    }

    /* Main container */
    .container {
      width: 100%;
    }

    h2 {
      text-align: center;
      color: #d32f2f;
      margin-bottom: 20px;
      font-size: 2rem;
    }

    /* Inner flex container */
    .inner-container {
      gap: 20px;
    }

    /* Left section */
    .left {
      flex: 1;
      overflow-y: auto;
      max-height: calc(100vh - 100px); /* Prevents overflow beyond viewport */
    }

    .order-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      padding: 15px;
      margin-bottom: 20px;
    }

    .order-card h3 {
      text-align: center;
      color: #d32f2f;
      margin-bottom: 10px;
      font-size: 1.3rem;
    }

    .order-card p {
      color: #666;
      margin: 5px 0;
      font-size: 0.95rem;
    }

    /* Table wrapper */
    .table-wrapper {
      overflow-x: auto;
      margin-top: 10px;
    }

    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #d32f2f;
      color: white;
    }

    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tbody tr:hover {
      background-color: #f1f1f1;
    }

    /* Status styles */
    .status-pending {
      color: #ff9800;
      font-weight: bold;
    }

    .status-paid {
      color: #4caf50;
      font-weight: bold;
    }

    .item-pending {
      color: #ff9800;
    }

    .item-processing {
      color: #2196f3;
    }

    .item-completed {
      color: #4caf50;
    }

    /* Right section */
    .right {
      flex: 1;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
    }

    .right h3 {
      text-align: center;
      color: #d32f2f;
      margin-bottom: 15px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    label {
      font-weight: bold;
      color: #333;
    }

    select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 10px;
      background: #d32f2f;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      width: 100%;
    }

    button:hover:not(:disabled) {
      background: #b71c1c;
    }

    button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    /* Responsive design */
    @media screen and (max-width: 768px) {
      .inner-container {
        flex-direction: column;
      }

      .left, .right {
        flex: none;
        width: 100%;
      }

      .left {
        max-height: none; /* Remove height restriction on mobile */
      }
    }

    @media screen and (max-width: 480px) {
      .content-container {
        padding: 10px;
      }

      h2 {
        font-size: 1.5rem;
      }

      .order-card h3 {
        font-size: 1.2rem;
      }

      th, td {
        padding: 6px;
        font-size: 0.9rem;
      }

      .right {
        padding: 15px;
      }
    }
  `]
})
export class KitchenComponent implements OnInit {
  orders: OrderDetail[] = [];
  filteredOrders: OrderDetail[] = [];
  areas: Area[] = [];
  selectedAreaId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.load();
    this.orderService.getOrderNotifications().subscribe((orderDetails: OrderDetail) => {
      console.log('Nhận thông báo mới:', orderDetails);
      this.load();
    });
  }

  load() {
    this.orderService.getActiveOrders().subscribe(
      (activeOrders: OrderDetail[]) => {
        this.orders = activeOrders;
        this.updateAreas();
        this.filterOrders();
      },
      (error) => {
        console.error('Lỗi khi tải danh sách đơn hàng:', error);
      }
    );
  }

  updateAreas() {
    const areaMap = new Map<number, string>();
    this.orders.forEach(order => {
      if (!areaMap.has(order.areaId)) {
        areaMap.set(order.areaId, order.areaName);
      }
    });
    
    this.areas = Array.from(areaMap.entries()).map(([id, name]) => ({
      id,
      name
    }));
  }

  filterOrders() {
    if (this.selectedAreaId === null) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        order => order.areaId === this.selectedAreaId
      );
    }
  }

  updateItemStatus(orderId: number, orderDetailId: number | undefined, newStatus: number) {
    if (!orderDetailId) {
      console.error('OrderDetailId không tồn tại cho orderId:', orderId);
      return;
    }
    this.orderService.updateItemStatus(orderDetailId, newStatus).subscribe(
      () => {
        console.log('Cập nhật trạng thái món ăn thành công');
        this.load();
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    );
  }
}