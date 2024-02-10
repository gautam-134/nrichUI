import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class BuyCourseService {
  constructor(private http: HttpClient) {}

  buyCourse(idBatch: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<any>(
      environment.apiEndpoint + '/users/v2/api/buyCourse?idBatch=' + idBatch,
      '',
      { headers: headers }
    );
  }

  // paymentDone

  paymentFailed(paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
  }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        environment.apiEndpoint + '/users/v2/api/paymentFailed',
        paymentDetails,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  paymentDone(paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        environment.apiEndpoint + '/users/v2/api/paymentDone',
        paymentDetails,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  crateOrder(amount: number, userId: number, batchId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });

    return this.http
      .post<any>(
        `${environment.apiEndpoint}/users/razorPay/v1/api/create-order`,
        {
          amount: amount,
          userId: userId,
          batchId: batchId,
          instituteId:AuthService.getInstituteId,
        },
        { headers }
      )
      .pipe(map((res) => res.data.order));
  }
}
