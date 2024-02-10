import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';
import { BannerVO } from '../../../model/BannerVO';
import { CourseCategoryVO } from '../../../model/categories.model';
import { BannerService } from '../../../services/banner/banner.service';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-categories',
   
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: CourseCategoryVO[] = [];
  firstCategory!: CourseCategoryVO;
  banners: BannerVO[] = [];
  @Input('bannerType') bannerType!:string;
  constructor(
    private courseService: CourseService,
    private loader: LoaderService,
    private router: Router,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.loader
      .showLoader(this.courseService.fetchFeatureCategoryList(false))
      .subscribe((res) => {
        this.categories = res;
        if (this.categories.length > 0) this.firstCategory = this.categories[0];
      });

    this.fetchBanners();
  }

  fetchBanners() {
    this.bannerService.getBannersByLocation(this.bannerType).subscribe({
      next: (data: BannerVO[]) => {
        this.banners = data;
      },
    });
  }

  viewAll() {
    this.router.navigate(['/categories/subCategories'], {
      queryParams: {
        id: this.firstCategory.idCourseCategory,
        name: this.firstCategory.categoryName,
      },
    });
  }

  redirect(banner: BannerVO) {
    this.router.navigate([banner.redirectPath], {
      queryParams: { id: banner.redirectId, name: banner.name },
    });
  }
}
