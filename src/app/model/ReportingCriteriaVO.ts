import { AuthService } from '../services/auth.service';
import {
  ReportingRequest,
  ReportingRequestCriteria,
  ReportingRequestCriteriaFields,
} from './ReportingRequest';

export class ReportingCriteriaVO {
  id!: number;
  criteria!: string;
  criteriaName!: string;
  required!:boolean;
  error!: string;
  fields: ReportingCriteriaFieldVO[] = [];
}

export class ReportingCriteriaFieldVO {
  id!: number;
  fieldName!: string;
  fieldType!: string;
  fieldLabel!: string;
  required!: boolean;
  criteriaFieldValues: ReportingCriteriaFieldValuesVO[] = [];
  value!: string;
  subValue!:number;
  error!: string;
}

export class ReportingCriteriaFieldSubValuesVO{
  id!:number;
  value!:string;
}

export class ReportingCriteriaFieldValuesVO {
  id!: number;
  value!: number;
  criterialFieldSubValues:ReportingCriteriaFieldSubValuesVO[]=[]
}

export class ReportingNameVO {
  id!: number;
  reportingName!: string;
  criteria: ReportingCriteriaVO[] = [];

  get getReportRequest(): ReportingRequest {
    let reportingRequest = new ReportingRequest();
    reportingRequest.id = this.id;
    reportingRequest.instituteId = +AuthService.getInstituteId;
    let criteriasList: ReportingRequestCriteria[] = [];
    this.criteria.forEach((value: ReportingCriteriaVO) => {
      let reportingRequestCriteria = new ReportingRequestCriteria();
      reportingRequestCriteria.id = value.id;
      reportingRequestCriteria.required=value.required;
      
      let fieldList: ReportingRequestCriteriaFields[] = [];
      value.fields?.forEach((value: ReportingCriteriaFieldVO) => {
        let reportingRequestCriteriaField =
          new ReportingRequestCriteriaFields();
        reportingRequestCriteriaField.id = value.id;
        reportingRequestCriteriaField.value = value.value;
        reportingRequestCriteriaField.subValue=value.subValue
        fieldList.push(reportingRequestCriteriaField);
      });
      reportingRequestCriteria.fields = fieldList;
      criteriasList.push(reportingRequestCriteria);
    });
  
    reportingRequest.selectedCriterias = criteriasList;
    return reportingRequest;
  }
}
