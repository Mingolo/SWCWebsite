import { DataSource } from '@angular/cdk/table';
import { Component, OnInit,NgZone, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingPageSpinnerService } from '@shared/services/loading-page-spinner.service';
import { blueSquadForm, chartXAxis, DamageType, redSquadForm, Tactic, UnitType, WeaponClass } from '@shared/utils/ground-combat-constants';
import { GroundCombat } from '@shared/utils/ground-combat.util';
import { BehaviorSubject, Observable } from 'rxjs';
import { InfantrySimulation } from '../models/infantry-simulation.model';
import { InfantrySquadResult } from '../models/infantry-squad-result.model';
import { SquadStats } from '../models/squad-stats.model';
import { Weapon } from '../models/weapon.model';


@Component({
  selector: 'app-infantry-page',
  templateUrl: './infantry-page.component.html',
  styleUrls: ['./infantry-page.component.scss']
})
export class InfantryPageComponent implements OnInit, AfterViewInit {
  public damageRangeChart: any;


  private blueTeamColor = "#3f51b5";
  private redTeamColor = "#4caf50";
  private contentColor = "#FFFFFF";
  private defaultBattleNum = 1000;
  public tactics = Tactic;
  public weaponClasses = WeaponClass;
  public damageTypes = DamageType;

  public blueStats: SquadStats = new SquadStats(...blueSquadForm);
  public redStats: SquadStats = new SquadStats(...redSquadForm);
  public blueResult: InfantrySquadResult = new InfantrySquadResult();
  public redResult: InfantrySquadResult = new InfantrySquadResult();
  public simulation: InfantrySimulation = new InfantrySimulation(this.defaultBattleNum, this.blueResult, this.redResult, 0);

