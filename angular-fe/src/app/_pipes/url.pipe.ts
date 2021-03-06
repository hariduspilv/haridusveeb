import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'url',
})

export class UrlPipe implements PipeTransform {

  transform(value: any): any {

    return value.match(/(http\:\/\/|https\:\/\/)/) ? value : `http:// ${value}`;

  }

}
