export interface ReportAbuseVO {
    id?: number;
    postId?: number;
    reportedBy?: number;
    reason?: string;
    reportedDate?: Date;
    status?: string;
    reportedByName?: string;
  }
  