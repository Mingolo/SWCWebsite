import { Component, OnInit } from '@angular/core';
import { LoadingPageSpinnerService } from '../services/loading-page-spinner.service';

@Component({
  selector: 'loading-page-spinner',
  templateUrl: './loading-page-spinner.component.html',
  styleUrls: ['./loading-page-spinner.component.scss']
})
export class LoadingPageSpinnerComponent implements OnInit {
  public show: boolean = false;

  constructor(
    private spinnerService: LoadingPageSpinnerService
    ) { }

  ngOnInit(): void {
    this.spinnerService.getShowSpinner().subscribe(show => this.updateShow(show));
  }

  private updateShow(show: boolean) {
    this.show = show;
  }
}
