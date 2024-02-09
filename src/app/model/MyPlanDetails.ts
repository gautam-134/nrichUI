export interface MyplanDetails {
  planName: string;
  startDate?: string;
  endDate?: string;
  daysLeft?: string;
  allowedStudents?: number;
  allowedStorage?: number;
  allowedTeachers?: number;
  allowedConcurrentClasses?: number;
  isZoomAllowed?:boolean
}
