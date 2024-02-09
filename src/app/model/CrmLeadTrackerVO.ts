export interface CrmLeadTrackerVO {
    id?: number;
    leadId?:any;
    assignedTo: number;
    assignedBy: number;
    comment: string;
    assignedDate?: Date;
    assignedByName?:string;
    assignedToName?:string;
    assignedByImage?:string;
    assignedToImage?:string;
    crmLeadComments?:crmLeadComments[];
    status?:string;
    leadIds?:number[];
}

export interface crmLeadComments{
      id?: number;
	  comment: string;
	  commentType?: string;
	  commentDate?:Date;
	  commentBy?: number;
      commentByName?:string;
      commentByImage?:string;
      leadTrackerId:number;

}