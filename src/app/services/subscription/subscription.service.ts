import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { BillingAddressVO } from '../../model/BillingAddressVO';
import { FAQVo } from '../../model/Faq';
import { SubscriptionPlanVO } from '../../model/SubscriptionPlanVO';
import { addOnPlan } from '../../model/addOn.model';
import { SubscriptionPlanOrderRequest } from '../../model/subscription-PaymentVOs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  url = environment.apiEndpoint + '/users';
  constructor(private http: HttpClient) {}
  addCoupons(form: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<any>(
      `${environment.apiEndpoint}/users/v1/api/createCoupon`,
      form,
      {
        headers: headers,
      }
    );
  }

  // fetchCurrentPlanDetails() {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${AuthService.getAccessToken}`,
  //   });
  //   return this.http
  //     .get<ApiResponse>(
  //       `${environment.apiEndpoint}/users/v2/api/currentPlanDetails/${AuthService.getInstituteId}`,
  //       {
  //         headers: headers,
  //       }
  //     )
  //     .pipe(map((res) => res.body));
  // }

  // pricingPlanSubject = new BehaviorSubject<any>('');

  fetchPlanDetails() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/planValidityDetails/${AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  generateInvoice(transactionId: number, isInvoiceGenerated: boolean) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/generateInvoice/${transactionId}/${isInvoiceGenerated}`,
        '',
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  checkStorageInS3Bucket(size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/validateUploadDataRequest/${size}/${AuthService.instituteId}`,
      '',
      { headers: headers }
    );
  }

  saveBillingAddress(BillingaddressForm: BillingAddressVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/saveBillingAddress`,
        BillingaddressForm,
        { headers: headers }
      )
      .pipe(
        map((value: ApiResponse) => {
          return value.body;
        })
      );
  }
  saveOfflineTaxCalculationOfInstitute(BillingaddressForm: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/save/offlineTaxCalculationOfInstitute`,
        BillingaddressForm,
        { headers: headers }
      )
      .pipe(
        map((value: ApiResponse) => {
          return value.body;
        })
      );
  }

  saveOfflinePaymentRecieved(offlinePaymentTransactionVO: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/razorPay/v1/api/offlinePaymentSuccessForPlan`,
        offlinePaymentTransactionVO,
        { headers: headers }
      )
      .pipe(
        map((value: ApiResponse) => {
          return value.body;
        })
      );
  }

  downloadFile(key: string, eTag?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams()
      .append('key', key)
      .append('idInstitution', AuthService.getInstituteId);
    if (eTag) params = params.append('eTag', eTag);
    return this.http.get(`${environment.apiEndpoint}/users/v2/api/download`, {
      headers: headers,
      params: params,
      responseType: 'blob',
    });
  }

  deleteFiles(keys: string[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/s3FileDelete/${AuthService.getInstituteId}`,
      keys,
      { headers: headers }
    );
  }
  getcoupens(page: number, size: number, searchParam: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });

    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/fetchCouponDetail?size=${size}&page=${page}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  getAddOnPlansList(page: number, size: number, searchParam: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });

    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/fetchSubscriptionAddOnList?size=${size}&page=${page}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  createOrder(order: SubscriptionPlanOrderRequest) {
    order.instituteId = +AuthService.getInstituteId;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/razorPay/v1/api/subscriptionPlanOrder`,
        order,
        { headers: headers }
      )
      .pipe(
        map((value: ApiResponse) => {
          return value.body;
        })
      );
  }
  getcoupensdetail(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/fetchCoupons/${id}`,
      { headers: headers }
    );
  }

  getplanlist(id: number, type: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(this.url + `/v2/api/fetchPlanDetails/${id}/${type}`, {
        headers: headers,
      })
      .pipe(
        map((value: ApiResponse) => {
          return value.body;
        })
      );
  }
  getRoleByInstitution(idInstitution: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/rolesByInstitutionId/${idInstitution}`,
      { headers: headers }
    );
  }
  getUserByRole(roleId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/users/${roleId}`,
      { headers: headers }
    );
  }
  getSubscriptionplan() {
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${AuthService.getAccessToken}`,
    // });
    return this.http.get(
      `${environment.apiEndpoint}/users/v1/api/fetchSubscriptionPricingPlans`
    );
  }
  addAddon(addOn: addOnPlan) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post(
        `${environment.apiEndpoint}/users/v1/api/saveSubscriptionAddOnPlan`,
        addOn,
        { headers: headers }
      )
      .pipe(
        map((response: ApiResponse) => {
          return response.body;
        })
      );
  }

  getPlans(page: number, size: number, searchParam: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/fetchAllSubscriptionPlans?size=${size}&page=${page}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }
  deletePlan(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v1/api/deleteSubscriptionPlans/${id}`,
      { headers: headers }
    );
  }
  addPlan(planForm: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/saveSubscriptionPricingPlans`,
      planForm,
      { headers: headers }
    );
  }

  getS3Properties() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetch/storage/analytics/${AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(
        map((response: ApiResponse) => {
          return response.body;
        })
      );
  }

  gets3BucketPropertiesWithPagination(
    size: string,
    nextContinuationToken?: string,
    searchParams?: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let param = new HttpParams();
    if (nextContinuationToken)
      param = param.append('nextContinuationToken', nextContinuationToken);
    if (searchParams) param = param.append('searchParams', searchParams);
    if (size != 'seeAll') param = param.append('size', size);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetch/uploaded/files/${AuthService.getInstituteId}`,
        {
          headers: headers,
          params: param,
        }
      )
      .pipe(
        map((response: ApiResponse) => {
          return response.body;
        })
      );
  }

  saveTrialplan(createTrial: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<any>(
      `${environment.apiEndpoint}/users/v1/api/createSubscriptionTrial`,
      createTrial,
      { headers: headers }
    );
  }
  getTrialplan() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/fetchSubscriptionTrials`,
      {
        headers: headers,
      }
    );
  }
  getcurrentplan() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchCurrentAndFuturePlan`,
      { headers: headers }
    );
  }
  getCurrentActiveplan() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchCurrentActivePricingPlan`,
      { headers: headers }
    );
  }
  getmyCoupons() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(`${environment.apiEndpoint}/users/v1/api/myCoupons`, {
      headers: headers,
    });
  }

  fetchSubscriptionPlanHistory() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchTransactionHistory/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  getSubscriptionfaq() {
    return this.http.get(this.url + `/v1/api/fetchSubscriptionFAQs`);
  }

  getActiveAddons() {
    return this.http
      .get(
        `${environment.apiEndpoint}/users/v1/api/fetchActiveSubscriptionAddOnList`
      )
      .pipe(
        map((response: ApiResponse) => {
          return response.body;
        })
      );
  }

  isAddonValid(addonId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/isAddonValid/${addonId}`,
      '',
      { headers: headers }
    );
  }

  getBillingAddress() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v1/api/getBillingAddress`,
        { headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  getBillingAddressOfInstitute(instituteId:any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v1/api/getBillingAddressOfInstitute/${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  getstates() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get(this.url + `/v1/api/getStates`, { headers: headers })
      .pipe(map((res: ApiResponse) => res.body));
  }

  subscriptionPlanPayment(transactionId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post(
        `${environment.apiEndpoint}/users/razorPay/v1/api/subscriptionPricingPlanPayment/${transactionId}`,
        '',
        { headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  subscriptionPaymentSuccess(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    transaction_id: number
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/razorPay/v1/api/planPaymentSuccess`,
      {
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: razorpay_signature,
        transaction_id: transaction_id,
      },
      { headers: headers }
    );
  }

  getUserInfo(instituteId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v1/api/getUserInfo/${instituteId}`,
      { headers: headers }
    );
  }

  subscriptionPaymentFailed(
    order_id: string,
    payment_id: string,
    transaction_id: number
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/razorPay/v1/api/planPurchasedFailed`,
      {
        order_id: order_id,
        payment_id: payment_id,
        transaction_id: transaction_id,
      },
      { headers: headers }
    );
  }

  reinitializeCoupenState(transactionId: number | undefined) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/razorPay/v1/api/reinitializeCouponState/${transactionId}`,
        '',
        { headers: headers }
      )
      .pipe(
        map((res: ApiResponse) => {
          return res.body;
        })
      );
  }

  createFaq(FaqsVO: FAQVo) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/createFAQs`,
      FaqsVO,
      {
        headers: headers,
      }
    );
  }

  fetchFaqList(pageNumber: number, pageSize: number, faqType: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getAllFaqList?page=${pageNumber}&size=${pageSize}&faqType=${faqType}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchActiveFaqList(faqType: string) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getAllActiveFaqList?faqType=${faqType}`
      )
      .pipe(map((res) => res.body));
  }

  updateDisplayOrder(displayOrder: string, id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams()
      .append('displayOrder', displayOrder.toString())
      .append('id', id.toString());
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateDisplayOrderOfFaq`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  deleteFaq(id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v2/api/deleteFaq?id=${id}`,
      {
        headers: headers,
      }
    );
  }

  fetchAllCurrentActivePlans(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams().append('page', page).append('size', size)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('param', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/allCurrentActivePlans`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  getPlanDetails(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getPlanDetails/${id}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  saveSubscriptionPlan(data: SubscriptionPlanVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updatePlanDetails`,
        data,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  getMyReferralCode() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/referral/code`,
      { headers: headers }
    );
  }

  getReferralDiscountPrice() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/referral/discount/amount`,
      { headers: headers }
    );
  }
  fetchActiveAddons() {
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/active/addons`
    );
  }

  fetchReferralUsers(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/referral/users?page=${page}&size=${size}`,
      { headers: headers }
    );
  }

  fetchReferralRewards(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/referral/rewards?page=${page}&size=${size}`,
      { headers: headers }
    );
  }

  generateOrDownloadInvoice(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get(`${environment.apiEndpoint}/users/v2/api/generate/invoice/${id}`, {
        headers: headers,
        responseType: 'blob',
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => 'Unable to generate invoice.')
        )
      );
  }

  fetchSacCodes() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetch/sac/codes`,
      { headers: headers }
    );
  }
}
