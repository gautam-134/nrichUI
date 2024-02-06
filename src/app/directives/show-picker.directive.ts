import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[showPicker]'
})
export class ShowPickerDirective {

  @Input('showPicker') isStartDateClick: boolean | undefined;
  constructor(private el: ElementRef) {}

  @HostListener('click')
  onClick() {
    this.showPicker();
  }

  private showPicker() {
    const nativeElement = this.el.nativeElement;
    if (this.isStartDateClick) {
      nativeElement.startDate.showPicker();
    } else {
      nativeElement.endDate.showPicker();
    }
  }

}
