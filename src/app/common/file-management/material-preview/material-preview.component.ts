import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiResponse } from '../../model/ApiResponse';
import { VideoTimeTrackingVO } from '../../model/VideoTimeTrackingVO';
import { PreRecordedModuleService } from '../../services/pre-recorded-module.service';

@Component({
  selector: 'app-material-preview',
   
  templateUrl: './material-preview.component.html',
  styleUrl: './material-preview.component.scss'
})
export class MaterialPreviewComponent {
  [x: string]: any;

}
