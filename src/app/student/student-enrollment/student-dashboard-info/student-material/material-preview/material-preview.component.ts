import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-material-preview',
   
  templateUrl: './material-preview.component.html',
  styleUrl: './material-preview.component.scss'
})
export class MaterialPreviewComponent implements OnInit {

  filePath:string=''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { element: any },
    public dialogRef: MatDialogRef<any>
  ) {}

  ngOnInit(): void {
    this.filePath=AuthService.getFilePath
  }
}
