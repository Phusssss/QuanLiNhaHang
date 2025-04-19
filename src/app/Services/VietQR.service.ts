import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VietQRService {
  private apiUrl = 'https://api.vietqr.io/v2/generate';

  constructor(private http: HttpClient) { }

  generateQRCode(accountNo: string, amount: number, memo: string): Observable<any> {
    const payload = {
      accountNo: accountNo,
      accountName: "NGUYEN VAN PHU",
      acqId: "970422", 
      amount: amount,
      addInfo: memo,
      template: "compact",
      format: "png"
    };

    return this.http.post(this.apiUrl, payload);
  }
}
