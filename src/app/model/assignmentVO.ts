import { UserVO } from "./userVO";

export class assignmentVO {
    id!: number;
    name!: string;
    description!: string;
    submissiontype!: string;
    gradeType!: string;
    createdBy!: number;
    createdDate!: Date;
    maxMarks!: number;
    uploadedFiles: string[]=[];
    instituteId!:number;
    isActive!:boolean;
    assignmentSubmittedOrNot!: string;
    grade!:string;
    marks!:number;
    url!:string;
    answer!:string;
    submissionFrom!:Date;
    publishedDate!:Date;
    requestStatus!:string;
    studentUploadedFiles:string[]=[];
    submitAssignmentReevaluation!:Boolean;
    batchId!:number;
  }

  export interface FetchAssignmentRes {
    completedAssignmentList: CompletedAssignmentList[];
  }

  export interface CompletedAssignmentList {
    id: number;
    idUser: number;
    assignmentId: number;
    description: string;
    fileUploaded: string;
    grade?: any;
    marks?: any;
    createdDate: Date;
    requestStatus:string;
    assignmentObj: assignmentVO;
    userObj: UserVO;
    batchId: number;
  }

  
  export class CompletedAssignmentList {
    id!: number;
    idUser!: number;
    assignmentId!: number;
    description!: string;
    fileUploaded!: string;
    grade?: any;
    marks?: any;
    createdDate!: Date;
    requestStatus!: string;
    assignmentObj!: assignmentVO;
    userObj!: UserVO;
    batchId!: number;
  }