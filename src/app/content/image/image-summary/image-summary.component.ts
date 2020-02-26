import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Image, ImageMeta } from '../../../core/core';

@Component({
  selector: 'image-summary',
  templateUrl: './image-summary.component.html',
  styleUrls: ['./image-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageSummaryComponent implements OnInit {

    public model : Image;

    public get fullSizeMeta () : ImageMeta {
        return this.model.modalSize;
    }

    constructor() { }

    ngOnInit() {
    }

}
