import { DataSource } from '@angular/cdk/table';
import { Component, OnInit,NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { chartXAxis, DamageType, statsForm, Tactic, WeaponClass } from '@shared/utils/ground-combat-constants';
import { BehaviorSubject, Observable } from 'rxjs';

enum damage {
  Lightsaber="Lightsaber",
  Poison="Poison"
};

@Component({
  selector: 'app-infantry-page',
  templateUrl: './infantry-page.component.html',
  styleUrls: ['./infantry-page.component.scss']
})
export class InfantryPageComponent implements OnInit {
  public damageRangeChart: any;


  private blueTeamColor = "#3f51b5";
  private redTeamColor = "#4caf50";
  private contentColor = "#FFFFFF";
  public tactics = Tactic;
  public weaponClasses = WeaponClass;
  public damageTypes = DamageType;

  public fakeVar: any = null;
  public blueForm: FormGroup = this.fb.group({});
  public redForm: FormGroup = this.fb.group({});
  public blueResult: SquadResult = new SquadResult();
  public redResult: SquadResult = new SquadResult();

  public chartSettings = {
    series: [
      {
        name: 'Blue Stormies',
        data: [31, 40, 28, 51, 42, 89, 100],
      },
      {
        name: 'Red Riflemen',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    colors: [this.blueTeamColor, this.redTeamColor],
    chart: {
      height: '100%',
      type: 'line',
      toolbar: false
    },
    dataLabels: {
      enabled: true
    },
    tooltip: {
      enabled: true,
      theme: "dark"
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: chartXAxis,
      title: {
        text: "Range",
        style: {
          color: this.contentColor,
          fontWeight: "normal"
        }
      },
      labels: {
        style: {
          colors: Array(30).fill(this.contentColor)
        }
      },
      axisBorder: {
          color: this.contentColor
      }
    },
    grid: {
      padding: {
        left: 20,
        right: 20

      }
    },
    yaxis: {
      title: {
        text: "Average Base Damage per Hit",
        style: {
          color: this.contentColor,
          fontWeight: "normal"
        }
      },
      min: 0,
      labels: {
        style: {
          colors: [this.contentColor]
        }
      },
      axisBorder: {
          color: this.contentColor
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',

      labels: {
        colors: [this.contentColor, this.contentColor]
      }
    },
  }

  public blueIsDroid: boolean = false;
  public redIsDroid: boolean = false;

  constructor(private fb: FormBuilder, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.blueForm = this.fb.group(statsForm);
    this.redForm = this.fb.group(statsForm);
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.damageRangeChart) {
      this.damageRangeChart?.destroy();
    }
  }

  initChart() {
    this.damageRangeChart = new ApexCharts(document.querySelector('#damageRangeChart'), this.chartSettings);
    this.damageRangeChart?.render();
  }

}

export class SquadResult {
  public victories: number = 0;
  public percentage: number = 0;
  public unitsLeft: number = 0;
  public roundsTaken: number = 0;
  public hpLeft: number = 0;
  public shieldsLeft: number = 0;
  public ionicLeft: number = 0;
}
