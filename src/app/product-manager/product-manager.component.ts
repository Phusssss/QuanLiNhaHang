import { Component, OnInit } from '@angular/core';
import { ProdcutService } from '../Services/Product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {
  products: any[] = [];
  typeProducts: any[] = [];
  newProduct = { id: 0, name: '', price: 0, idTypeProduct: 0 };
  selectedFile: File | null = null;

  constructor(private productService: ProdcutService) { }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  ngOnInit(): void {
    this.loadProducts();
    this.loadTypeProducts();
  }

  // Lấy danh sách sản phẩm
  loadProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data.map(product => ({
          ...product,
          idTypeProduct: product.idTypeProduct || 0 // Đảm bảo không bị undefined
        }));
        console.log("Dữ liệu sản phẩm:", this.products);
      },
      (error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    );
  }
  

  // Lấy danh sách loại sản phẩm
  loadTypeProducts() {
    this.productService.getTypeProducts().subscribe(
      (data) => {
        this.typeProducts = data;
        console.log("Danh sách loại sản phẩm:", this.typeProducts);
      },
      (error) => {
        console.error("Lỗi khi lấy loại sản phẩm:", error);
      }
    );
  }
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/default-product.png'; // Ảnh mặc định nếu không có ảnh
    }
    return imagePath.startsWith('http') ? imagePath : `https://localhost:7157${imagePath}`;
  }
  
  // Thêm sản phẩm
  addProduct() {
    if (!this.selectedFile) {
      alert("Vui lòng chọn ảnh!");
      return;
    }
  
    this.productService.addProduct(this.newProduct, this.selectedFile).subscribe(
      (data) => {
        this.products.push(data);
        console.log("Thêm sản phẩm thành công:", data);
        this.resetForm();
      },
      (error) => {
        console.error("Lỗi khi thêm sản phẩm:", error);
      }
    );
  }
  // Sửa sản phẩm
  // Sửa sản phẩm
updateProduct(product: any) {
  const updatedProduct = { ...product }; // Sao chép để tránh ảnh hưởng đến dữ liệu gốc
  if (!updatedProduct.idTypeProduct) {
    const existingProduct = this.products.find(p => p.id === product.id);
    updatedProduct.idTypeProduct = existingProduct ? existingProduct.idTypeProduct : 0;
  }

  this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe(
    () => {
      console.log("Cập nhật sản phẩm thành công");
      this.loadProducts();
    },
    (error) => {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  );
}


  // Xóa sản phẩm
  deleteProduct(id: number) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.products = this.products.filter(p => p.id !== id);
          console.log("Xóa sản phẩm thành công");
        },
        (error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
        }
      );
    }
  }

  // Reset form nhập liệu
  resetForm() {
    this.newProduct = { id: 0, name: '', price: 0, idTypeProduct: 0 };
  }
}
