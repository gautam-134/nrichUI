import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp } from 'firebase/app';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { CommonModule2 } from './common/common.module';
import { ShowPickerDirective } from './directives/show-picker.directive';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { SingleLoginInterceptor } from './interceptors/single-login.interceptor';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
const firebase = {
  apiKey: "AIzaSyBCqhAfU6KVY8hg1mzUDn5ebiefplaoGcQ",
  authDomain: "nrichnotifications.firebaseapp.com",
  projectId: "nrichnotifications",
  storageBucket: "nrichnotifications.appspot.com",
  messagingSenderId: "244631308103",
  appId: "1:244631308103:web:5648306f7c7d8d0bc7ee62",
  measurementId: "G-ZMHWQ087S5",
  vapidKey:
    'BA5KB40QVpG_VaAdQO2SoWDisUbwhPwTCO-In4mbYKORrsLfQOlP6oorVztGm3dnho7gO6i6J74uhA4ePHMEV9s',
};
initializeApp(firebase);
@NgModule({
  declarations: [AppComponent, EmailVerificationComponent, WhatsappComponent, ShowPickerDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule2,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    CommonModule,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SingleLoginInterceptor,
      multi: true,
    },
    {
      provide: 'VAPID_KEY',
      useValue: firebase.vapidKey,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
