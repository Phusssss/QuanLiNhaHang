import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableManagerComponent } from './table-manager/table-manager.component';
import { LoaiBanManagerComponent } from './loai-ban-manager/loai-ban-manager.component';
import { KhuVucManagerComponent } from './khu-vuc-manager/khu-vuc-manager.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { AddItemToOrderComponent } from './add-item-to-order/add-item-to-order.component';
import { BillComponent } from './bill/bill.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Services/auth.guard';
import { StaffManagerComponent } from './staff-manager/staff-manager.component';
import { TimekeepingComponent } from './timekeeping/timekeeping.component';
import { JobManagerComponent } from './job-manager/job-manager.component';
import { StaffTimekeepingComponent } from './staff-timekeeping/staff-timekeeping.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';

const routes: Routes = [
  { path: '', component: TableManagerComponent, canActivate: [AuthGuard] }, // Default route is now /tables
  { path: 'tables', component: TableManagerComponent, canActivate: [AuthGuard] },
  { path: 'loaibans', component: LoaiBanManagerComponent, canActivate: [AuthGuard] },
  { path: 'khuvucs', component: KhuVucManagerComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductManagerComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'order/:id', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'add-item-to-order/:orderID', component: AddItemToOrderComponent, canActivate: [AuthGuard] },
  { path: 'bill', component: BillComponent, canActivate: [AuthGuard] },
  { path: 'kit', component: KitchenComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }, // Public route
  { path: 'staff-manager', component: StaffManagerComponent }, // Public route
  { path: 'lichlam/admin', component: TimekeepingComponent }, // Public route
  { path: 'job/admin', component: JobManagerComponent }, // Public route
  { path: 'lichlam', component: StaffTimekeepingComponent }, // Public route
  { path: 'doanhthu', component: OrderManagerComponent }, // Public route

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }