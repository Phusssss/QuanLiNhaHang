import { Component, OnInit } from '@angular/core';
import { TypeProductService } from '../Services/typeProduct.service';

@Component({
  selector: 'app-type-product-manager',
  templateUrl: './type-product-manager.component.html',
  styleUrls: ['./type-product-manager.component.css']
})
export class TypeProductManagerComponent implements OnInit {

  typeProducts: any[] = [];

  constructor(private typeProductService: TypeProductService) { }

  ngOnInit(): void {
    this.loadTypeProducts();
  }

  loadTypeProducts() {
    this.typeProductService.getTypeProducts().subscribe(
      (data) => {
        this.typeProducts = data;
        console.log("Dữ liệu loại sản phẩm:", this.typeProducts);
      },
      (error) => {
        console.error("Lỗi khi lấy loại sản phẩm:", error);
      }
    );
  }

}
