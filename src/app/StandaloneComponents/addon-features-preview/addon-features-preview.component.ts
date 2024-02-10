import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addon-features-preview',
   
  templateUrl: './addon-features-preview.component.html',
  styleUrl: './addon-features-preview.component.scss'
})
export class AddonFeaturesPreviewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { features: string[] },
    private dialogRef: MatDialogRef<AddonFeaturesPreviewComponent>
  ) {}

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
