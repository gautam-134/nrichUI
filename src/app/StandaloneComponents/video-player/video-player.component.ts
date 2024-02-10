import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-video-player',
   
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() path!: string;
  @Input() videoResumeTime!: number;
  @Input() materialId!: number;
  isVideoPlaying: boolean = false;
  mobileNumber!: string;
  handleCssChangeAtRuntime: boolean = false;
  isFullScreen: boolean = false;
  intervalId!: any;
  @Output() videoStopped = new EventEmitter<number>();
  @Input() pIndex!: number;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  private static playingVideo: HTMLVideoElement | null = null;
  constructor() {}

  ngOnInit(): void {
    this.mobileNumber = AuthService.getMobileNumber;
    this.startInterval();
  }

  getVideoElementId() {
    return `liveClassVideo${this.materialId}`;
  }

  onVideoTagFullScreen(event: Event) {
    this.isFullScreen = !this.isFullScreen;

    if (this.isFullScreen) {
      this.pauseVideo();
    }
  }

  playVideoAtLastStopedTime() {
    // Pause the previously played video
    if (VideoPlayerComponent.playingVideo) {
      VideoPlayerComponent.playingVideo.pause();
      this.isVideoPlaying = false;
    }

    const video = document.getElementById(`liveClassVideo${this.materialId}`) as HTMLVideoElement;
    if (this.videoResumeTime) {
      video.currentTime = this.videoResumeTime;
      video.play();
      this.isVideoPlaying = true;
      VideoPlayerComponent.playingVideo = video;
    }
  }
  showVideoInFullScreen() {
    const videoContainer = document.getElementById('video-container' + this.pIndex);
    if (this.isFullScreen) {
      document.exitFullscreen();
      this.isVideoPlaying = false; // Pause the video when exiting fullscreen
    } else {
      if (videoContainer?.requestFullscreen) {
        videoContainer?.requestFullscreen();
        this.isVideoPlaying = true; // Play the video when entering fullscreen
      }
    }
  }
  pauseVideo() {
    const video = this.videoPlayer.nativeElement as HTMLVideoElement;
    if (video) {
      video.pause();
      this.isVideoPlaying = false;
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
    if (!this.isFullScreen) {
      this.isVideoPlaying = false; // Pause the video when exiting fullscreen
    }
  }
  
  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    const video = document.getElementById(
      `liveClassVideo${this.materialId}`
    ) as HTMLVideoElement;
    const updatedTime = video.currentTime;
    this.videoStopped.emit(updatedTime);
  }

  saveLastStoppedTime() {
    const video = document.getElementById(
      `liveClassVideo${this.materialId}`
    ) as HTMLVideoElement;
    video.pause();
    const updatedTime = video.currentTime;
    if (video.paused || video.ended) {
      this.videoStopped.emit(updatedTime);
    }
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    const video = document.getElementById(
      `liveClassVideo${this.materialId}`
    ) as HTMLVideoElement;
    const updatedTime = video.currentTime;
    this.videoStopped.emit(updatedTime);
  }
}

