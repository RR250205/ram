import { Directive, ElementRef, Renderer2, OnInit, HostListener, ViewChild } from '@angular/core';

@Directive({
    selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
    @ViewChild("preActivity", { read: ElementRef }) preActivity: ElementRef;
    athleteID: any;
    numberOfClicks = 0;
    constructor(private elRef: ElementRef, private renderer: Renderer2) {
        // this.colorChooser();
    }

    ngOnInit() {
        let input = this.elRef.nativeElement.querySelector('div');
        console.log(input);
    }
    @HostListener('click') mouseclick(event: Event) {
        this.renderer.setStyle(this.elRef.nativeElement, 'background-color', '#d1ecfd');
    }
    ngAfterViewInit(): void {
        // outputs `I am span`
        console.log(this.preActivity.nativeElement.textContent);
    }

}
