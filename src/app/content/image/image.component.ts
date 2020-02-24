import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import {
    Image, ImageMeta, DEFAULT_IMG_PROPERTIES, ModalEntityConfig
} from '../../core/core';
import {ModalService} from '../../adapters/all';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {

    readonly DEFAULT_IMG_PROPS = DEFAULT_IMG_PROPERTIES;

    public get thumbMeta () : ImageMeta {
        return this.model.thumbSize;
    }
    public get squareMeta () : ImageMeta {
        return this.model.squareLargeSize;
    }

    public showDetails : boolean = false;

    @Input()
    public model: Image;

    constructor(private modalService : ModalService) { }

    public toggleDetails () {
        this.showDetails = !this.showDetails;
    }

    public showSummary () {
        let config : ModalEntityConfig = {
            internalEntitySelector: 'image-summary',
            title: this.model.title
        };
        this.modalService.open(config, {'model': this.model});
    }

}
