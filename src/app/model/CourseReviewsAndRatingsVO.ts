export interface CourseReviewsAndRatingsVO {
  id: number;
  userId: number;
  courseId: number;
  rating: number;
  review: string;
  date: Date;
  userName: string;
  userImage:string;
}

export interface CourseReviewsAndRatingsRes {
  body: CourseReviewsAndRatingsVO[];
}
