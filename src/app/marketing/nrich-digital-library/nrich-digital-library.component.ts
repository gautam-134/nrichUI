import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nrich-digital-library',
   
  templateUrl: './nrich-digital-library.component.html',
  styleUrl: './nrich-digital-library.component.scss'
})
export class NrichDigitalLibraryComponent implements OnInit {

  selectedValue:string="DigitalLibrary";
  constructor() { }

  ngOnInit(): void {
  }

}