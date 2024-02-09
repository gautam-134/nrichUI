export interface NotifiedInstitutesVO {
  notificationId: number;
  instituteId: number;
  instituteName: string;
}

export class NotificationVO {
  id!: number;
  name!: string;
  notification!: string;
  scheduledDate!: Date;
  status!: string;
  tags!: string;
  type!: string;
  receiverType!: string;
  metaTags!: string[];
  toIds!: number[];
  instituteId!: number;
}

export class BellNotificationVO {
  id!: number;
  name!: string;
  notification!: string;
  viewed!: string;
  createdDate!: Date;
  redirection!: string;
}
