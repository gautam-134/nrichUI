export interface CourseCategoryVO {
  id: number;
  idCourseCategory: number;
  categoryName: string;
  categoryImage: string;
  categoryDescription: string;
  displayOrder: number;
  isFeatured: boolean;
  isPrivate: boolean;
  categoryImagePath: String;
  subCategoryId:number;
  subsubCategoryId:number;
  subCategoryName:string;
  createdDate: Date
}

export interface Data {
  courseCategoryVO: CourseCategoryVO[];
  subCategories: any[];
  subSubCategories: any[];
}

export interface FetchCategories {
  data: Data;
}
