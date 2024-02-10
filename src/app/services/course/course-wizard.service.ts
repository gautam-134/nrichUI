import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BatchVO } from '../../model/BatchVO';
import { Course } from '../../model/Course';
import { PricingPlanVO } from '../../model/PricingPlanVO';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class CourseWizardService implements OnInit {
  edit: boolean = false;
  tabSubject$ = new BehaviorSubject<number>(1);
  teachers: { id: number; name: string; image: string; userId: number }[] = [];
  courseSubject$ = new BehaviorSubject<boolean>(false);
  planSubject$ = new BehaviorSubject<PricingPlanVO | boolean>(true);
  batchSubject$ = new BehaviorSubject<BatchVO | boolean>(true);
  tab: number = 0;
  private course!: Course;
  constructor(private router: Router) {}
  ngOnInit(): void {}
  enableEditMode(edit: boolean) {
    this.edit = edit;
  }

  nextFromTab(tab: number) {
    if (this.edit || this.tab >= tab) {
      if (tab == 3 && this.getPricingPlans.length == 0) {
        return;
      }
      this.tabSubject$.next(tab);
      this.tab = tab;
    }
  }

  next(tab: number) {
    this.tab = tab;
    this.tabSubject$.next(tab);
  }

  setCourse(course: Course) {
    this.course = course;
  }
  get getCourse() {
    return this.course;
  }

  get getPricingPlans(): PricingPlanVO[] {
    return this.course?.pricingPlans;
  }

  get getBatches(): BatchVO[] {
    return this.course?.batches;
  }

  addBatch(batch: BatchVO) {
    this.course.batches.push(batch);
    Swal.fire({
      title: 'Do you want to continue to class configuration?',
      showDenyButton: true,
      confirmButtonText: 'Continue',
      denyButtonText: `Skip`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl(`${AuthService.getModulePrefix}/classes`);
      }
    });
  }

  editBatch(batch: BatchVO) {
    this.course.batches[
      this.course.batches.findIndex((b) => batch.idBatch == b.idBatch)
    ] = batch;
  }

  deleteBatch(index: number) {
    this.course.batches.splice(index, 1);
  }

  addPricingPlan(plan: PricingPlanVO) {
    this.course.pricingPlans.push(plan);
  }

  updatePricingPlan(plan: PricingPlanVO) {
    const index = this.course.pricingPlans.findIndex(
      (p) => plan.idPricingPlan === p.idPricingPlan
    );

    if (index !== -1) {
      this.course.pricingPlans[index] = plan;
    }
  }

  deletePricingPlan(i: number) {
    this.course.pricingPlans.splice(i, 1);
  }

  setTeachers(teachers: any[]) {
    this.teachers = teachers;
  }

  get getTeachers() {
    return this.teachers;
  }
}
