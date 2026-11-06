import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayLabel',
  standalone: true,
})
export class DisplayLabelPipe implements PipeTransform {
  transform(value: string): string {
    const text = value
      .replace(/[-_]/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
