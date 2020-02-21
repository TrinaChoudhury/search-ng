import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { StateMgmtService } from '../state-management/state-mgmt.service';
import { SearchQuery, Image, DEFAULT_IMG_PROPERTIES } from '../core/core';

import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpResponse,
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {
    private subscription : Subscription = new Subscription();
    private searching = false;
    private searchQuery: SearchQuery;

    public currentPg : number = 1;
    public results : Array<Image> = [];
    public totalResults = 0;
    public totalPages = 0;
    public pgSize : number;
    public imgPerRow : number;
    public totalRowsPerPage : number;

    @ViewChild('contentContainer', {read: ElementRef})
    public contentContainerRef : ElementRef;

    public get noResultsFound () : boolean {
        return this.searching && !this.totalResults;
    }

    //totalRows in one screen = 6
    //totalImages in one row = 6
    // pagesize = 6* 8 (2 extra rows)

    constructor(private stateMgmtService: StateMgmtService, private http: HttpClient,
        private _cdRef: ChangeDetectorRef) { }

    public transform (photoArray : Array<any>) {
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
        })
    }

    public fetchResults () {
        this.http.get("https://www.flickr.com/services/rest/",
            {
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                params: {
                    text: this.searchQuery.content,
                    page: this.currentPg.toString(),
                    format: 'json',
                    'per_page': (75).toString(),
                    'api_key': '4cb72a9e20f4fa05cfd6e99b8fd5b92a',
                    method: 'flickr.photos.search',
                    nojsoncallback: (1).toString(),
                    extras: 'count_comments,count_faves,description,owner_name,path_alias,realname,url_sq,url_q,url_t,url_s,url_n,url_w,url_m,url_z,url_c,url_l'
                }
            }).subscribe((resp: any) => {
                if (resp && resp.photos) {
                    this.totalResults = Number(resp.photos.total);
                    this.totalPages = Number(resp.photos.pages);
                    this.transform(resp.photos.photo);
                    this._cdRef.detectChanges();
                }
                console.log(resp);
            }, (err) => {
                console.log(err);
            })
    }
    public onContainerScroll (event: any) {
        this.subscription.add((Observable.fromEvent(event, 'scroll')
            .pipe(map((event: Event) => (<HTMLElement>event.target).scrollTop),
            debounceTime(300)).subscribe((heightDisplaced : number) => {
            if (heightDisplaced < DEFAULT_IMG_PROPERTIES.sqHeight) {
                this.currentPg += 1;
            } else {
                this.currentPg = Math.floor(
                    (heightDisplaced / DEFAULT_IMG_PROPERTIES.sqHeight)
                    * this.totalRowsPerPage);
            }
            this.fetchResults();
        })));
    }

    ngOnInit() {
        this.stateMgmtService.getSearchState$().subscribe((searchQuery) => {
            this.searching = true;
            this.results = [];
            this.currentPg = 1;
            this.searchQuery = searchQuery;
            this.fetchResults();
        });
    }

    ngAfterViewInit () {
        this.imgPerRow = Math.floor(this.contentContainerRef.nativeElement.clientWidth /
            DEFAULT_IMG_PROPERTIES.sqWidth);
        this.totalRowsPerPage = Math.floor(this.contentContainerRef.nativeElement.clientHeight /
            DEFAULT_IMG_PROPERTIES.sqHeight);
            //See if max limit to pg size < this.pgSize if so show load more button
        this.pgSize = this.imgPerRow * this.totalRowsPerPage;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
