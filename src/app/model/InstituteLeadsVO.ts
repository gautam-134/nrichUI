export class InstituteLeadsVO {
  id!: number;
  instituteId!: number;
  name!: string;
  mobileNumber!: string;
  organisation!: string;
  role!: string;
  email!: string;
  source!: string;
  country!: number;
  countryName!:string;
  stateName!:string;
  state!: number;
  city!: string;
  courseId!: number;
  pricingPlanId!: number;
  courseName!:number;
  courseAmount!: string;
  status!: string;
  subStatus!: string;
  notes!: string;
  leadFormFields!: Map<number, string>;
  followUpDate!:Date;
  selected!: boolean;
  leadResponse!:string;
  assigneeName!:string;
}
