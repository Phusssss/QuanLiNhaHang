import { Component, OnInit } from '@angular/core';
import { StaffService } from '../Services/staff.service';

interface Staff {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  jobId: number;
  jobName: string;
}

interface Job {
  id: number;
  name: string;
  description: string;
  salary: number;
  typeSalary: string;
}

@Component({
  selector: 'app-staff-manager',
  templateUrl: './staff-manager.component.html',
  styleUrls: ['./staff-manager.component.css']
})
export class StaffManagerComponent implements OnInit {
  staffList: Staff[] = [];
  jobs: Job[] = [];
  newStaff: Staff = { id: 0, name: '', email: '', phoneNumber: '', jobId: 0, jobName: '' };
  isEditing = false;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadStaff();
    this.loadJobs();
  }

  loadStaff() {
    this.staffService.getStaff().subscribe(
      (staff: Staff[]) => {
        this.staffList = staff;
      },
      (error) => {
        console.error('Lỗi khi tải danh sách nhân viên:', error);
      }
    );
  }

  loadJobs() {
    this.staffService.getJobs().subscribe(
      (jobs: Job[]) => {
        this.jobs = jobs;
      },
      (error) => {
        console.error('Lỗi khi tải danh sách công việc:', error);
      }
    );
  }

  addStaff() {
    this.staffService.addStaff(this.newStaff).subscribe(
      () => {
        this.loadStaff();
        this.resetForm();
      },
      (error) => {
        console.error('Lỗi khi thêm nhân viên:', error);
      }
    );
  }

  editStaff(staff: Staff) {
    this.newStaff = { ...staff };
    this.isEditing = true;
  }

  updateStaff() {
    this.staffService.updateStaff(this.newStaff).subscribe(
      () => {
        this.loadStaff();
        this.resetForm();
      },
      (error) => {
        console.error('Lỗi khi cập nhật nhân viên:', error);
      }
    );
  }

  deleteStaff(id: number) {
    if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      this.staffService.deleteStaff(id).subscribe(
        () => {
          this.loadStaff();
        },
        (error) => {
          console.error('Lỗi khi xóa nhân viên:', error);
        }
      );
    }
  }

  resetForm() {
    this.newStaff = { id: 0, name: '', email: '', phoneNumber: '', jobId: 0, jobName: '' };
    this.isEditing = false;
  }
}