import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SearchQuery } from '../core/core';

/**
 * State Management Service deals with the application state
 * It holds a search state which is updated by the producer
 * And the consumer of this state listens to the state changes by subscribing to the
 * searchState
 */
@Injectable()
export class StateMgmtService {

    private searchState : Subject<SearchQuery> = new Subject();

    private addNewSearchQuery (newQuery: SearchQuery) : void {
        let searchSuggestions = window.localStorage.searchSuggestions ?
            JSON.parse(window.localStorage.searchSuggestions) : [];
        searchSuggestions.push(newQuery);
        window.localStorage.searchSuggestions = JSON.stringify(searchSuggestions);
    }

    /**
     * Holds the array of User's past search queries
     * @return {Array<SearchQuery>}
     */
    public getSearchSuggestions () : Array<SearchQuery> {
        return <Array<SearchQuery>>JSON.parse(window.localStorage.searchSuggestions) || [];
    }

    /**
     * Returns the Observable that basically holds the search state
     * which is subscribed by the consumer (acting as observer)
     * @return {Observable<SearchQuery>}
     */
    public getSearchState$ () : Observable<SearchQuery> {
        return this.searchState.asObservable();
    }

    /**
     * Method to update the search state
     * @param newSearchQuery {SearchQuery} - new Search Query
     */
    public updateState (newSearchQuery : SearchQuery) : void {
        this.addNewSearchQuery(newSearchQuery);
        this.searchState.next(newSearchQuery);
    }

}
