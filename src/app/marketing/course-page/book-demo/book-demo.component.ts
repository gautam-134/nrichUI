import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LoaderService } from 'src/app/loader.service';

import { DemoClass } from 'src/app/model/DemoClass';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-book-demo',
  standalone: true,
  imports: [],
  templateUrl: './book-demo.component.html',
  styleUrl: './book-demo.component.scss'
})
export class BookDemoComponent implements OnInit {
  @Input('demoClasses') demoClasses: DemoClass[] = [];
  @Input('courseName') courseName: string | undefined;
  @Output() refreshDemoClassList = new EventEmitter<void>();
  isLogin: boolean = false;
  form!: UntypedFormGroup;
  submitted: boolean = false;
  classId!: number;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal!: ElementRef;
  constructor(
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    private loaderService: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.isLogin = this.authService.isLoggin();
    this.form = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  bookDemoClass() {
    this.submitted = true;
    if (this.form.status == 'INVALID') {
      return;
    }
    this.loaderService
      .showLoader(
        this.courseService.bookDemoClass({
          classId: this.classId,
          description: this.form.get('remarks')?.value,
          courseName: this.courseName,
        })
      )
      .subscribe(
        (res: any) => {
          this.refreshDemoClassList.emit();
          this.alertService.successAlert(res.message);
          this.closeAddExpenseModal.nativeElement.click();
        },
        (error: HttpErrorResponse) => {
          alert('something went wrong');
        }
      );
  }
}
