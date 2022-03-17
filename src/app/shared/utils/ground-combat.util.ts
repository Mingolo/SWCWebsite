import { Combatant } from "app/simulation/models/combatant.model";
import { DamageType, damageTypeMods, dodgeThreshold, lsWeaponSkill, Tactic, UnitType, WeaponClass } from "./ground-combat-constants";

export class GroundCombat {

  public static rollTarget(squad: Combatant[], tactic: Tactic) {
    // let avgDamage = squad.reduce((prev, curr) => prev. + curr, 0);
    // let i = this.rollRandomMinMax(0, squad.length-1);


  }

  public static regenIonic (unit: Combatant): Combatant {
    if (unit.currIonic < 0 || unit.maxIonic < 0)
      throw new Error("Invalid value. A combatant's ionic values cannot be negative.");
    else if (unit.currIonic > unit.maxIonic)
      throw new Error("Invalid value. A combatant's current ionic value cannot be more than the maximum ionic value.");

    unit.currIonic = unit.currIonic + (unit.maxIonic * 0.1);
    unit.currIonic = unit.currIonic < unit.maxIonic ? unit.currIonic :  unit.maxIonic;

    unit = this.checkDisabled(unit);
    return unit;
  }

  public static regenShields (unit: Combatant): Combatant {
    if (unit.currShields < 0 || unit.maxShields < 0)
      throw new Error("Invalid value. A combatant's deflector values cannot be negative.");
    else if (unit.currShields > unit.maxShields)
      throw new Error("Invalid value. A combatant's current deflectors value cannot be more than the maximum deflectors value.");

    unit.currShields = unit.currShields + (unit.maxShields * 0.05);
    unit.currShields = unit.currShields < unit.maxShields ? unit.currShields :  unit.maxShields;
    return unit;
  }

  public static regenHP (unit: Combatant): Combatant {
    if (unit.currHp < 0 || unit.maxHp < 0)
      throw new Error("Invalid value. A combatant's HP values cannot be negative.");
    else if (unit.currHp > unit.maxHp)
      throw new Error("Invalid value. A combatant's current HP cannot be more than the maximum HP.");

    unit.currHp = unit.currHp + (unit.maxHp * 0.1);
    unit.currHp = unit.currHp < unit.maxHp ? unit.currHp :  unit.maxHp;

    unit = this.checkDisabled(unit);
    return unit;
  }

  public static applyDamage(unit: Combatant, damage: number, damageType: DamageType): Combatant {
    if (damage < 0)
      throw new Error("Invalid value. Damage cannot be negative.");

    if (unit.currShields > 0) {
      if (unit.currShields > damage) {
        unit.currShields -= damage;
        damage = 0;
      } else {
        damage = damage - unit.currShields;
        unit.currShields = 0;
      }
    }

    if (damageType === DamageType.IonicH || damageType === DamageType.IonicP || damageType === DamageType.IonicO) {
      unit.currIonic -= damage;
      unit.currIonic = unit.currIonic > 0 ? unit.currIonic : 0;
    } else {
      unit.currHp -= damage;
      unit.currHp =  unit.currHp > 0 ?  unit.currHp : 0;
    }

    if (unit.currHp === 0 && damageType === DamageType.Nonlethal && unit.unitType === UnitType.Soft)
      unit.currHp = 1;

    unit = this.checkDisabled(unit);
    return unit;
  }

  public static checkDisabled(unit: Combatant) : Combatant {
    if(unit.maxIonic > 0 && unit.currIonic <= 0) {
      unit.disabled = true;
    } else if (unit.maxHp > 0 && unit.currHp <= 0) {
      unit.disabled = true
    } else {
      unit.disabled = false;
    }

    return unit;
  }

  public static calculateHP(strength: number, hpMult: number, level: number) {
    const hp = Math.round((35 * hpMult) + (2 * level * (strength + hpMult)) + strength * 10);
    return hp > 0 ? hp : 0;
  }

  public static rollDamage (
    weaponSkill: number, minDamage: number, maxDamage: number,
    attackFirepower: number, defendArmor: number, damageType: DamageType,
    defendUnitType: UnitType, dualWielded: boolean) {

      // roll base damage and modify by weapon skill
      let damage = this.rollRandomMinMax(minDamage, maxDamage);
      if (this.rollPercentage() < weaponSkill) {   // critital hit chance
        damage = maxDamage * 1.5;
      } else {
        damage = damage * this.getDamageSkillMod(weaponSkill);
        damage = damage < maxDamage ? damage : maxDamage;
      }

      // dual wield penalty
      if (dualWielded && defendUnitType != UnitType.Mechanical)
        damage = damage/2;

      // modify by armor
      damage = this.modDamageByArmor(damage, attackFirepower, defendArmor);

      // modify by damage and unit types
      damage = this.modDamageByType (damage, damageType, defendUnitType);

      return damage;
  }

  public static rollPercentage(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  public static rollRandomMinMax(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  public static modDamageByType (damageIn: number, damageType: DamageType, defendUnitType: UnitType) : number {
    damageIn = damageIn > 0 ? damageIn : 0;
    return damageIn * damageTypeMods[damageType][defendUnitType];
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
    const hitRoll = this.rollPercentage();

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
    dualWielded: boolean, defendUnitType: UnitType) : number {

      let dualWieldMod = 1;
      if (dualWielded && defendUnitType != UnitType.Mechanical)
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
