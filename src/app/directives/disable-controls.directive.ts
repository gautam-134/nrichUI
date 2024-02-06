import { Directive, Input, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[appDisableControls]',
})
export class DisableControlsDirective implements OnChanges {
  @Input('appDisableControls')
  disable!: boolean;
  constructor(private _el: ElementRef) {}
  ngOnChanges(): void {
    if (this.disable) {
      this._el.nativeElement.disabled = true;
      return;
    }
    this._el.nativeElement.disabled = false;
  }
}
