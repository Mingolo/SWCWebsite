import { DamageType, Tactic, WeaponClass } from "@shared/utils/ground-combat-constants";

export class SquadStats {

  constructor(
    public squadName: string,
    public squadSize: number,
    public range: number,
    public tactic1: Tactic,
    public tactic2: Tactic,
    public switchRound: number,
    public strength: number,
    public dex: number,
    public dodge: number,
    public pwSkill: number,
    public npwSkill: number,
    public lightSkill: number,
    public force: boolean,
    public isDroid: boolean,
    public hp: number,
    public deflectors: number,
    public ionic: number,
    public level: number,
    public hpMult: number,
    public armor: number,
    public primaryClass: WeaponClass,
    public primaryType: DamageType,
    public primaryDualWield: boolean,
    public primaryFirepower: number,
    public primaryMinDamage: number,
    public primaryMaxDamage: number,
    public primaryOptRange: number,
    public primaryDropOff: number,
    public primaryMaxHits: number,
    public secondaryClass: WeaponClass,
    public secondaryType: DamageType,
    public secondaryDualWield: boolean,
    public secondaryFirepower: number,
    public secondaryMinDamage:number,
    public secondaryMaxDamage: number,
    public secondaryOptRange: number,
    public secondaryDropOff: number,
    public secondaryMaxHits: number) {

  }
}
