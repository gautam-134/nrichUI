import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Import routes from app.routes.ts

@NgModule({
  declarations: [
    AppComponent
    // ... other components declarations
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // Import RouterModule with your routes
    // ... other modules imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
