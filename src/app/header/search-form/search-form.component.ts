import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { StateMgmtService } from '../../state-management/state-mgmt.service';
import { SearchQuery } from '../../core/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit {

    public searchFieldControl: FormControl;
    public formGroup: FormGroup;
    public showList = false;

    public get searchString () : string {
        return this.searchFieldControl.value;
    }
    public set searchString (val : string) {
        this.searchFieldControl.setValue(val);
    }

    public get suggestions() : SearchQuery[] {
        return this.stateMgmtService.getSearchSuggestions();
    };

    constructor(private stateMgmtService: StateMgmtService) {
    }

    public showSuggestion (suggestion: SearchQuery) : boolean {
        //if search string is a substring of suggestion show it
        // Empty search string use case is already included
        return suggestion.content.indexOf(this.searchString) >= 0;
    }

    public updateSearchField (suggestion : SearchQuery) : void {
        this.searchString = suggestion.content;
        this.showList = false;
    }

    public submit () : void {
        if (this.formGroup.valid) {
            this.showList = false;
            let currentSearchQuery : SearchQuery = {
                content: this.searchString,
                lastUsedOn: new Date()
            };
            this.stateMgmtService.updateState(currentSearchQuery);
        }
    }

    ngOnInit() {
        this.searchFieldControl = new FormControl('', [Validators.required, (control) => {
            if (!control.value.trim().length) {
                return { error: 'Invalid Value'}
            }
            return null;
        }]);

        this.formGroup = new FormGroup({
            'searchField': this.searchFieldControl
        });
        this.searchFieldControl.valueChanges.pipe(
            debounceTime(200)).subscribe(this.submit.bind(this));
    }


}
