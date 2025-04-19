import { Component, OnInit } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css']
})
export class OrderManagerComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  totalCount: number = 0;
  totalRevenue: number = 0;
  filterForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    // Initialize filter form
    this.filterForm = this.fb.group({
      status: ['all'],
      dateFrom: [null],
      dateTo: [null],
      tableName: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllOrders();
    // Subscribe to filter changes
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadAllOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders]; // Initialize filteredOrders
        this.totalCount = response.totalCount;
        this.calculateTotalRevenue();
        this.applyFilters(); // Apply initial filters
        console.log('All orders loaded:', this.orders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  calculateTotalRevenue(): void {
    this.totalRevenue = this.orders
      .filter(order => order.status === 1) // Only count paid orders
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    this.filteredOrders = this.orders.filter(order => {
      // Status filter
      const statusMatch =
        filters.status === 'all' ||
        (filters.status === 'paid' && order.status === 1) ||
        (filters.status === 'unpaid' && order.status === 0);

      // Date range filter
      const dateCreate = new Date(order.timeCreate);
      const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
      const dateMatch =
        (!dateFrom || dateCreate >= dateFrom) &&
        (!dateTo || dateCreate <= dateTo);

      // Table name filter
      const tableMatch =
        !filters.tableName ||
        order.tableName.toLowerCase().includes(filters.tableName.toLowerCase());

      return statusMatch && dateMatch && tableMatch;
    });

    // Recalculate total revenue for filtered paid orders
    this.totalRevenue = this.filteredOrders
      .filter(order => order.status === 1)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    this.totalCount = this.filteredOrders.length;
  }

  resetFilters(): void {
    this.filterForm.reset({
      status: 'all',
      dateFrom: null,
      dateTo: null,
      tableName: ''
    });
  }
}