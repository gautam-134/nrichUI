export interface ExpertVO {
    idExpert: number,
    name: string,
    profileImage: string,
    description: string,
    isFeatured:boolean,
    displayOrder:number,
    instituteId:number,
    instituteName:string,
    profileImagePath:string,
}

export interface ExpertRes {
    body: ExpertVO[];
  }

  export class ExpertVO {
    idExpert!: number;
    name!: string;
    profileImage!: string;
    description!: string;
    isFeatured!: boolean;
    displayOrder!: number;
    instituteId!:number;
    instituteName!:string;
    profileImagePath!:string;
}