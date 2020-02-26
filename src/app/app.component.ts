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
        document.body.addEventListener("onclick", (evt: Event) => {
            let suggessionListElem = document.getElementById('search-suggestion-list');
            if (suggessionListElem && suggessionListElem !== evt.target) {
                suggessionListElem.classList.add('hide');
            }
        })
    }
}
