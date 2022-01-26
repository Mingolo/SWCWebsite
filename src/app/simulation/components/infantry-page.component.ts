import { DataSource } from '@angular/cdk/table';
import { Component, OnInit,NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-infantry-page',
  templateUrl: './infantry-page.component.html',
  styleUrls: ['./infantry-page.component.scss']
})
export class InfantryPageComponent implements OnInit {
  public tactics: string[] = ['Spread Fire', 'Focus Fire'];
  public weaponClasses: string[] = ['Projectile', 'Non-Projectile'];
  public damageTypes: string[] = ['Physical (P)', 'Energy (P)', 'Explosive (P)', 
                                  'Ionic (P)', 'Lightsaber', 'Poison', 
                                  'Nonlethal', 'Physical (H)', 'Energy (H) ', 
                                  'Explosive (H)', 'Ionic (H)', 'Concussive (H)', 
                                  'Turbolaser (H', 'Energy (O)', 'Ionic (O)'];
  private blueTeamColor = "#3f51b5";
  private redTeamColor = "#4caf50";
  private contentColor = "#FFFFFF";
  private lightContentColor = "#373d3f";
  public fakeVar: any = null;  
  public blueForm: FormGroup = this.fb.group({});
  public redForm: FormGroup = this.fb.group({});
  public blueResult: SquadResult = new SquadResult();  
  public redResult: SquadResult = new SquadResult();
  public damageRangeChart: any;
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
      categories: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
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
        text: "Avgerage Damage per Hit",        
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
    this.blueForm = this.fb.group({      
      squadName: ['', [Validators.required]],
      squadSize: ['', [Validators.required]],
      range: ['', [Validators.required]],
      tactic1: ['', [Validators.required]],
      tactic2: ['', [Validators.required]],
      switchRound: ['', [Validators.required]],
      strength: ['', [Validators.required]],
      dex: ['', [Validators.required]],
      dodge: ['', [Validators.required]],
      pwSkill: ['', [Validators.required]],
      npwSkill: ['', [Validators.required]],
      isDroid: ['', [Validators.required]],
      hull: ['', [Validators.required]],
      deflectors: ['', [Validators.required]],
      ionic: ['', [Validators.required]],
      level: ['', [Validators.required]],
      hpMult: ['', [Validators.required]],
      armor: ['', [Validators.required]],
      primaryClass: ['', [Validators.required]],
      primaryType: ['', [Validators.required]],
      primaryDualWield: ['', [Validators.required]],
      primaryFirepower: ['', [Validators.required]],
      primaryMinDamage: ['', [Validators.required]],
      primaryMaxDamage: ['', [Validators.required]],
      primaryOptRange: ['', [Validators.required]],
      primaryDropOff: ['', [Validators.required]],
      primaryMaxHits: ['', [Validators.required]],
      secondaryClass: ['', [Validators.required]],
      secondaryType: ['', [Validators.required]],
      secondaryDualWield: ['', [Validators.required]],
      secondaryFirepower: ['', [Validators.required]],
      secondaryMinDamage: ['', [Validators.required]],
      secondaryMaxDamage: ['', [Validators.required]],
      secondaryOptRange: ['', [Validators.required]],
      secondaryDropOff: ['', [Validators.required]],
      secondaryMaxHits: ['', [Validators.required]]
    });
    this.redForm = this.fb.group({       
      squadName: ['', [Validators.required]],
      squadSize: ['', [Validators.required]],
      range: ['', [Validators.required]],
      tactic1: ['', [Validators.required]],
      tactic2: ['', [Validators.required]],
      switchRound: ['', [Validators.required]],
      strength: ['', [Validators.required]],
      dex: ['', [Validators.required]],
      dodge: ['', [Validators.required]],
      pwSkill: ['', [Validators.required]],
      npwSkill: ['', [Validators.required]],
      isDroid: ['', [Validators.required]],
      hull: [''],
      deflectors: ['', [Validators.required]],
      ionic: ['', [Validators.required]],
      level: ['', [Validators.required]],
      hpMult: ['', [Validators.required]],
      armor: ['', [Validators.required]],
      primaryClass: ['', [Validators.required]],
      primaryType: ['', [Validators.required]],
      primaryDualWield: ['', [Validators.required]],
      primaryFirepower: ['', [Validators.required]],
      primaryMinDamage: ['', [Validators.required]],
      primaryMaxDamage: ['', [Validators.required]],
      primaryOptRange: ['', [Validators.required]],
      primaryDropOff: ['', [Validators.required]],
      primaryMaxHits: ['', [Validators.required]],
      secondaryClass: ['', [Validators.required]],
      secondaryType: ['', [Validators.required]],
      secondaryDualWield: ['', [Validators.required]],
      secondaryFirepower: ['', [Validators.required]],
      secondaryMinDamage: ['', [Validators.required]],
      secondaryMaxDamage: ['', [Validators.required]],
      secondaryOptRange: ['', [Validators.required]],
      secondaryDropOff: ['', [Validators.required]],
      secondaryMaxHits: ['', [Validators.required]]
    });
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
