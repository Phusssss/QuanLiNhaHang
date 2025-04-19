import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

// Interface cho các request API
interface Order {
  userId: number;
  tableId: number;
}

interface OrderItem {
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

interface PayOrderRequest {
  orderId: number;
}
interface OrderResponse {
  orderId: number;
  userId: number;
  userName: string;
  timeCreate: string;
  timePay: string | null;
  status: number;
  tableId: number;
  tableName: string;
  areaId: number;
  areaName: string;
  items: {
    orderDetailId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    totalItemPrice: number;
    itemStatus: number;
  }[];
  totalAmount: number;
}

interface GetAllOrdersResponse {
  message: string;
  data: OrderResponse[];
  totalCount: number;
}
interface PayOrderResponse {
  orderId: number;
  userName: string;
  timeCreate: string;
  timePay: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  totalAmount: number;
}
// Add this interface to match the backend response
interface InvoiceResponse {
  invoices: {
    orderId: number;
    userName: string;
    timeCreate: string;
    timePay: string | null;
    tableName: string;
    items: {
      productId: number;
      productName: string;
      quantity: number;
      price: number;
      totalPrice: number;
    }[];
    totalAmount: number;
  }[];
  totalRevenue: number;
}

// Add this method to OrderService

// Interface cho thông báo SignalR và dữ liệu đơn hàng
interface OrderNotification {
  orderId: number;
  tableName: string;
  timeCreate: string;
  status: number;
  areaId: number;        // Added
  areaName: string;      // Added
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    itemStatus: number;
    id?: number;
  }[];
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7157/api/orders';
  private hubConnection: signalR.HubConnection | undefined;
  private orderNotificationSubject = new Subject<OrderNotification>();

  constructor(private http: HttpClient) {
    this.startConnection();
  }
  
  getInvoices(): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}/invoices`);
  }
  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7157/orderHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('✅ SignalR kết nối thành công'))
      .catch(err => console.error('❌ Lỗi kết nối SignalR:', err));

    this.hubConnection.on('ReceiveOrderNotification', (message: OrderNotification) => {
      console.log('📢 Nhận thông báo từ SignalR:', message);
      this.orderNotificationSubject.next(message);
    });
  }
  updateItemStatus(orderDetailId: number, status: number): Observable<any> {
    const request = {
      orderDetailId: orderDetailId,
      status: status
    };
    return this.http.put(`${this.apiUrl}/update-item-status`, request);

  }
  getAllOrders(): Observable<GetAllOrdersResponse> {
    return this.http.get<GetAllOrdersResponse>(`${this.apiUrl}/all`);
  }
  getOrderNotifications(): Observable<OrderNotification> {
    return this.orderNotificationSubject.asObservable();
  }

  createOrder(order: Order): Observable<{ orderId: number }> {
    return this.http.post<{ orderId: number }>(`${this.apiUrl}/create`, order);
  }

  addItemToOrder(orderItem: OrderItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-item`, orderItem);
  }

  payOrder(request: PayOrderRequest): Observable<PayOrderResponse> {
    return this.http.put<PayOrderResponse>(`${this.apiUrl}/pay`, request);
  }

  getActiveOrders(): Observable<OrderNotification[]> {
    return this.http.get<OrderNotification[]>(`${this.apiUrl}/active-orders`);
  }
}