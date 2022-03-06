import { DamageType, damageTypeMods, dodgeThreshold, lsWeaponSkill, UnitType, WeaponClass } from "./ground-combat-constants";

export class GroundCombat {

  public static modDamageByType (damageIn: number, damageType: DamageType, unitType: UnitType) : number {
    damageIn = damageIn > 0 ? damageIn : 0;
    return damageIn * damageTypeMods[damageType][unitType];
  }

  public static modDamageByArmor(damageIn: number, attackFirepower: number, defendArmor: number) : number {

    if (attackFirepower === 0)
      throw new Error("Invalid value. Weapon firepower cannot be 0.");

    const damageOut = damageIn * (attackFirepower / (attackFirepower + defendArmor))
    return damageOut > 0 ? damageOut : 0;
  }

  public static getAvgBaseDamage(weaponSkill: number, damageSkillMod: number, minDamage: number, maxDamage: number) {
    let damageValues: number[] = [];
    let count = 0;
    for (let i = minDamage; i <= maxDamage; i++)
    {
      let damage = i * damageSkillMod;
      damage = damage < maxDamage ? damage : maxDamage;
      damageValues.push(damage);
      count++;
    }
    let avgDamage = damageValues.reduce((prev, curr) => prev + curr, 0);
    avgDamage = avgDamage / count;

    let critChance = (weaponSkill - 1)/100;
    critChance = critChance > 0 ? critChance : 0;
    const normalChance = 1 - critChance;
    avgDamage = (avgDamage * normalChance) + (maxDamage * 1.5 * critChance);
    avgDamage = avgDamage > 0 ? avgDamage : 0;

    return avgDamage;
  }

  public static getDamageSkillMod(weaponSkill: number) {
    return 1 + weaponSkill/10;
  }

  public static rollHit(hitChance: number) : boolean {
    // roll random number between 1 and 100;
    const hitRoll = Math.floor(Math.random() * 100) + 1;

    if (hitRoll < hitChance)
      return true;
    else
      return false;
  }

  public static getHitChance(
    defendDodge: number, optimumRange: number, currentRange: number,
    weaponDropOff: number, dex: number, pwSkill: number,
    npwSkill: number, hwSkill: number, lightSkill: number,
    attackForce: boolean, weaponClass: WeaponClass, damageType: DamageType,
    dualWielded: boolean) : number {

      let dualWieldMod = 1;
      if (dualWielded)
        dualWieldMod = 0.5;
      const weaponSkill = this.getWeaponSkill(pwSkill, npwSkill, hwSkill, lightSkill, attackForce, weaponClass, damageType);
      const attackSkill = this.getAttackSkill(dex, weaponSkill);
      const dodgeTreshHold = this.getDodgeThreshold(defendDodge, attackSkill);
      const rangeModifier = this.getRangeModifier(optimumRange, currentRange, weaponDropOff, weaponClass);

      return dodgeTreshHold * rangeModifier * dualWieldMod;
  }

  public static getDodgeThreshold(defendDodge: number, attackSkill: number) {

    if (defendDodge < 0 || defendDodge > 5)
      throw new Error("Invalid dodge skill value.");
    if (attackSkill < 0 || attackSkill > 7.5)
      throw new Error("Invalid attack skill value.");

    return dodgeThreshold[defendDodge][Math.floor(attackSkill)];
  }

  public static getRangeModifier(optimumRange: number, currentRange: number, weaponDropOff: number, weaponClass: WeaponClass) {
    const deltaRange = Math.abs(optimumRange - currentRange);
    if (deltaRange === 0)
      return 1;
    else if (weaponClass === WeaponClass.NonProjectile && currentRange > 0)
      return 0;

    let rangeMod = (1 - (0.95 / (1 + Math.E**(-2 * (deltaRange - weaponDropOff))))) - (0.003 * deltaRange);
    rangeMod = rangeMod > 0 ? rangeMod : 0;

    return rangeMod;
  }

  public static getAttackSkill(dex: number, weaponSkill: number)  {

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
