import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByType'
})
export class FilterByTypePipe implements PipeTransform {
  transform(items: any[], type: string): any[] {
    if (!items || !type) {
      return items;
    }
    return items.filter(item => item.typeJob === type);
  }
}