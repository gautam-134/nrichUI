export class PrerecordedModuleVO {
  id!: number;
  moduleName!: string;
  instituteId!: number;
  createdDate!: Date;
  submitted!: boolean;
  overAllMaterialUploadingCount!: number;
  prerecordedSectionVOs: PrerecordedSectionVO[] = [];
}

export class PrerecordedSectionVO {
  id!: number;
  sectionName!: string;
  displayOrder!: number;
  prerecordedModuleId!: number;
  overAllProgress!: number;
  materialUploadingCount!: number;
  prerecordedMaterialVOs: PrerecordedMaterialVO[] = [];
}

export class PrerecordedMaterialVO {
  id!: number;
  name!: string;
  description!: string;
  displayOrder!: number;
  type!: string;
  fileName!: string;
  progress!: string;
  prerecordedSectionId!: number;
}

export class MaterialUploadingCount {
  sectionId!: number;
  count!: number;
  constructor(sectionId: number, count: number) {
    this.sectionId = sectionId;
    this.count = count;
  }

  
}

export class VideoTimeTracking {
  id!: number;
  materialId!: number;
  userId!: number;
  videoResumeTime!: number;
  totalWatchedTime!: number;
  createdDate!: Date;
  updatedDate!: Date;
  materialType!:string;
}




