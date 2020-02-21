import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Image, ImageMeta, DEFAULT_IMG_PROPERTIES } from '../../core/core';


@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {
    readonly DEFAULT_IMG_PROPS = DEFAULT_IMG_PROPERTIES;

    public get thumbMeta () : ImageMeta {
        return this.model.thumbSize;
    }
    public get squareMeta () : ImageMeta {
        return this.model.squareLargeSize;
    }

    public showDetails : boolean = false;

    public toggleDetails () {
        this.showDetails = !this.showDetails;
    }

    constructor() { }

    @Input() model: Image;

    ngOnInit() {
}

}