  public chartSettings = {
    series: [
      {
        name: this.blueStats.squadName,
        data: this.getDamageGraph(this.blueStats),
      },
      {
        name: this.redStats.squadName,
        data: this.getDamageGraph(this.redStats),
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
        text: "Average Base Damage per Round",
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

  constructor(private spinnerService: LoadingPageSpinnerService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.runSimulation();
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.damageRangeChart) {
      this.damageRangeChart?.destroy();
    }
  }

  private initChart() {
    this.damageRangeChart = new ApexCharts(document.querySelector('#damageRangeChart'), this.chartSettings);
    this.damageRangeChart?.render();
  }

  private getDamageGraph (squad: SquadStats) : number[] {
    let data : number[] = [];
    let primaryWeapon = new Weapon(
      squad.primaryClass, squad.primaryType, squad.primaryFirepower,
      squad.primaryMinDamage, squad.primaryMaxDamage, squad.primaryOptRange,
      squad.primaryDropOff, squad.primaryMaxHits, squad.primaryDualWield);
    let secondaryWeapon = new Weapon(
      squad.secondaryClass, squad.secondaryType, squad.secondaryFirepower,
      squad.secondaryMinDamage, squad.secondaryMaxDamage, squad.secondaryOptRange,
      squad.secondaryDropOff, squad.secondaryMaxHits, squad.secondaryDualWield);

    for (let i = 0; i <= 21; i++) {
      let mainDamage = 0;
      let offhandDamage = 0;
      const weapon = GroundCombat.selectWeapon(primaryWeapon, secondaryWeapon, i);
      const unitType = squad.isDroid ? UnitType.Mechanical : UnitType.Soft;

      // calculate average damage at this ragne
      const hitChance = GroundCombat.getHitChance(
        0, weapon.optRange, i,
        weapon.dropOff, squad.dex, squad.pwSkill,
        squad.npwSkill, 0, squad.lightSkill,
        squad.force, weapon.weaponClass, weapon.damageType,
        false, unitType)/100;
      const weaponSkill = GroundCombat.getWeaponSkill(
        squad.pwSkill, squad.npwSkill, 0,
        squad.lightSkill, squad.force, weapon.weaponClass,
        weapon.damageType);
      const damageSkillMod = GroundCombat.getDamageSkillMod(weaponSkill);
      mainDamage = GroundCombat.getAvgBaseDamage(weaponSkill, damageSkillMod, weapon.minDamage, weapon.maxDamage) * weapon.maxHits * hitChance;

      // add in dual wielding
      if (weapon.dualWielded) {
        const hitChance2 = GroundCombat.getHitChance(
          0, weapon.optRange, i,
          weapon.dropOff, squad.dex, squad.pwSkill,
          squad.npwSkill, 0, squad.lightSkill,
          squad.force, weapon.weaponClass, weapon.damageType,
          true, unitType)/100;
        offhandDamage = (GroundCombat.getAvgBaseDamage(weaponSkill, damageSkillMod, weapon.minDamage, weapon.maxDamage) * 0.5) * weapon.maxHits * hitChance2;
      }

      // calculate final avg damage and add to return array
      data.push(Math.round(mainDamage + offhandDamage));
    }

    return data;
  }

  public statsToDefault() {
    this.blueStats = new SquadStats(...blueSquadForm);
    this.redStats = new SquadStats(...redSquadForm);
  }

  public updateChart(event: any) {
    this.damageRangeChart.updateSeries(
      [
        {
          name: this.blueStats.squadName,
          data: this.getDamageGraph(this.blueStats),
        },
        {
          name: this.redStats.squadName,
          data: this.getDamageGraph(this.redStats),
        },
      ]
    );
  }

  public simulationTrigger() {
    this.spinnerService.show();
    if(window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && !!(<any>window).chrome) {
      setTimeout(() => this.runSimAndSpinner(), 0);
    } else {
      setTimeout(() => this.runSimAndSpinner(), 500);
    }
  }

  private runSimAndSpinner() {
    this.runSimulation();
    this.spinnerService.hide();
  }

  private runSimulation() {
    this.blueResult = new InfantrySquadResult();
    this.redResult = new InfantrySquadResult();
    this.simulation.blueTeam = this.blueResult;
    this.simulation.redTeam = this.redResult;
    GroundCombat.runSimulation (
      this.simulation,
      this.blueStats.squadName, this.redStats.squadName,
      this.blueStats, this.redStats,
      this.blueStats.range, this.redStats.range,
      this.blueStats.tactic1, this.blueStats.tactic2, this.blueStats.switchRound,
      this.redStats.tactic1, this.redStats.tactic2, this.redStats.switchRound);
  }

  public clearBlueLife() {
    this.blueStats.hp = 0;
    this.blueStats.hpMult = 0;
    this.blueStats.level = 0;
    this.blueStats.deflectors = 0;
    this.blueStats.ionic = 0;
    this.updateChart(null);
  }

  public clearRedLife() {
    this.redStats.hp = 0;
    this.redStats.hpMult = 0;
    this.redStats.level = 0;
    this.redStats.deflectors = 0;
    this.redStats.ionic = 0;
    this.updateChart(null);
  }

  public copySquadSettings(target: SquadStats, source: SquadStats) {
    target.squadSize = source.squadSize;
    target.range = source.range;
    target.tactic1 = source.tactic1;
    target.tactic2 = source.tactic2;
    target.switchRound = source.switchRound;
    this.updateChart(null);
  }

  public copyUnitStats(target: SquadStats, source: SquadStats) {
    target.strength = source.strength;
    target.dex = source.dex;
    target.dodge = source.dodge;
    target.pwSkill = source.pwSkill;
    target.npwSkill = source.npwSkill;
    target.lightSkill = source.lightSkill;
    target.force = source.force;
    target.isDroid = source.isDroid;
    target.hp = source.hp;
    target.level = source.level;
    target.hpMult = source.hpMult;
    target.ionic = source.ionic;
    target.deflectors = source.deflectors;
    target.armor = source.armor;
    this.updateChart(null);
  }

  public copyPrimaryWeapon(target: SquadStats, source: SquadStats) {
    target.primaryClass = source.primaryClass;
    target.primaryType = source.primaryType;
    target.primaryFirepower = source.primaryFirepower;
    target.primaryMinDamage = source.primaryMinDamage;
    target.primaryMaxDamage = source.primaryMaxDamage;
    target.primaryOptRange = source.primaryOptRange;
    target.primaryDropOff = source.primaryDropOff;
    target.primaryMaxHits = source.primaryMaxHits;
    target.primaryDualWield = source.primaryDualWield;
    this.updateChart(null);
  }

  public copySecondaryWeapon(target: SquadStats, source: SquadStats) {
    target.secondaryClass = source.secondaryClass;
    target.secondaryType = source.secondaryType;
    target.secondaryFirepower = source.secondaryFirepower;
    target.secondaryMinDamage = source.secondaryMinDamage;
    target.secondaryMaxDamage = source.secondaryMaxDamage;
    target.secondaryOptRange = source.secondaryOptRange;
    target.secondaryDropOff = source.secondaryDropOff;
    target.secondaryMaxHits = source.secondaryMaxHits;
    target.secondaryDualWield = source.secondaryDualWield;
    this.updateChart(null);
  }
}
