
export interface quiz {
  id: number;
  name: string;
  teacherName: string;
  marks: number;
  createdOn: Date;
  sections: any;
  startTime: Date;
  endTime: Date;
  teacherId: number;
  list: any;
}

export class QuizUpdate {
  id!: number;
  name!: string;
  examName!: string;
  teacherName!: string;
  marks!: number;
  sections!: sections[];
  startTime!: Date;
  obtainedMarks!: number;
  endTime!: Date;
  examDuration!: number;
  hour!: number;
  minutes!: number;
  examType!: string;
  instituteId!: number;
  negtiveMarking!: boolean;
  negtiveMarks!: number;
  list!: any;
}

export class sections {
  id!: number;
  sectionTitle!: string;
  sectionDescription!: string;
  displayOrder!: number;
  questions!: questions[];
}

export class questions {
  id!: number;
  questionTitle!: string;
  questionType!: string;
  questionImage!: string;
  questionImagePath!:string;
  displayOrder!: number;
  answers!: answers[];
  options!: options[];
  answer!: string;
  marks!: number;
  correctAnswer!: number;
  studentSubmittedAnswerId!: number;
  remarks!: string;
}

export class answers {
  id!: number;
  displayOrder!: number;
  optionImagePath!:string;
  optionImage!: string;
  optionTitle!: string;
  optionType!:string;
  right!: boolean;
}

export class options {
  id!: number;
  displayOrder!: number;
  optionTitle!: string;
  optionImagePath!:string;
  optionImage!: string;
  optionType!:string;
  is_right!: boolean;
}
