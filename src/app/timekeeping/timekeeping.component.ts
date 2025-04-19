import { Component, OnInit } from '@angular/core';
import { StaffService } from '../Services/staff.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-timekeeping',
  templateUrl: './timekeeping.component.html',
  styleUrls: ['./timekeeping.component.css']
})
export class TimekeepingComponent implements OnInit {
  staffList: any[] = [];
  selectedStaff: any = null;
  timekeepingForm: FormGroup;
  timekeepings: any[] = [];
  showForm = false;
  daysInMonth: number[] = [];
  selectedDays: boolean[] = [];
  existingDays: Map<number, number> = new Map(); // Map day to timekeeping ID
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendarDays: { day: number, isCurrentMonth: boolean }[] = [];
  isEditMode = false;

  constructor(
    private staffService: StaffService,
    private fb: FormBuilder
  ) {
    this.timekeepingForm = this.fb.group({
      userId: ['', Validators.required],
      start: [''],
      end: [''],
      status: [1, Validators.required],
      typeJob: ['FullTime', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStaff();
    this.generateCalendar();
  }

  generateCalendar() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({length: daysInMonth}, (_, i) => i + 1);
    this.selectedDays = new Array(daysInMonth).fill(false);

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

  loadStaff() {
    this.staffService.getStaff().subscribe({
      next: (data) => {
        this.staffList = data;
      },
      error: (error) => {
        console.error('Error loading staff:', error);
      }
    });
  }

  selectStaff(staff: any) {
    this.selectedStaff = staff;
    this.timekeepingForm.patchValue({ userId: staff.id });
    this.loadTimekeeping(staff.id);
    this.showForm = true;
    this.isEditMode = false;
  }

  loadTimekeeping(staffId: number) {
    this.staffService.getStaffTimekeeping(staffId).subscribe({
      next: (data) => {
        this.timekeepings = data;
        this.markExistingDays();
      },
      error: (error) => {
        console.error('Error loading timekeeping:', error);
      }
    });
  }

  markExistingDays() {
    this.existingDays.clear();
    this.selectedDays.fill(false);
    
    this.timekeepings.forEach(tk => {
      const startDate = new Date(tk.start);
      if (startDate.getMonth() === this.currentMonth && 
          startDate.getFullYear() === this.currentYear) {
        const day = startDate.getDate();
        this.existingDays.set(day, tk.id);
        this.selectedDays[day - 1] = true;
      }
    });
  }

  onTypeJobChange(event: Event) {
    const typeJob = (event.target as HTMLSelectElement).value;
    if (typeJob === 'FullTime') {
      this.timekeepingForm.get('start')?.clearValidators();
      this.timekeepingForm.get('end')?.clearValidators();
    } else {
      this.timekeepingForm.get('start')?.setValidators(Validators.required);
      this.timekeepingForm.get('end')?.setValidators(Validators.required);
    }
    this.timekeepingForm.get('start')?.updateValueAndValidity();
    this.timekeepingForm.get('end')?.updateValueAndValidity();
  }

  toggleDay(dayIndex: number) {
    if (dayIndex >= 0 && dayIndex < this.daysInMonth.length) {
      this.selectedDays[dayIndex] = !this.selectedDays[dayIndex];
      this.isEditMode = true;
    }
  }

  generateFullTimeSchedule() {
    if (this.timekeepingForm.get('typeJob')?.value === 'FullTime') {
      const schedules = this.selectedDays
        .map((selected, index) => {
          if (selected && !this.existingDays.has(index + 1)) {
            const day = index + 1;
            const startDate = new Date(Date.UTC(this.currentYear, this.currentMonth, day, 8, 0));
            const endDate = new Date(Date.UTC(this.currentYear, this.currentMonth, day, 17, 0));
            
            return {
              userId: this.selectedStaff.id,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              status: 1,
              typeJob: 'FullTime'
            };
          }
          return null;
        })
        .filter(schedule => schedule !== null);

      if (schedules.length > 0) {
        this.staffService.addTimekeepingBatch(schedules).subscribe({
          next: (response) => {
            this.loadTimekeeping(this.selectedStaff.id);
            alert('Đã tạo lịch làm việc cho các ngày được chọn');
            this.isEditMode = false;
          },
          error: (error) => {
            console.error('Batch error:', error);
            alert(error.error.message || 'Lỗi khi tạo lịch làm việc');
          }
        });
      } else if (this.isEditMode) {
        this.saveChanges();
      } else {
        alert('Không có thay đổi mới để lưu!');
      }
    }
  }

  saveChanges() {
    const toDelete = this.timekeepings.filter(tk => {
      const startDate = new Date(tk.start);
      return startDate.getMonth() === this.currentMonth &&
             startDate.getFullYear() === this.currentYear &&
             !this.selectedDays[startDate.getDate() - 1];
    });

    const deletePromises = toDelete.map(tk => 
      this.staffService.deleteTimekeeping(tk.id).toPromise()
    );

    Promise.all(deletePromises).then(() => {
      const newSchedules = this.selectedDays
        .map((selected, index) => {
          if (selected && !this.existingDays.has(index + 1)) {
            const day = index + 1;
            const startDate = new Date(Date.UTC(this.currentYear, this.currentMonth, day, 8, 0));
            const endDate = new Date(Date.UTC(this.currentYear, this.currentMonth, day, 17, 0));
            
            return {
              userId: this.selectedStaff.id,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              status: 1,
              typeJob: 'FullTime'
            };
          }
          return null;
        })
        .filter(schedule => schedule !== null);

      if (newSchedules.length > 0) {
        this.staffService.addTimekeepingBatch(newSchedules).subscribe({
          next: (response) => {
            this.loadTimekeeping(this.selectedStaff.id);
            alert('Đã lưu thay đổi lịch làm việc');
            this.isEditMode = false;
          },
          error: (error) => {
            console.error('Batch error:', error);
            alert(error.error.message || 'Lỗi khi lưu thay đổi');
          }
        });
      } else {
        this.loadTimekeeping(this.selectedStaff.id);
        alert('Đã lưu thay đổi lịch làm việc');
        this.isEditMode = false;
      }
    }).catch(error => {
      console.error('Delete error:', error);
      alert('Lỗi khi xóa lịch làm việc');
    });
  }

  editTimekeeping(tk: any) {
    if (tk.typeJob === 'PartTime') {
      this.timekeepingForm.patchValue({
        userId: tk.userId,
        start: new Date(tk.start).toISOString().slice(0, 16),
        end: new Date(tk.end).toISOString().slice(0, 16),
        status: tk.status,
        typeJob: 'PartTime'
      });
    }
  }

  deleteTimekeeping(id: number) {
    if (confirm('Bạn có chắc muốn xóa lịch làm việc này?')) {
      this.staffService.deleteTimekeeping(id).subscribe({
        next: () => {
          this.loadTimekeeping(this.selectedStaff.id);
          alert('Đã xóa lịch làm việc');
        },
        error: (error) => {
          console.error('Delete error:', error);
          alert(error.error.message || 'Lỗi khi xóa lịch làm việc');
        }
      });
    }
  }

  onSubmit() {
    if (this.timekeepingForm.valid) {
      if (this.timekeepingForm.get('typeJob')?.value === 'PartTime') {
        const formValue = this.timekeepingForm.value;
        const start = new Date(formValue.start).toISOString();
        const end = new Date(formValue.end).toISOString();
        
        const timekeepingData = {
          userId: formValue.userId,
          start: start,
          end: end,
          status: formValue.status,
          typeJob: 'PartTime'
        };

        this.staffService.addTimekeeping(timekeepingData).subscribe({
          next: (response) => {
            alert(response.message);
            this.loadTimekeeping(this.selectedStaff.id);
            this.timekeepingForm.reset({
              userId: this.selectedStaff.id,
              status: 1,
              typeJob: 'PartTime'
            });
          },
          error: (error) => {
            console.error('Error adding timekeeping:', error);
            alert(error.error.message || 'Lỗi khi thêm lịch làm việc');
          }
        });
      } else {
        this.generateFullTimeSchedule();
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
    }
  }
}