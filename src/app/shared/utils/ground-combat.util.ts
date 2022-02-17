import { DamageType, dodgeThreshold, lsWeaponSkill, WeaponClass } from "./ground-combat-constants";

export class GroundCombat {
    public static getDodgeThreshold(defendDodge: number, attackSkill: number) {

      if (defendDodge < 0 || defendDodge > 5)
        throw new Error("Invalid dodge skill value.");
      if (attackSkill < 0 || attackSkill > 7.5)
        throw new Error("Invalid attack skill value.");

      return dodgeThreshold[defendDodge][Math.floor(attackSkill)];
    }

    public static getRangeModifier(optimumRange: number, currentRange: number, weaponDropOff: number) {
      const deltaRange = Math.abs(optimumRange - currentRange);
      if (deltaRange === 0)
        return 1;

      let rangeMod = (1 - (0.95 / (1 + Math.E**(-2 * (deltaRange - weaponDropOff))))) - (0.003 * deltaRange);
      rangeMod = rangeMod > 0 ? rangeMod : 0;

      return rangeMod;
    }

    public static getAttackSkill(
      dex: number, weaponSkill: number)  {

      let attackSkill = dex + weaponSkill/2;
      attackSkill = attackSkill > 7.5 ? 7.5 : attackSkill;
      attackSkill = attackSkill < 0 ? 0 : attackSkill;

      return attackSkill;
    }

    public static getWeaponSkill(
      pwSkill: number, npwSkill: number, hwSkill: number,
      lightSkill: number, force: boolean, weaponClass: WeaponClass,
      damageType: DamageType) {

        if (npwSkill < 0 || npwSkill > 5)
          throw new Error("Invalid npwSkill skill value.");
        if (lightSkill < 0 || lightSkill > 5)
          throw new Error("Invalid lightsaber skill value.");

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
