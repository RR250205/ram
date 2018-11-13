import { Directive, ElementRef, Renderer2, OnInit, HostListener } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Directive({
    selector: '[appBackHighlight]'
})
export class BackHighlightDirective implements OnInit {
    athleteID: any;
    numberOfClicks = 0;
    constructor(private elRef: ElementRef, private renderer: Renderer2) {
        // this.colorChooser();
    }

    ngOnInit() {
        // console.log(jQuery(".m-widget3__user-img").length);
        jQuery('.m-widget3__user-img').click(function() {

            jQuery('.m-widget3__user-img').each(function(i, e) {
                $(e).css('background-color', '#f4f5f8');
            });
            // $(this).css('background-color','#d1ecfd');
        });
        jQuery('.m-widget3__user-img1').click(function() {

            jQuery('.m-widget3__user-img1').each(function(i, e) {
                $(e).css('background-color', '#f4f5f8');
            });
            // $(this).css('background-color','#d1ecfd');
        });
        jQuery('.m-widget3__user-img2').click(function() {

            jQuery('.m-widget3__user-img2').each(function(i, e) {
                $(e).css('background-color', '#f4f5f8');
            });

            // $(this).css('background-color','#d1ecfd');
        });
    }
}
