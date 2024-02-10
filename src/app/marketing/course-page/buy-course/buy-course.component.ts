import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';
import { ApiResponse } from '../../../model/ApiResponse';
import { Auth } from '../../../model/Auth';
import { BatchVO } from '../../../model/BatchVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';
import { BuyCourseService } from '../../../services/Buycourse/buy-course.service';

import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-buy-course',
   
  templateUrl: './buy-course.component.html',
  styleUrl: './buy-course.component.scss'
})
export class BuyCourseComponent implements OnInit {
  batches: BatchVO[] = [];
  batch!: BatchVO;
  paymentEnable: boolean = true;
  userId: number | undefined;
  paymentDetails!: paymentDetails;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pricingPlanId: number;
      discountPrice: number;
      price: number;
      paymentType: string;
      courseName: string;
    },
    private courseService: CourseService,
    private loader: LoaderService,
    public dialogRef: MatDialogRef<any>,
    private alertService: SwalAlertService,
    private buyCourseService: BuyCourseService,
    private router: Router,
    // private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.courseService
      .fetchBatches(this.data.pricingPlanId)
      .subscribe((res) => {
        this.batches = res;
      });
  }
  selectedBatch(element: BatchVO) {
    //this.paymentEnable = true;
    this.batch = element;
  }

  buyNow() {
    if (this.batch == undefined) {
      alert('Please select batch');
    }
    if (this.data.paymentType == 'offline') {
      this.loader
        .showLoader(
          this.courseService.offlineEnrollmentApplicationRequest(
            this.batch.idBatch,
            this.data.pricingPlanId
          )
        )
        .subscribe({
          next: (data: ApiResponse) => {
            this.alertService.successAlert(
              'Your Application Request Has Been Sent Successfully !'
            );
            this.dialogRef.close();
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert(error.error.body);
          },
        });
    } else {
      let amount: number;
      if (this.data.discountPrice != null) {
        amount = this.data.discountPrice;
      } else {
        amount = this.data.price;
      }

      if (amount == 0) {
        const obj = {
          idUser: AuthService.getUserId,
          idBatch: this.batch.idBatch,
          status: 'ENROLLED',
          price: this.data.price,
          idPricingPlan: this.batch.idPricingPlan,
        };
        this.loader
          .showLoader(
            this.courseService.enrollStudentToBatch(obj)).subscribe(
              {
                next: (res: any) => {
                  this.alertService.successAlert(
                    'You have been successfully Enrolled in ' + this.data.courseName + '.'
                  );
                  this.router.navigate(['/student/enrollments']);
                  this.dialogRef.close();
                },
                error: (err: any) => {
                  this.alertService.errorAlert(err.error.message);
                }
              }
            );
      } else {
        this.userId = AuthService.getUserId;
        this.loader
          .showLoader(
            this.courseService
              .isStudentEnrolled(this.userId, this.batch.idBatch))
          .subscribe({
            next: (data: any) => {
              this.loader
                .showLoader(
                  this.buyCourseService
                    .crateOrder(amount, AuthService.getUserId, this.batch.idBatch))
                .subscribe({
                  next: (res: any) => {
                    this.options.amount = amount;
                    this.options.currency = res.orderDetails.currency;
                    this.options.order_id = res.orderDetails.id;
                    this.options.name = res.instituteName;
                    this.options.image = res.instituteImage;
                    this.options.prefill.name = AuthService.getUserFirstName;
                    this.options.prefill.contact = AuthService.getMobileNumber;
                    this.options.prefill.email = AuthService.email;
                    this.options.description = this.batch.batchDescription;
                    var rzp1 = new Razorpay(this.options);
                    rzp1.open();
                    rzp1.on('payment.error', (response: any) => {
                      this.alertService.errorAlert(response.error.description);
                      this.paymentFailed(
                        response.error.metadata.order_id,
                        response.error.metadata.payment_id
                      );
                    });
                  },
                  error: (error: any) => {
                    this.alertService.errorAlert(error.error.message
                    );
                    //  this.alertService.errorAlert("Bad Payment credentials. Please contact the concern authority");
                  }
                });
            },
            error: (error: any) => {
              this.alertService.successAlert(
                'You are Already enrolled in ' +
                this.batch.batchName + ' batch of' +
                ' <b>' +
                this.data.courseName +
                '</b>' + '.'
              );
              this.dialogRef.close();
            }
          });
      }
    }
  }

  paymentFailed(order_id: string, payment_id: string) {
    this.paymentDetails.razorpay_order_id = order_id;
    this.paymentDetails.razorpay_payment_id = payment_id;
    this.buyCourseService.paymentFailed(this.paymentDetails).subscribe(
      (data: any) => {

      },
      (error: any) => {

      }
    );
  }


  options = {
    amount: 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: 'INR',
    name: 'Nrich Learning',
    description: 'Test Transaction',
    image: 'https://nrichlearning.com/assets/assets/images/nrich_logo.svg',
    order_id: '', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: (response: any) => {
      this.loader
        .showLoader(
          this.buyCourseService.paymentDone({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })
        )
        .subscribe({
          next: (res) => {
            // const obj = {
            //   idUser: AuthService.getUserId,
            //   idBatch: this.batch.idBatch,
            //   status: 'ENROLLED',
            //   price: this.data.price,
            //   idPricingPlan: this.batch.idPricingPlan,
            // };
            this.alertService.successAlert(
              'You have been successfully Enrolled in ' + this.data.courseName + '.'
            );

            if (JSON.parse(
              localStorage.getItem('auth') as string
            )?.role?.roleType == 'Student' && +AuthService.getInstituteId == 1) {
              const selectedInstitute = res;

              const auth: Auth = JSON.parse(localStorage.getItem('auth') || '{}');
              auth.role.roleType = selectedInstitute?.roleType;
              auth.selectedInstitute = selectedInstitute?.instituteId;
              localStorage.setItem('auth', JSON.stringify(auth));
              // this.authService.loggedInSubject.next(true);
            }
            this.router.navigate([`${AuthService.getModulePrefix}/enrollments`]);
            this.dialogRef.close();
            //   this.loader.showLoader(
            //   this.courseService.enrollStudentToBatch(obj)).subscribe(
            //     (resp: any) => {
            //        this.alertService.successAlert(
            //         'You have been successfully Enrolled in ' + this.data.courseName +'.'
            //       );
            //       this.router.navigate([`${AuthService.getModulePrefix}/enrollment`]);
            //       this.dialogRef.close();
            //     },
            //     (err) => {
            //       this.alertService.errorAlert(
            //         'Payment is successful but problem in enrollment of course. Please contact '+this.options.name +'.',
            //       );
            //     }
            //   );
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.errorAlert('Payment not done');
          }
        }
        );
    },
    prefill: {
      name: 'test',
      email: 'xyz@gmail.com',
      contact: '1234567899',
    },
    notes: {
      address: 'Nrich Learning',
    },
    theme: {
      color: '#3399cc',
    },
  };
}

export interface Order {
  amount: number;
  amount_paid: number;
  notes: any;
  created_at: number;
  amount_due: number;
  currency: string;
  receipt: string;
  id: string;
  entity: string;
  offer_id?: any;
  status: string;
  attempts: number;
}

export interface paymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
}
