import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { ImageComponent } from './content/image/image.component';
import { ImageSummaryComponent } from './content/image/image-summary/image-summary.component';
import { SearchFormComponent } from './header/search-form/search-form.component';
import { StateMgmtService } from './state-management/state-mgmt.service';
import { LoaderComponent } from './loader/loader.component';
import { ModalComponent } from './modal/all';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalService, DCL, HttpDataSource } from './adapters/all';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    ImageComponent,
    SearchFormComponent,
    ModalComponent,
    ImageSummaryComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingModule
  ],
  providers: [StateMgmtService, DCL, ModalService, HttpDataSource],
  entryComponents: [ModalComponent, ImageSummaryComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
