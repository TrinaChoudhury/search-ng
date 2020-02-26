import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { StateMgmtService } from '../state-management/state-mgmt.service';
import { SearchQuery, Image, DEFAULT_IMG_PROPERTIES, Size } from '../core/core';

import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpResponse,
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { DataSource } from '../core/datasource';
import { PhotoSearchAPIConfig } from './photos-search.api';
import { HttpDataSource } from '../adapters/http/http-datasource.service';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent {
    // Both offsetRows, extraRowsOffset have been kept in percent to account to different
    // screen sizes
    private readonly IMG_LOAD = {
        // This is the portion that would be covered in lastPageRendered
        // after which next page would be displayed
        offsetRows : .3,
        // This is the portion that would be added to all rows that could fit in screen
        // to have some rows extra to what can be filled in the screen
        extraRowsOffset: .4,
        maxImages: 100
    };

    private subscription : Subscription = new Subscription();
    private currentSearchSubscription : Subscription;
    private searchQuery: SearchQuery;
    private totalPages : number;

    public showLoader = false;
    public searching = false;
    public results : Array<Image> = [];
    /**
     * Number of results that the search fetched
     * @return [description]
     */
    public totalResults = 0;

    /**
     * Load more results button should be shown if max Image Limit has been achieved.
     * @return {boolean}
     * [Not Implemented In View]
     */
    public get showLoadMore () : boolean {
        return this.lastPageRendered * this.rowsPerPage * this.imagesPerRow >
            this.IMG_LOAD.maxImages;
    }

    /**
     * Page Size holds number of images that would be present in 1 Page
     * It is determined by the size of the image container which is dependent on
     * screen size
     */
    public pgSize : number;
    /**
     * Page Height is the sum of height of all rows present in 1 page
     */
    public pgHeight: number;
    /**
     * Last page is numbered is also equivalent to
     * Number of pages rendered in view (As its infinite scroller)
     */
    public lastPageRendered: number = 0;
    /**
     * Number of rows that are present in a page
     * Dependent on screen size
     */
    public rowsPerPage : number;
    /**
     * Number of images that are present in one row
     * Dependent on screen size
     */
    public imagesPerRow : number;

    public get rowHeight () :  number {
        return this.imgSize.height + (DEFAULT_IMG_PROPERTIES.borderTop * 2);
    }

    public get colWidth () : number {
        return this.imgSize.width + (DEFAULT_IMG_PROPERTIES.borderLeft * 2);
    }

    public get imgSize () : Size {
        return {
            height: DEFAULT_IMG_PROPERTIES.sqHeight,
            width: DEFAULT_IMG_PROPERTIES.sqWidth
        }
    }

    @ViewChild('imgContainer', {read: ElementRef})
    public imgContainerRef : ElementRef;

    public get imagesContainerSize () : Size {
        if (this.imgContainerRef) {
            return {
                height: this.imgContainerRef.nativeElement.clientHeight - 5,
                width: this.imgContainerRef.nativeElement.clientWidth
            }
        }
        return {
            height: 0,
            width: 0
        }
    }

    public get noResultsFound () : boolean {
        return this.searching && !this.totalResults;
    }

    constructor(private stateMgmtService: StateMgmtService, private datasource:
        HttpDataSource, private _cdRef: ChangeDetectorRef) { }

    /*
        Transformation Layer should also be seggregated out
        from here and handled at datasouce level
     */
    public transform (photoArray : Array<any>) : void {
        photoArray.forEach((photo) => {
            this.results.push({
                id: photo.id,
                title: photo.title,
                description: photo.description._content,
                userName: photo.ownername,
                fullName: photo.realname,
                favCount: Number(photo['count_faves']),
                commentsCount: Number(photo['count_comments']),
                squareSmallSize: {
                    url: photo['url_sq'],
                    height: photo['height_sq'],
                    width: photo['width_sq']
                },
                squareLargeSize: {
                    url: photo['url_q'],
                    height: photo['height_q'],
                    width: photo['width_q']
                },
                thumbSize: {
                    url: photo['url_t'],
                    height: photo['height_t'],
                    width: photo['width_t']
                },
                normalSize: {
                    url: photo['url_n'],
                    height: photo['height_n'],
                    width: photo['width_n']
                },
                modalSize: {
                    url: photo['url_c'],
                    height: photo['height_c'],
                    width: photo['width_c']
                },
                originalSize: {
                    url: photo['url_o'],
                    height: photo['height_o'],
                    width: photo['width_o']
                }
            })
        });
    }

    /**
     * Function invoked to render next page
     */
    public renderPage () : void {
        let dsConfig = Object.assign({}, PhotoSearchAPIConfig);
        this.lastPageRendered += 1;

        dsConfig.params.query = Object.assign({}, dsConfig.params.query, {
            text: this.searchQuery.content,
            page: this.lastPageRendered.toString(),
            'per_page': (this.pgSize).toString(),
            'api_key': window.localStorage.api_key
        });

        this.currentSearchSubscription =
            this.datasource.get(dsConfig).subscribe((resp: any) => {
                this.showLoader = false;
                if (resp && resp.photos) {
                    this.totalResults = Number(resp.photos.total);
                    this.totalPages = Number(resp.photos.pages);
                    this.transform(resp.photos.photo);
                    this._cdRef.detectChanges();
                }
            }, (err) => {
                this.showLoader = false;
                this._cdRef.detectChanges();
                console.log(err);
            });
    }

    /**
     * Function invoked to get the page to be rendered based on the scroll
     * @param  event {Event}
     * @return {number}
     */
    public getPgToRenderBasedOnScroll (event : Event) : number {
        let heightDisplaced, heightTraversed;

        // Height Displaced after scroll
        heightDisplaced = (<HTMLElement>event.target).scrollTop;

        /*
            heightTraversed depicts the lowermost point of scroll which includes
            total of div scrolled and the height of the div
         */
        heightTraversed = heightDisplaced + this.imagesContainerSize.height;

        /*
            Some extra set of rows rendered apart from the rows
            displayed in screen.
            The offset height is the height of rows left to be scrolled after which
            next page has to be renderd
         */
        let offsetHeight = this.IMG_LOAD.offsetRows * this.rowHeight;

        // Ideally it should have been directly set to:
        // (this.pgHeight * (this.lastPageRendered - 1)
        // But due to inconsistent data received from Flicker api
        // Height of pages vary based on result returned from API
        let heightTillSecondLastRenderedPg =
            (Math.ceil((this.results.length / this.imagesPerRow) - 1)) * this.rowHeight;

        /*
            If height traversed still falls inside the current Page Limit including the
            the offsetHeight no need to render another page
         */
        if (heightTraversed >= (heightTillSecondLastRenderedPg + (0.3 * this.pgHeight))) {
            // Page already rendered
            return this.lastPageRendered + 1;
        }

        return this.lastPageRendered;

    }

    ngOnInit() {
        this.stateMgmtService.getSearchState$().subscribe((searchQuery) => {
            //If multiple requests is being encountered, subscribe to the results fetched
            //by last emitted value
            if (this.currentSearchSubscription) {
                this.currentSearchSubscription.unsubscribe();
            }
            //Reset Values
            this.lastPageRendered = 0;
            this.results = [];
            this.showLoader = true;
            /*
                View needs to be updated here to retain back the scrollTop to 0
                as its a new search
             */
            this._cdRef.detectChanges();
            this.searching = true;
            this.searchQuery = searchQuery;
            this.renderPage();
        });
    }

    ngAfterViewInit () {

        this.imagesPerRow = Math.floor(this.imagesContainerSize.width /
            this.colWidth);
        let rowsInScreen = Math.floor(this.imagesContainerSize.height /
            this.rowHeight);
        this.rowsPerPage = rowsInScreen +
            Math.ceil(rowsInScreen * this.IMG_LOAD.extraRowsOffset);

        //See if max limit to pg size < this.pgSize if so show load more button
        this.pgSize = (this.imagesPerRow * this.rowsPerPage);
        this.pgHeight = this.rowsPerPage * this.rowHeight;

        this.subscription.add(
            Observable.fromEvent<Event>(this.imgContainerRef.nativeElement, 'scroll')
            .pipe(
                /* Kept to avoid unnecessary network call */
                debounceTime(300),
                /*
                    Filter those scroll requests if last Page of the total Results
                    have already been fetched
                 */
                filter((val) => {
                    return this.lastPageRendered <= this.totalPages;
                }),
                map(
                    // This will determine which page to render based on scroll
                    this.getPgToRenderBasedOnScroll.bind(this)
                ),
                // If last page fetched same as current requested, no need to refetch
                distinctUntilChanged(),
            ).subscribe(() => {
                this.renderPage();
            }));
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
