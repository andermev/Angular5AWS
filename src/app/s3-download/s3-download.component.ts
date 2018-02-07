import { Component, OnInit } from '@angular/core';
import { S3Service } from '../service/s3-service';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-s3-download',
  templateUrl: './s3-download.component.html',
  styleUrls: ['./s3-download.component.css']
})
export class S3DownloadComponent implements OnInit {

  public httpUploadProgress: {[name: string]: any} = {
    ratio : 0,
    style : {
      width: '0',
    }
  };


  /**
   * @desc constructor
   */
  constructor(private s3Service: S3Service)
  {
    this.download();
  }


  /**
   * @desc Angular LifeCycle
   */
  ngOnInit()
  {
    this.s3Service.progress
      .subscribe((res: AWS.S3.ManagedUpload.Progress) => {
        this.httpUploadProgress.ratio = res.loaded * 100 / res.total;
        this.httpUploadProgress.style.width = this.httpUploadProgress.ratio + '%';
      });
  }


  /**
   * @desc file upload
   */
  public download(): void
  {
    this.httpUploadProgress.ratio = 0;
    this.httpUploadProgress.style.width = '0';
    let filename = 'mov_bbb.mp4';
    this.s3Service.onManagedDownload(filename);
  }

}
