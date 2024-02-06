import {
  Component,
  OnInit,
  Inject,
  Input,
  Optional,
  HostListener,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { VideoTimeTrackingVO } from 'src/app/model/VideoTimeTrackingVO';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements OnInit, OnChanges {
  @Input() path!: string;
  @Input() type!: string;
  @Input() selectedMaterialId!: number;
  isFullScreen: boolean = false;
  @Output() videoStopped = new EventEmitter<number>();
  videoResumeTime!: number;
  videoTimeTracking!:VideoTimeTrackingVO;
  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { path: string; type: string; selectedMaterialId: number },
    private preRecordedModuleService: PreRecordedModuleService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.path = this.data.path;
      this.type = this.data.type;
      this.selectedMaterialId = this.data.selectedMaterialId;
    }
  }

  ngOnChanges(): void {
    if (this.selectedMaterialId) {
      this.preRecordedModuleService.fetchVideoLastResumeTime(this.selectedMaterialId,'PRERECORDED').subscribe({
        next: (data: ApiResponse) => {
          this.videoTimeTracking = data.body;
          this.videoResumeTime=this.videoTimeTracking.videoResumeTime;
        },
      });
    }
  }

  onVideoStopped(videoTime: any) {
    this.videoResumeTime = videoTime;
    this.videoStopped.emit(this.videoResumeTime);
  }

  showVideoInFullScreen(id: string) {
    const fullScreenElemmentContainer = document.getElementById(id);
    if (this.isFullScreen) {
      document.exitFullscreen();
      return;
    }
    if (fullScreenElemmentContainer?.requestFullscreen) {
      fullScreenElemmentContainer?.requestFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(event: Event) {
    this.isFullScreen = !this.isFullScreen;
  }
}