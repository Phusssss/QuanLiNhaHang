import { Component, OnInit } from '@angular/core';
import { StaffService } from '../Services/staff.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-manager',
  templateUrl: './job-manager.component.html',
  styleUrls: ['./job-manager.component.css']
})
export class JobManagerComponent implements OnInit {
  jobs: any[] = [];
  jobForm: FormGroup;
  isEditing = false;
  selectedJobId: number | null = null;

  constructor(
    private staffService: StaffService,
    private fb: FormBuilder
  ) {
    this.jobForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      salary: [0, [Validators.required, Validators.min(0)]],
      typeSalary: ['Monthly', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.staffService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        alert('Lỗi khi tải danh sách công việc');
      }
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      const jobData = this.jobForm.value;

      if (this.isEditing && this.selectedJobId) {
        this.staffService.updateJob(this.selectedJobId, jobData).subscribe({
          next: (response) => {
            alert(response.message);
            this.loadJobs();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating job:', error);
            alert(error.error.message || 'Lỗi khi cập nhật công việc');
          }
        });
      } else {
        this.staffService.addJob(jobData).subscribe({
          next: (response) => {
            alert(response.message);
            this.loadJobs();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error adding job:', error);
            alert(error.error.message || 'Lỗi khi thêm công việc');
          }
        });
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
    }
  }

  editJob(job: any) {
    this.isEditing = true;
    this.selectedJobId = job.id;
    this.jobForm.patchValue({
      name: job.name,
      description: job.description,
      salary: job.salary,
      typeSalary: job.typeSalary
    });
  }

  deleteJob(id: number) {
    if (confirm('Bạn có chắc muốn xóa công việc này?')) {
      this.staffService.deleteJob(id).subscribe({
        next: (response) => {
          alert(response.message);
          this.loadJobs();
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          alert(error.error.message || 'Lỗi khi xóa công việc');
        }
      });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.selectedJobId = null;
    this.jobForm.reset({
      name: '',
      description: '',
      salary: 0,
      typeSalary: 'Monthly'
    });
  }
}