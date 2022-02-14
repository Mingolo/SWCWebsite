import { DamageType, lsWeaponSkill, WeaponClass } from "./ground-combat-constants";

export class GroundCombat {
    public static getAttackSkill(
      dex: number, pwSkill: number, npwSkill: number,
      hwSkill: number, lightSkill: number, force: boolean,
      weaponClass: WeaponClass, damageType: DamageType)  {

      let weaponSkill = this.getWeaponSkill(pwSkill, npwSkill, hwSkill, lightSkill, force, weaponClass, damageType);
      let attackSkill = dex + weaponSkill/2;
      attackSkill = attackSkill > 7.5 ? 7.5 : attackSkill;
      attackSkill = attackSkill < 0 ? 0 : attackSkill;

      return attackSkill;
    }

    public static getWeaponSkill(
      pwSkill: number, npwSkill: number, hwSkill: number,
      lightSkill: number, force: boolean, weaponClass: WeaponClass,
      damageType: DamageType) {

        let weaponSkill = pwSkill;
        if (damageType === DamageType.Lightsaber) {
          if (force) {
            weaponSkill = lsWeaponSkill[npwSkill][lightSkill];
          }
          else {
            weaponSkill = npwSkill/2;
          }
        }
        else if (weaponClass === WeaponClass.NonProjectile)
          weaponSkill = npwSkill;
        else if (weaponClass == WeaponClass.HeavyProjectile)
          weaponSkill = hwSkill;

        return weaponSkill;
      }
}
