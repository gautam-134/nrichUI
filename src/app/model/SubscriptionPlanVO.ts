export class SubscriptionPlanVO {
  id!: number;
  name!: string;
  planName!: string;
  instituteName!: string;
  actualEndDate!: Date;
  allowedStudents!: number;
  allowedStorage!: number;
  allowedTeachers!: number;
  allowedConcurrentClasses!: number;
  zoomAllowed!:boolean;
  status!:string;
  contactNumber!:string;
}
