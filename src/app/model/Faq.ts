export interface FAQVo {
  id: number;
  displayOrder: number;
  question: string;
  answer: string;
  createdDate: Date;
  active: boolean;
  idInstitution: number;
  faqType: String;
}
export class FAQVo{
  id!: number;
  displayOrder!: number;
  question!: string;
  answer!: string;
  createdDate!: Date;
  active!: boolean;
  idInstitution!: number;
  faqType!: String;
}
