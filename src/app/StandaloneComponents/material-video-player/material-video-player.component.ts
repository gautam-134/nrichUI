import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-material-video-player',
  standalone: true,
  imports: [],
  templateUrl: './material-video-player.component.html',
  styleUrl: './material-video-player.component.scss'
})
export class MaterialVideoPlayerComponent implements OnInit {
  @Input() path!: string;
  @Input() videoResumeTime!: number;
  @Input() materialId!:number;
  mobileNumber!: string;
  handleCssChangeAtRuntime: boolean = false;
  isFullScreen: boolean = false;
  intervalId!: any;
  @Output() videoStopped = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {
    this.mobileNumber = AuthService.getMobileNumber;
    this.startInterval();
  }

  getVideoElementId() {
    return `liveClassVideo${this.materialId}`;
  }

  // ngOnChanges(): void {
  //   this.playVideoAtLastStopedTime();
  // }

  onVideoTagFullScreen(event: any) {
    document.exitFullscreen();
  }

  playVideoAtLastStopedTime() {
    const video = document.getElementById(`liveClassVideo${this.materialId}`) as HTMLVideoElement;
    if (this.videoResumeTime) {
      video.currentTime = this.videoResumeTime;
      video.play();
    }
  }

  showVideoInFullScreen() {
    const videoContainer = document.getElementById('video-container');
    if (this.isFullScreen) {
      document.exitFullscreen();
      return;
    }
    if (videoContainer?.requestFullscreen) {
      videoContainer?.requestFullscreen();
    }
  }

  startInterval() {
    this.intervalId = setInterval(() => {
      this.handleCssChangeAtRuntime = !this.handleCssChangeAtRuntime;
    }, 2000);
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(event: Event) {
    this.isFullScreen = !this.isFullScreen;
  }
  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    const video = document.getElementById(`liveClassVideo${this.materialId}`) as HTMLVideoElement;
    const updatedTime = video.currentTime;
    this.videoStopped.emit(updatedTime);
  }

  saveLastStoppedTime() {
    const video = document.getElementById(`liveClassVideo${this.materialId}`) as HTMLVideoElement;
    const updatedTime = video.currentTime;
    video.pause();
    if (video.paused || video.ended) {
      this.videoStopped.emit(updatedTime);
    }
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    const video = document.getElementById(`liveClassVideo${this.materialId}`) as HTMLVideoElement;
    const updatedTime = video.currentTime;
    this.videoStopped.emit(updatedTime);
  }
}