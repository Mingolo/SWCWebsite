import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingPageSpinnerService {
  private showSpinner : Subject<boolean> = new Subject();

  public getShowSpinner() : Subject<boolean> {
    return this.showSpinner;
  }

  public show() {
    this.showSpinner.next(true);
  }

  public hide() {
    this.showSpinner.next(false);
  }
}
