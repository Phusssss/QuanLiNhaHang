import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Thêm dòng này
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableManagerComponent } from './table-manager/table-manager.component';
import { HttpClientModule } from '@angular/common/http';
import { KhuVucManagerComponent } from './khu-vuc-manager/khu-vuc-manager.component';
import { LoaiBanManagerComponent } from './loai-ban-manager/loai-ban-manager.component';
import { FormsModule } from '@angular/forms';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { TypeProductManagerComponent } from './type-product-manager/type-product-manager.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { AddItemToOrderComponent } from './add-item-to-order/add-item-to-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BillComponent } from './bill/bill.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Services/auth.guard';
import { StaffManagerComponent } from './staff-manager/staff-manager.component';
import { TimekeepingComponent } from './timekeeping/timekeeping.component';
import { JobManagerComponent } from './job-manager/job-manager.component';
import { StaffTimekeepingComponent } from './staff-timekeeping/staff-timekeeping.component';
import { FilterByTypePipe } from './filter-by-type.pipe';
import { OrderManagerComponent } from './order-manager/order-manager.component';
@NgModule({
  declarations: [
    AppComponent,
    TableManagerComponent,
    KhuVucManagerComponent,
    LoaiBanManagerComponent,
    ProductManagerComponent,
    TypeProductManagerComponent,
    HomeComponent,
    OrderComponent,
    AddItemToOrderComponent,
    CheckoutComponent,
    BillComponent,
    KitchenComponent,
    LoginComponent,
    StaffManagerComponent,
    TimekeepingComponent,
    JobManagerComponent,
    StaffTimekeepingComponent,
    FilterByTypePipe,
    OrderManagerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  
  providers: [AuthGuard], // Add AuthGuard to providers
  bootstrap: [AppComponent]
})
export class AppModule { }
