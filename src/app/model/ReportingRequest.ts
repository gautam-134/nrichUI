
export class ReportingRequest {
    id!: number;
    instituteId!: number;
    selectedCriterias: ReportingRequestCriteria[] = [];
}

export class ReportingRequestCriteria {
    id!: number;
    required!:boolean;
    fields: ReportingRequestCriteriaFields[] = [];
}

export class ReportingRequestCriteriaFields {
    id!: number;
    value!: string;
    subValue!:number
}


export class ReportingRecordsVO {
    id!: number;
    createdAt!: Date;
    reportFileName!: string;
    reportType!: string;
    isNew:boolean=false
    criteriaNames!:string;
}