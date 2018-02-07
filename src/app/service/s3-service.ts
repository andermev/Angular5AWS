import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as AWS from 'aws-sdk';
import { AWS_ENV } from '../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class S3Service
{
  private bucket: AWS.S3;
  public progress: EventEmitter<AWS.S3.ManagedUpload.Progress> = new EventEmitter<AWS.S3.ManagedUpload.Progress>();
  public cameraSrc;
  private sanitizer: DomSanitizer;

  constructor(sanitizer: DomSanitizer) {
  }


  /**
   * @desc set CognitoIdentityId
   * 
   * @return string IdentityId: ex) ap-northeast-1:01234567-9abc-df01-2345-6789abcd
   */
  public initialize(): void
  {
  }

  /**
   * @desc AWS.S3
   */
  public onManagedUpload(file: File): void
  {
    let params: AWS.S3.Types.PutObjectRequest = {
      Bucket: AWS_ENV.s3.Bucket,
      Key: file.name,
      Body: file,
      ContentType: file.type
    };
    let options: AWS.S3.ManagedUpload.ManagedUploadOptions = {
      params: params,
      partSize: 64*1024*1024,
    };

    let bucket = new AWS.S3({params: params});
    bucket.config.update({
      credentials: {
        accessKeyId: AWS_ENV.s3.AccessKeyId,
        secretAccessKey: AWS_ENV.s3.SecretAccessKey
      }
    });
    bucket.putObject(params, function (err, data) {
      let a = data;
      // $('#results').html(err ? 'ERROR!' : 'UPLOADED.');
    });
  }

  /**
   * @desc progress
   */
  private _httpUploadProgress(progress: AWS.S3.ManagedUpload.Progress): void
  {
    this.progress.emit(progress);
  }

  /**
   * @desc send
   */
  private _send(err: AWS.AWSError, data: AWS.S3.ManagedUpload.SendData): void
  {
    console.log('send()', err, data);
  }

  /**
   * @desc AWS.S3
   */
  public onManagedDownload(filename: string)
  {

    let params: AWS.S3.Types.GetObjectRequest = {
      Bucket: AWS_ENV.s3.Bucket,
      Key: filename
    };
    let options: AWS.S3.ManagedUpload.ManagedUploadOptions = {
      params: params,
      partSize: 64*1024*1024,
    };

    let bucket = new AWS.S3({params: params});
    bucket.config.update({
      credentials: {
        accessKeyId: AWS_ENV.s3.AccessKeyId,
        secretAccessKey: AWS_ENV.s3.SecretAccessKey
      }
    });
    
    bucket.getObject(params, function (err, data) {
      let content = new Blob([new Uint8Array(data.Body)], { type: data.ContentType });
      // let url = (window.URL).createObjectURL(content);
      let url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(content));
      this.cameraSrc = url;
      // $('#results').html(err ? 'ERROR!' : 'UPLOADED.');
    });

    // let handler: AWS.S3.ManagedUpload = new AWS.S3.ManagedUpload(options);
    // handler.on('httpUploadProgress', this._httpUploadProgress.bind(this));
    // handler.send(this._send.bind(this));
    // return handler.promise();
  }
}