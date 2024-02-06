import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCharacterLimit]',
})
export class CharacterLimitDirective {
  @Input('appCharacterLimit') characterLimit: string = '';

  constructor(private elementRef: ElementRef) {}

  @HostListener('input')
  onInput() {
    const value: string = this.elementRef.nativeElement.value;
    if (value.length > +this.characterLimit) {
      this.elementRef.nativeElement.value = value.substring(
        0,
        +this.characterLimit
      );
    }
  }
}
