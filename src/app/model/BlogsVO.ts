export interface BlogsVO {
    
        idBlog: number,
        subject: string,
        image: string,
        description: string,
        isFeatured: boolean,
        displayOrder: number,
        createdDate:Date,
        updatedDate: Date,
        idUser: number,
        firstName:string,
        lastName:string,
        userImage: string,
        coverImagePath:string,
        instituteIsFeatured: boolean,
        instituteDisplayOrder: number 
}

export interface BlogsRes {
    body: BlogsVO[];
  }

  export class BlogsVO {
    
        idBlog!: number;
        subject!: string;
        image!: string;
        description!: string;
        idInstitution!:number;
        isFeatured!: boolean;
        displayOrder!: number;
        createdDate!: Date;
        updatedDate!: Date;
        idUser!: number;
        firstName!: string;
        lastName!: string;
        userImage!: string;  
        coverImagePath!:string;  
        instituteIsFeatured!: boolean;
        instituteDisplayOrder!: number;
        instaPageLink!: string;
        linkedInPageLink!: string;
        facebookPageLink!: string;
}