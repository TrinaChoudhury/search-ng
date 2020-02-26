import { Component, OnInit, Input } from '@angular/core';
import {ANIMATION_TYPES} from 'ngx-loading';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
/**
 * Ideally there should be a loader service to open/close and handle all loaders on a
 * screen.
 * LoaderService would be then one single point of contact and will hold
 * registered loaders
 */
export class LoaderComponent implements OnInit {

    public config: any;

    @Input('show-loader')
    showLoader : boolean;

    ngOnInit() {
        this.config = {
            animationType: ANIMATION_TYPES.circle,
            backdropBorderRadius: '3px',
            primaryColour: '#ffffff',
            secondaryColour: '#ccc',
            tertiaryColour: '#ffffff'
        }
    }

}
