import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

    //Temp Hack as Flicker API Key Expires. So stored in localStorage
    ngOnInit () {
        window.localStorage.api_key = window.localStorage.api_key ||
            '4ef49a44ff1d8075797b356a6ec99282';
    }

    ngAfterViewInit () {
        document.body.addEventListener("click", (evt: Event) => {
            let suggessionListElem = document.getElementById('search-suggestion-list'),
                searchQueryField = document.getElementById('searchQuery');
            if ((suggessionListElem && suggessionListElem !== evt.target) &&
                evt.target !== searchQueryField) {
                suggessionListElem.classList.add('hide');
            } else {
                suggessionListElem.classList.remove('hide');
            }
        })
    }
}
