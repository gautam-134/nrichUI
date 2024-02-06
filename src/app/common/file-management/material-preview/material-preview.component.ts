import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { VideoTimeTrackingVO } from 'src/app/model/VideoTimeTrackingVO';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';

@Component({
  selector: 'app-material-preview',
  standalone: true,
  imports: [],
  templateUrl: './material-preview.component.html',
  styleUrl: './material-preview.component.scss'
})
export class MaterialPreviewComponent {

}
