import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { Subject } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { BlogsVO } from '../../model/BlogsVO';
import { TeachersList } from '../../model/feature-home-teacher.model';
import { InstituteDetails } from '../../model/institute-details';
import { MobileCourseVO } from '../../model/MobileCourseVO';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common/common.service';
import { InstituteService } from '../../services/institute/institute.service';

@Component({
  selector: 'app-institute-page',
   
  templateUrl: './institute-page.component.html',
  styleUrl: './institute-page.component.scss'
})
export class InstitutePageComponent implements OnInit {
  @ViewChild('slickModal', { static: true })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;
  id: any;
  instituteName: any;
  instituteDetails!: InstituteDetails;
  courseList: MobileCourseVO[] = [];
  teacherlist: TeachersList[] = [];
  form: UntypedFormGroup;
  isSubmit: boolean = false;
  totalCount!: number;
  metatages!: any[];
  selectedValue: string = 'InstituteProfile';
  blogsList: BlogsVO[] = [];
  page: number = 0;
  size: number = 6;
  subject = new Subject<string>();
  searchParam: string = '';
  coverImage: string = '';
  instituteImageLogoSrc: string = 'assets/svg/logo.svg';
  instituteImageSrc: string = 'assets/images-marketing/institute_shadow.png';
  constructor(
    private instituteService: InstituteService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    private loader: LoaderService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      inquiry: ['', Validators.required],
      teacherName: [null],
      teacherId: [null],
      courseId: [null],
      courseName: [null, Validators.required],
      email: [null],
      userId: [null],
      instituteId: [null],
    });
  }
  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
  }

  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }

  private setTitle(name: string) {
    this.titleService.setTitle(name);
  }

  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.titleService.setTitle('Nrich Learning');
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.instituteName = params['name'];
        this.instituteService.fetchInstitute(this.id).subscribe((data: any) => {
          this.instituteDetails = data.body;
          this.instituteDetails.instituteName = data.body.name;

          if (this.instituteDetails.image)
            this.instituteImageSrc = this.instituteDetails.image;
          // if sun domain institute id != 1 and instituteDetails.image is present
          this.authService.subDomainInstitute.subscribe({
            next: (subDomainInstId: number) => {
              if (subDomainInstId !== 1 && this.instituteDetails.instituteName) {
                this.authService.subDomainInstituteName.next(
                  this.instituteDetails.instituteName
                );
              }
              if (subDomainInstId !== 1 && this.instituteDetails.image) {
                this.authService.marketingHeaderLogo.next(
                  this.instituteDetails.image
                );
              }
            },
          });
          this.coverImage = this.instituteDetails.coverImage;
          this.setTitle(data.body.name);
          if (data.body?.tags !== null) {
            this.metatages = data.body.tags;
            this.setMetaTags({
              name: 'tags',
              content: this.metatages.toString(),
            });
          }
        });
        this.loader
          .showLoader(this.instituteService.fetchInstituteTeacherList(this.id))
          .subscribe((data: any) => {
            this.teacherlist = data.body.teachers;
            this.totalCount = data.total_count;
          });
        this.loader
          .showLoader(this.instituteService.fetchInstituteCourseList(this.id))
          .subscribe((data: any) => {
            this.courseList = data.body.courses;
            this.totalCount = data.total_count;
          });
      }
    });

    this.fetchInstituteBlogs(this.page);
  }

  fetchInstituteBlogs(page: number) {
    this.commonService
      .fetchInstituteBlogs(page, this.size, this.id, this.searchParam)
      .subscribe((res: any) => {
        this.blogsList = res.blogsList;
        this.totalCount = res.totalCount;
      });
  }

  viewAllCourses() {
    if (this.id) {
      this.router.navigate(['/course-list'], {
        queryParams: {
          search: 'instituteCourses',
          id: this.id,
        },
      });
    }
  }

  viewAllTutors() {
    if (this.id) {
      this.router.navigate(['/educator-list'], {
        queryParams: {
          search: 'instituteEducators',
          id: this.id,
        },
      });
    }
  }

  nextPage($event: any, el: HTMLElement) {
    this.page = $event;
    this.fetchInstituteBlogs(this.page);
    el.scrollIntoView();
  }

  // submit() {
  //   if (this.form.invalid) {
  //     this.isSubmit = true;
  //     return;
  //   }
  //   this.form.get('instituteId')?.setValue(this.instituteDetails.idInstitution);
  //   this.teacherservices.saveInquiry(this.form.value).subscribe((data: any) => {
  //     this.form.reset();
  //   });
  // }

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 2,
    dots: false,
    arrows: false,
    vertical: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  slickInit(_e: any) { }

  breakpoint(_e: any) { }

  afterChange(_e: any) {
    this.lazyLoading = false;
  }

  beforeChange(_e: any) { }
  next() {
    this.slickModal.slickNext();
  }
  prev() {
    this.slickModal.slickPrev();
  }
  get controls() {
    return this.form.controls;
  }
  submit() {
    if (this.form.invalid) {
      this.isSubmit = true;
      return;
    }
    this.form.get('instituteId')?.setValue(this.instituteDetails.idInstitution);
    this.commonService.saveInquiry(this.form.value).subscribe((data: any) => {
      this.form.reset();
    });
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
