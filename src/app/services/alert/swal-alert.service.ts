import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalAlertService {
  constructor() {}

  errorAlert(subTitle: string) {
    Swal.fire({
      title:
        '<p style="font-weight: 700;font-size: 60.9231px;color: #FF635F;margin-bottom: -16px;margin-top: -50px;">Error!</p>',
      html: '<p style="margin: 0px">' + subTitle + '</p>',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Error',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Try Again',
    });
  }

  okErrorAlert(title: string) {
    Swal.fire({
      title:
        '<p style="font-weight: 600;font-size: 34px;color: #FF635F;margin-bottom: -16px;margin-top: -50px;">' +
        title +
        '</p>',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'error',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'OK',
    });
  }

  successAlert(subTitle?: string) {
    return Swal.fire({
      html:
        '<p style="margin: 0% 15% 0% 15%;font-weight: 300;font-size: 18px;color: #4A4A4A;">' +
        subTitle +
        '</p>',
      imageUrl: 'assets/alerts/success.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#029EF2',
      confirmButtonText: 'OK',
    });
  }

  buttonSuccessAlert(subTitle: string, buttonText: string) {
    return Swal.fire({
      html:
        '<p style="margin: 0% 15% 0% 15%;font-weight: 300;font-size: 18px;color: #4A4A4A;">' +
        subTitle +
        '</p>',
      imageUrl: 'assets/alerts/success.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#029EF2',
      confirmButtonText: buttonText,
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
    });
  }

  buttonSuccessAlertOnly(subTitle: string, buttonText: string) {
    return Swal.fire({
      html:
        '<p style="margin: 0% 15% 0% 15%;font-weight: 300;font-size: 18px;color: #4A4A4A;">' +
        subTitle +
        '</p>',
      imageUrl: 'assets/alerts/success.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#029EF2',
      confirmButtonText: buttonText,
      showCancelButton: false,
      cancelButtonColor: 'lightgrey',
    });
  }

  buttonErrorAlert(subTitle: string, buttonText: string) {
    return Swal.fire({
      html:
        '<p style="margin: 0% 15% 0% 15%;font-weight: 300;font-size: 18px;color: #4A4A4A;">' +
        subTitle +
        '</p>',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#FF635F',
      confirmButtonText: buttonText,
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
    });
  }
}
