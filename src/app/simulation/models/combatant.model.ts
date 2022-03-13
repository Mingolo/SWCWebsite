import { DamageType, UnitType, WeaponClass } from "@shared/utils/ground-combat-constants";

export class Combatant {

  constructor(
    public strength: number, public dex: number, public dodge: number,
    public pwSkill: number, public npwSkill: number, public lightSkill: number,
    public force: number, public unitType: UnitType, public maxHp: number,
    public currHp: number, public maxShields: number, public currShields: number,
    public maxIonic: number, public currIonic: number, public armor: number,
    public primaryClass: WeaponClass, public primaryType: DamageType,
    public primaryFirepower: number, public primaryMinDamage: number,
    public primaryMaxDamage: number, public primaryOptRange: number,
    public primaryDropOff: number, public primaryMaxHits: number,
    public secondaryClass: WeaponClass, public secondaryType: DamageType,
    public secondaryDualWield: number, public secondaryFirepower: number,
    public secondaryMinDamage: number, public secondaryMaxDamage: number,
    public secondaryOptRange: number, public secondaryDropOff: number,
    public secondaryMaxHits: number){  }
}
