import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FacebookFormResponse,
  FacebookLeadResponse,
  FacebookPagesResponse,
} from '../crm/facebook-leads/facebook-leads.component';

@Injectable({
  providedIn: 'root',
})
export class FacebookLeadsService {
  limit = 1000;
  constructor(private httpService: HttpClient) {}

  fetchPages(userId: string, token: string, nextPage?: string) {
    let params = new HttpParams().append('access_token', token);
    if (nextPage) params = params.append('after', nextPage);
    return this.httpService.get<FacebookPagesResponse>(
      `https://graph.facebook.com/${userId}/accounts?`,
      { params: params }
    );
  }

  fetchForms(pageId: string, pageAccessToken: string, nextPage?: string) {
    let params = new HttpParams().append('access_token', pageAccessToken);
    params = params.append('limit', this.limit);
    if (nextPage) params = params.append('after', nextPage);
    return this.httpService.get<FacebookFormResponse>(
      `https://graph.facebook.com/v16.0/${pageId}/leadgen_forms`,
      { params: params }
    );
  }

  fetchFormThroughUrl(url: string) {
    return this.httpService.get<FacebookFormResponse>(url);
  }

  fetchLeads(
    userAccessToken: string,
    formId: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined
  ) {
    const fields = 'created_time,field_data';
    let since: number = 0;
    if (startDate) since = Math.round(startDate.getTime() / 1000);
    let until = 0;
    if (endDate) until = Math.round(endDate.getTime() / 1000);
    const filtering = [
      { field: 'time_created', operator: 'GREATER_THAN', value: since },
      { field: 'time_created', operator: 'LESS_THAN', value: until },
    ];
    let params = new HttpParams().append('access_token', userAccessToken);
    params = params.append('limit', this.limit);
    params = params.append('fields', fields);
    params = params.append('filtering', JSON.stringify(filtering));
    return this.httpService.get<FacebookLeadResponse>(
      `https://graph.facebook.com/v16.0/${formId}/leads`,
      { params: params }
    );
  }

  fetchAllPaginatedLeads(url: string) {
    return this.httpService.get<FacebookLeadResponse>(url);
  }
}
