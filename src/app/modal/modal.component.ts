import {
    Component, ChangeDetectionStrategy, ChangeDetectorRef,
    ElementRef, ViewChild, ViewContainerRef, Inject
} from '@angular/core';
import { ModalEntityConfig} from '../core/core';
import { ModalService, DCL } from '../adapters/all';

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {

    @ViewChild('target', { read: ViewContainerRef })
    public target: ViewContainerRef;

    public config: ModalEntityConfig;

    public inputs : {[key:string] : any};

    public title: string;

    public css: string;

    constructor(private modalService: ModalService, private componentLoader: DCL) {}

    public close() {
        this.modalService.close();
    }

    public ngOnInit() {
        this.css = this.config.css || '';
        this.title = this.config.title || '';
    }

    public ngAfterViewInit() {
        this.componentLoader.load(this.target, this.config.internalEntitySelector,
            this.inputs);
    }

}
