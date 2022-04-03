import { DamageType, WeaponClass } from "@shared/utils/ground-combat-constants";

export class Weapon {

  constructor(
    public weaponClass: WeaponClass, public damageType: DamageType,
    public firepower: number, public minDamage: number, public maxDamage: number,
    public optRange: number, public dropOff: number, public maxHits: number,
    public dualWielded: boolean){  }
}
