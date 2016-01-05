/**
 * Created by sangress on 1/5/16.
 */
// app/app.ts

import {bootstrap} from 'angular2/platform/browser';
import {Component, Pipe, PipeTransform} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {ImgDisplayer} from './imgDisplayer'

@Pipe({ name: 'byteFormat'})
class ByteFormatPipe implements PipeTransform {
    // Credit: http://stackoverflow.com/a/18650828
    transform(bytes, args) {
        if(bytes == 0) return '0 Bytes';
        var k = 1000;
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
    }
}


@Component({
    selector: 'app',
    pipes: [ByteFormatPipe],
    directives: [ImgDisplayer],
    template: `
     <h1>Total Images: {{ imageStats().count }}</h1>
    <h1>Total Size: {{ imageStats().size | byteFormat}}</h1>
    <div
      (dragover)="false"
      (dragend)="false"
      (drop)="handleDrop($event)"
      style="height: 300px; border: 5px dotted #ccc;">
      <p style="margin: 10px; text-align: center">
        <strong>Drop Your Images Here</strong>
      </p>
    </div>
    <img-displayer [images]="images"></img-displayer>
    `

})

export class App {
    images:Array<Object> = [];

    constructor() {}

    handleDrop(e) {
        var files:File = e.dataTransfer.files;
        var self = this;
        Object.keys(files).forEach((key) => {
            if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
                self.images.push(files[key]);
            }
            else {
                alert("File must be a PNG or JPEG!");
            }
        });

        return false;
    }

    imageStats() {

        let sizes:Array<Number> = [];
        let totalSize:number = 0;

        this
            .images
            .forEach((image:File) => sizes.push(image.size));

        sizes
            .forEach((size:number) => totalSize += size);

        return {
            size: totalSize,
            count: this.images.length
        }

    }

}

bootstrap(App);
