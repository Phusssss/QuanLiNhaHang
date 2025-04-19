import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdcutService } from '../Services/Product.service';
import { OrderService } from '../Services/order.service';

interface Product {
  id: number;
  name: string;
  price: number;
  idTypeProduct: number;
  nameTypeProduct?: string;
  
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  tableId!: number;
  tableName!: string;
  userId = 1002; // Giả sử userId là 1 (bạn có thể lấy từ session hoặc localStorage)
  products: any[] = [];
  cart: CartItem[] = [];
  filteredProducts: any[] = []; // Danh sách sản phẩm đã lọc
  searchTerm: string = ''; // Biến lưu từ khóa tìm kiếm
  productTypes: string[] = []; // Danh sách loại sản phẩm
  selectedType: string = 'Tất cả'; // Loại sản phẩm được chọn
  productQuantities: { [productId: number]: number } = {}; // Lưu số lượng sản phẩm nhập vào

  constructor(
    private route: ActivatedRoute,
    private productService: ProdcutService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.tableId = Number(this.route.snapshot.paramMap.get('id'));
    this.route.queryParams.subscribe(params => {
      this.tableName = params['name'];
    });
    this.loadProducts();
  }
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/default-product.png'; // Ảnh mặc định nếu không có ảnh
    }
    return imagePath.startsWith('http') ? imagePath : `https://localhost:7157${imagePath}`;
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data; // Ban đầu hiển thị tất cả sản phẩm
        this.productTypes = ['Tất cả', ...new Set(data.map(p => p.nameTypeProduct || '').filter(Boolean))];

      },
      (error) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    );
  }
  selectType(type: string): void {
    this.selectedType = type;
    this.filterProducts();
  }
  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedType === 'Tất cả' || product.nameTypeProduct === this.selectedType)
    );
  }
  
  addToCart(product: Product): void {
    const quantity = this.productQuantities[product.id] || 1; // Mặc định là 1 nếu chưa nhập
    const existingItem = this.cart.find(item => item.productId === product.id);
  
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ productId: product.id, name: product.name, price: product.price, quantity });
    }
  
    this.productQuantities[product.id] = 1; // Reset số lượng sau khi thêm
  }
  
  validateQuantity(productId: number): void {
    if (this.productQuantities[productId] < 1) {
      this.productQuantities[productId] = 1;
    }
  }
  

  placeOrder(): void {
    if (this.cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
  
    this.orderService.createOrder({ userId: this.userId, tableId: this.tableId }).subscribe(
      response => {
        const orderId = response.orderId;
        console.log('Đã tạo đơn hàng, orderId:', orderId);
  
        this.cart.forEach(item => {
          this.orderService.addItemToOrder({
            orderId: orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }).subscribe(
            () => console.log(`Đã thêm ${item.name} vào đơn hàng`),
            error => console.error(`Lỗi khi thêm ${item.name}:`, error)
          );
        });
  
        alert('Đơn hàng đã được đặt thành công!');
        this.cart = []; // Xóa giỏ hàng sau khi đặt
      },
      error => {
        console.error('Lỗi khi tạo đơn hàng:', error);
      }
    );
  }
  
}
