export class PostVO {
  id!: number;
  name!: string;
  profileImage!: string;
  postText!: string;
  visibility!: string;
  type!: string;
  isSponsored!: boolean;
  instituteId!: number;
  roleType!: string;
  createdBy!: number;
  createdDate!: Date;
  likesCount!: number;
  likedByYou!: boolean;
  postMediaVOs!: PostMediaVO[];
  postCommentsVOs!: PostCommentsVO[];
}

export class PostMediaVO {
  id!: number;
  mediaType!: string;
  originalMediaName!: string;
  mediaName!: string;
  displayOrder!: number;
}

export class PostCommentsVO {
  id!: number;
  comment!: string;
  name!: string;
  profileImage!: string;
  userProfileId!: number;
  createdDate!: Date;
}
