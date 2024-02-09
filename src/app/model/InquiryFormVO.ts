export interface InquiryFormVO{
    id:number;
    name:string;
    mobileNumber:any
    message:string
    type:string
}

export class InquiryForm{
    id!:number;
    name:any;
    mobileNumber!:number;
    message!:string;
    queryFrom!:string;
    email!:string;
}