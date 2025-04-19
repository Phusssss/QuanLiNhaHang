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
  imageUrl?: string;
}

@Component({
  selector: 'app-add-item-to-order',
  templateUrl: './add-item-to-order.component.html',
  styleUrls: ['./add-item-to-order.component.css']
})
export class AddItemToOrderComponent implements OnInit {
  orderID!: string;
  idBan!: string;
  nameBan!: string;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cart: { product: Product, quantity: number }[] = [];
  searchTerm: string = '';
  productTypes: string[] = [];
  selectedType: string = 'Tất cả';
  productQuantities: { [productId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProdcutService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderID = this.route.snapshot.paramMap.get('orderID')!;
    this.route.queryParams.subscribe(params => {
      this.idBan = params['idBan'];
      this.nameBan = params['nameBan'];
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.productTypes = ['Tất cả', ...new Set(data.map(p => p.nameTypeProduct || '').filter(Boolean))];
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    );
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/default-product.png';
    }
    return imagePath.startsWith('http') ? imagePath : `https://localhost:7157${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/default-product.png';
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

  validateQuantity(productId: number): void {
    if (this.productQuantities[productId] < 1 || !this.productQuantities[productId]) {
      this.productQuantities[productId] = 1;
    }
  }

  addToCart(product: Product): void {
    const quantity = this.productQuantities[product.id] || 1;
    const item = this.cart.find(i => i.product.id === product.id);
    
    if (item) {
      item.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    
    this.productQuantities[product.id] = 1;
  }

  placeOrder(): void {
    if (this.cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    const orderItems = this.cart.map(item => ({
      orderId: Number(this.orderID),
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Gửi từng món lên server và đợi tất cả hoàn tất
    Promise.all(
      orderItems.map(orderItem =>
        this.orderService.addItemToOrder(orderItem).toPromise()
          .then(() => console.log(`Đã thêm sản phẩm ${orderItem.productId} vào đơn hàng`))
          .catch(error => console.error('Lỗi khi thêm sản phẩm vào đơn hàng:', error))
      )
    ).then(() => {
      alert('Đơn hàng đã được cập nhật thành công!');
      this.cart = []; // Xóa giỏ hàng sau khi hoàn tất
    }).catch(() => {
      alert('Có lỗi xảy ra khi cập nhật đơn hàng!');
    });
  }
}