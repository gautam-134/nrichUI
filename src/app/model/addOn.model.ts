export interface addOnPlan {
    id: number;
    addOnPlanName: string;
    price: number;
    discountPrice: number;
    allowedStudents: number;
    allowedStorage: number;
    allowedTeachers: number;
    allowedConcurrentClasses: number;
    displayOrder: number;
    createdDate: Date;
    endDate: string;
    startDate: string;
    noOfDays:number
    zoomAllowed:boolean
    features: addOnPlanFeatures[];
    sac:number
  }
  export interface addOnPlanFeatures {
    id: number;
    featureDescription: string;
    displayOrder: number;
  }