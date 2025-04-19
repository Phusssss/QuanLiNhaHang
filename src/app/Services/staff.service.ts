import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

interface Timekeeping {
  id: number;
  userId: number;
  start: string;
  end: string;
  status: number;
  typeJob: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = 'https://localhost:7157/api';

  constructor(private http: HttpClient) {}

  // Existing methods...
  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/staff`);
  }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  addStaff(staff: Staff): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff`, staff);
  }

  updateStaff(staff: Staff): Observable<any> {
    return this.http.put(`${this.apiUrl}/staff/${staff.id}`, staff);
  }

  deleteStaff(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/staff/${id}`);
  }

  addTimekeeping(timekeeping: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/timekeeping`, timekeeping);
  }

  addTimekeepingBatch(timekeepings: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/timekeeping/batch`, timekeepings);
  }

  updateTimekeeping(id: number, timekeeping: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/staff/timekeeping/${id}`, timekeeping);
  }

  deleteTimekeeping(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/staff/timekeeping/${id}`);
  }

  getStaffTimekeeping(staffId: number): Observable<Timekeeping[]> {
    return this.http.get<Timekeeping[]>(`${this.apiUrl}/staff/${staffId}/timekeeping`);
  }

  // New job-related methods
  addJob(job: Job): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, job);
  }

  updateJob(id: number, job: Job): Observable<any> {
    return this.http.put(`${this.apiUrl}/jobs/${id}`, job);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jobs/${id}`);
  }
}