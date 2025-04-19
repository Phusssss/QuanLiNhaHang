import { Component, OnInit } from '@angular/core';
import { StaffService } from '../Services/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-timekeeping',
  templateUrl: './staff-timekeeping.component.html',
  styleUrls: ['./staff-timekeeping.component.css']
})
export class StaffTimekeepingComponent implements OnInit {
  timekeepings: any[] = [];
  userId: number | null = null;
  userName: string | null = null;
  errorMessage: string = '';
  daysInMonth: number[] = [];
  existingDays: Map<number, number> = new Map(); // Map day to timekeeping ID
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendarDays: { day: number, isCurrentMonth: boolean }[] = [];

  constructor(
    private staffService: StaffService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('name');

    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
      this.loadTimekeeping();
      this.generateCalendar();
    } else {
      this.errorMessage = 'Bạn cần đăng nhập để xem lịch làm việc.';
      this.router.navigate(['/login']);
    }
  }

  generateCalendar() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({length: daysInMonth}, (_, i) => i + 1);

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    this.calendarDays = [];
    const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();
    
    for (let i = offset - 1; i >= 0; i--) {
      this.calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({ day: i, isCurrentMonth: true });
    }
    
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
    for (let i = this.calendarDays.length; i < totalCells; i++) {
      this.calendarDays.push({ day: i - daysInMonth - offset + 1, isCurrentMonth: false });
    }
  }

  loadTimekeeping() {
    if (this.userId) {
      this.staffService.getStaffTimekeeping(this.userId).subscribe({
        next: (data) => {
          this.timekeepings = data;
          this.markExistingDays();
        },
        error: (error) => {
          console.error('Error loading timekeeping:', error);
          this.errorMessage = 'Không thể tải lịch làm việc. Vui lòng thử lại sau.';
        }
      });
    }
  }

  markExistingDays() {
    this.existingDays.clear();
    
    this.timekeepings.forEach(tk => {
      if (tk.typeJob === 'FullTime') {
        const startDate = new Date(tk.start);
        if (startDate.getMonth() === this.currentMonth && 
            startDate.getFullYear() === this.currentYear) {
          const day = startDate.getDate();
          this.existingDays.set(day, tk.id);
        }
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}