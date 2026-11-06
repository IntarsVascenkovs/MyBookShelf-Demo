import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SeriesServices {
  readonly incompleteSeries = signal(5555555);
}
