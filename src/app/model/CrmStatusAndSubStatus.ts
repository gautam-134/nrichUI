export class CrmStatus {
  id!: number;
  status!: string;
  crmSubStatus!: CrmSubStatus[];
}

export class CrmSubStatus {
  id!: number;
  subStatus!: string;
}
