import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-document-preview',
  standalone: true,
  imports: [],
  templateUrl: './assignment-document-preview.component.html',
  styleUrl: './assignment-document-preview.component.scss'
})
export class AssignmentDocumentPreviewComponent implements OnInit {

  isPdf = false;

  constructor(private dialogRef: MatDialogRef<AssignmentDocumentPreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    imgUrl: string;
    isPdf:boolean
  }) { }

  ngOnInit(): void {
    if(this.data.isPdf) {
      this.isPdf = true
    }
  }
  removeDialog() {
    this.dialogRef.close();
  }

}