import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent implements OnInit {
  @Input() onBottom = false;
  isOpened = false;
  @ViewChild('container') container: ElementRef<HTMLElement> | undefined;
  @Output() onEmojiSelection = new EventEmitter<string>();
  constructor() {}
  ngOnInit(): void {}

  emojiSelected(event: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // this.emojiInput$?.next(event.emoji.native);
    this.onEmojiSelection.emit(event.emoji.native);
  }

  eventHandler = (event: Event) => {
    // Watching for outside clicks
    if (!this.container?.nativeElement.contains(event.target as Node)) {
      this.isOpened = false;
      window.removeEventListener('click', this.eventHandler);
    }
  };

  toggled() {
    if (!this.container) {
      return;
    }
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      window.addEventListener('click', this.eventHandler);
    } else {
      window.removeEventListener('click', this.eventHandler);
    }
  }
}
