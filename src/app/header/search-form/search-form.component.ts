import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { StateMgmtService } from '../../state-management/state-mgmt.service';
import { SearchQuery } from '../../core/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'core-js/fn/array';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit {

    public suggestions: SearchQuery[];
    public searchFieldControl: FormControl;
    public formGroup: FormGroup;
    public showList = false;

    public get searchString () : string {
        return this.searchFieldControl.value;
    }
    public set searchString (val : string) {
        this.searchFieldControl.setValue(val);
    }

    constructor(private stateMgmtService: StateMgmtService) {
        this.suggestions = this.stateMgmtService.getSearchSuggestions().reverse();
    }

    public onKeyUp (event: any) {
        if (event.keyCode === 13) {
            this.submit();
        }
    }

    public updateSearchField (suggestion : SearchQuery) : void {
        this.searchString = suggestion.content;
        this.showList = false;
    }

    public submit () : Observable<SearchQuery> {
        this.showList = false;
        let currentSearchQuery : SearchQuery = {
            content: this.searchString,
            lastUsedOn: new Date()
        };
        this.stateMgmtService.updateState(currentSearchQuery);
        return Observable.of(currentSearchQuery);
    }

    ngOnInit() {
        this.searchFieldControl = new FormControl({});
        this.formGroup = new FormGroup({
            'searchField': this.searchFieldControl
        });
        this.searchFieldControl.setValue('');
        this.searchFieldControl.valueChanges.pipe(
            //distinctUntilChanged(),
            debounceTime(200)).subscribe(this.submit.bind(this));
            //switchMap<void, SearchQuery>(this.submit.bind(this)));
    }


}
