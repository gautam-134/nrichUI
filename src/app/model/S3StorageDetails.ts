export class S3StorageDetails {
  bucketSize!: number;
  vacantSpace!: number;
  usedSpace!: number;
  uploadedFiles!: S3FileInfo[];
  nextContinuationToken!:string;
  continuationToken!:string
  previousToken!:string
}

export class S3FileInfo {
  bucketName!: string;
  key!: string;
  lastModifiedDate!: Date;
  size!: number;
  etag!: string;
  filePath!: string;
  selected!: boolean;
  materialType!:string;
}
