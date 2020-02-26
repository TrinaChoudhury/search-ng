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
        let searchSuggestions : Array<SearchQuery>, index : number;

        /* Search Suggestion are sorted in the order of ASC last used */
        searchSuggestions  =
            window.localStorage.searchSuggestions ?
            JSON.parse(window.localStorage.searchSuggestions) : [];
        /*
            First get the reverse order DESC last used, push new entry at last and
            reverse again before storing in localStorage to have ASC last used
         */
        //searchSuggestions = searchSuggestions.reverse();

        /*
            If existing any string is a substring or new one is a substring of older
            value
         */
        index = searchSuggestions.findIndex((query) =>
            newQuery.content.indexOf(query.content) >= 0 ||
            query.content.indexOf(newQuery.content) >= 0);

        /* If searchQuery not already present*/
        if (index === -1) {
            /* If searchSuggestions list already 4 , remove last element */
            if (searchSuggestions.length === 4) {
                searchSuggestions.splice(searchSuggestions.length - 1, 1);
            }
            searchSuggestions.splice(0, 0, newQuery);
        } else {
            /*
                Remove the earlier reference and push a new entry in the array at last
                only if new query content's length is larger than older query
                To avoid substrings
            */
            if (newQuery.content.length >= searchSuggestions[index].content.length) {
                searchSuggestions.splice(index, 1);
                searchSuggestions.splice(0, 0, newQuery);
            }
        }

        // (array is sorted (ASC last used on) before pushing to storage)
        //searchSuggestions = searchSuggestions.reverse();
        window.localStorage.searchSuggestions = JSON.stringify(searchSuggestions);
    }

    /**
     * Holds the array of User's past search queries
     * @return {Array<SearchQuery>}
     */
    public getSearchSuggestions () : Array<SearchQuery> {
        return window.localStorage.searchSuggestions ?
            <Array<SearchQuery>>JSON.parse(window.localStorage.searchSuggestions) : [];
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
