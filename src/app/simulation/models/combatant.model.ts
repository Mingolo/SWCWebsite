import { UnitType } from "@shared/utils/ground-combat-constants";
import { Weapon } from "./weapon.model";

export class Combatant {

  constructor(
    public strength: number, public dex: number, public dodge: number,
    public pwSkill: number, public npwSkill: number, public lightSkill: number,
    public force: number, public unitType: UnitType, public maxHp: number,
    public currHp: number, public maxShields: number, public currShields: number,
    public maxIonic: number, public currIonic: number, public armor: number,
    public primaryWeapon: Weapon, public secondaryWeapon: Weapon, public disabled: boolean){  }
}
