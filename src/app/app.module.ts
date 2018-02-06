import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { S3UploadComponent } from './s3-upload/s3-upload.component';
import { S3Service } from '../app/service/s3-service';

@NgModule({
  declarations: [
    AppComponent,
    S3UploadComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    S3Service,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
