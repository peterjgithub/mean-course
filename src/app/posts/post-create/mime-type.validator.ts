import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl):
    Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
      const file = control.value as File;
      const fileReader = new FileReader();

      // fileReader.onloadend = () => {} doesn't return a Promise or an Observable
      // this is neither
      // so we create our own observable

      const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener("loadend", () => {
          const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
          //=a way to acces the file so that we can parse the mime type
          //=advanced javascript
          let header = "";
          let isValid = false;
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }
          switch (header) {
            case "89504e47":
              isValid = true;
              break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false; // Or you can use the blob.type as fallback
              break;
          }
          if (isValid) {
            observer.next(null);
          } else {
            observer.next( {invalidMimeType: true} );
          }
          observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
      });
      return frObs;
    };
// need to define the return type because this is an asynchronous validator
// a normal synchronous validator would return a simple object { key value pair } or null
// javascript object is here wrapped by a Promise | Observable decorator
// these are generic
