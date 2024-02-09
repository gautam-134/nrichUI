import { LeadFieldDataVO } from "./LeadFieldDataVO";

export class CrmFormFieldsVO {
  id!: number;
  instituteId!: number;
  fieldName!: string;
  metaTags!: string[];
  active!: boolean;
  displayOrder!: number;
  required!: boolean;
  formControlName!: string;
  leadFieldDataVO!: LeadFieldDataVO;
}
