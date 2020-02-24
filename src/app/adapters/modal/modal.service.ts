import { Injectable, ComponentFactory } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalEntityConfig } from '../../core/core';
import { DCL } from '../dcl/all';

@Injectable()
export class ModalService {

    private modalComponentInstance : any;
    private bsModalRef: BsModalRef;

    private destroyModalComponent(): void {
        if (this.bsModalRef) {
            this.bsModalRef.hide();
        }
        this.modalComponentInstance = null;
    }

    constructor (private dcl : DCL, private bootStrapService: BsModalService) {}

    /**
     * Shows a modal
     * @param config modal component config
     */
    public open (config : ModalEntityConfig, inputs: {[key:string] : any} = {}): void {
        if (this.modalComponentInstance && !this.modalComponentInstance.destroyed) {
            this.destroyModalComponent();
        }

        let componentFactory: ComponentFactory<any> =
            this.dcl.getComponentFactory('modal');

        this.bsModalRef = this.bootStrapService.show(componentFactory.componentType, {
            initialState: {
                config: config,
                inputs: inputs
            },
            backdrop: config.backdrop,
            ignoreBackdropClick: config.ignoreBackdropClick,
            class: config.css || ''
        });

        this.modalComponentInstance = this.bsModalRef.content;
    }

    public close () : void  {
        this.destroyModalComponent();
    }

}
