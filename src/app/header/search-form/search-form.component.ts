import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { StateMgmtService } from '../../state-management/state-mgmt.service';
import { SearchQuery } from '../../core/core';

@Component({
    selector: 'search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit {

    constructor(private stateMgmtService: StateMgmtService) {}

    public searchString: string;

    public onKeyUp (event: any) {
        if (event.keyCode === 13) {
            this.submit();
        }
    }

    public updateSearchField (suggestion : SearchQuery) : void {
        this.searchString = suggestion.content;
    }

    public submit () : void {
        let currentSearchQuery : SearchQuery = {
            content: this.searchString,
            lastUsedOn: new Date()
        };
        this.stateMgmtService.updateState(currentSearchQuery);
    }

    ngOnInit() {
    }

}
