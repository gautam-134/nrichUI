import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { BannerVO } from 'src/app/model/BannerVO';
import { CourseCategoryVO } from 'src/app/model/categories.model';
import { BannerService } from 'src/app/services/banner/banner.service';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
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
