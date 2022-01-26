import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loading-page-spinner',
  templateUrl: './loading-page-spinner.component.html',
  styleUrls: ['./loading-page-spinner.component.scss']
})
export class LoadingPageSpinnerComponent implements OnInit {
  public show: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
