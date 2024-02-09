export class CourseBatchMapVO {
  id!: number;
  name!: string;
  selected!: boolean;
  preSelected!: boolean;
  batches!: BatchMapping[];
}

export class BatchMapping {
  id!: number;
  name!: string;
  selected!: boolean;
  preSelected!: boolean;
}

export class ClassMappingVO {
  idClassSchedule!: number;
  className!: string;
  batchName!: string;
  courseName!: string;
  classStartDate!: string;
  selected!: boolean;
  materialId!: number;
  instituteId!: number;


}
