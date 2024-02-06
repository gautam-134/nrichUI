import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appscrollablediv]',
})
export class ScrollableDivDirective implements AfterViewInit {
  @Input() heightinpx!: string;

  constructor(private elementRef :ElementRef, private renderer: Renderer2) {
   
  }

  ngAfterViewInit() {
    const divElement = this.elementRef.nativeElement;
    this.renderer.setStyle(divElement, 'height',this.heightinpx);
    this.renderer.setStyle(divElement,'overflow','auto')
  }
}
