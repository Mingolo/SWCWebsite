import { Combatant } from "app/simulation/models/combatant.model";
import { Weapon } from "app/simulation/models/weapon.model";
import { DamageType, damageTypeMods, dodgeThreshold, lsWeaponSkill, Tactic, UnitType, WeaponClass } from "./ground-combat-constants";

export class GroundCombat {

  // run a complete combat round
  public static runCombatRound (
    squad1: Combatant[], squad2: Combatant[],
    s1Range: number, s2Range: number,
    s1Tactic: Tactic, s2Tactic: Tactic) {

    // squad 1 attacks
    squad1.forEach (attacker => {
      const weapon = this.selectWeapon(attacker.primaryWeapon, attacker.secondaryWeapon, s1Range);
      let defender = this.rollTarget(squad2, s1Tactic);
      for (let i = 0; i < weapon.maxHits; i++) {
        if (s1Tactic === Tactic.SpreadFire)
          defender = this.rollTarget(squad2, s1Tactic);
        this.calcAttackHit(attacker, defender, s1Range, weapon);
      }
    })

    // squad 2 attacks
    squad2.forEach (attacker => {
      const weapon = this.selectWeapon(attacker.primaryWeapon, attacker.secondaryWeapon, s1Range);
      let defender = this.rollTarget(squad1, s2Tactic);
      for (let i = 0; i < weapon.maxHits; i++) {
        if (s2Tactic === Tactic.SpreadFire)
          defender = this.rollTarget(squad1, s2Tactic);
        this.calcAttackHit(attacker, defender, s2Range, weapon);
      }
    })
  }

  // calculate and process a single shot from a weapon, including calculating whether the shot hits or not
  public static calcAttackHit (attacker: Combatant, defender: Combatant, attackRange: number, attackWeapon: Weapon) {
    const hitChance = this.getHitChance(
      defender.dodge, attackWeapon.optRange, attackRange,
      attackWeapon.dropOff, attacker.dex, attacker.pwSkill,
      attacker.npwSkill, attacker.hwSkill, attacker.lightSkill,
      attacker.force, attackWeapon.weaponClass, attackWeapon.damageType,
      attackWeapon.dualWielded, attacker.unitType);
    if (this.rollHit(hitChance)) {
      const weaponSkill = this.getWeaponSkill(
        attacker.pwSkill, attacker.npwSkill, attacker.hwSkill,
        attacker.lightSkill, attacker.force, attackWeapon.weaponClass,
        attackWeapon.damageType);
      const damage = this.rollDamage (
        weaponSkill, attackWeapon.minDamage, attackWeapon.maxDamage,
        attackWeapon.firepower, defender.armor, attackWeapon.damageType,
        attacker.unitType, defender.unitType, attackWeapon.dualWielded);
      this.applyDamage(defender, damage, attackWeapon.damageType);
    }
  }

  // select correct weapon for this range
  public static selectWeapon (weapon1: Weapon, weapon2: Weapon, currRange: number) : Weapon {
    if (weapon2.dualWielded)
      return weapon1;

    const distance1 = Math.abs(weapon1.optRange - currRange);
    const distance2 = Math.abs(weapon2.optRange - currRange);
    return distance2 < distance1 ? weapon2 : weapon1;
  }

  // randomly select the enemy target, taking combat tactic currently active into account
  public static rollTarget (squad: Combatant[], attackTactic: Tactic) : Combatant {
    let i = this.rollRandomMinMax(0, squad.length-1);
    const squadDisabled = this.checkSquadDisabled (squad);

    while (
      attackTactic === Tactic.SpreadFire &&
      !squadDisabled &&
      squad[i].disabled) {
        i = this.rollRandomMinMax(0, squad.length-1);
      }

      return squad[i];
  }

  // process ionic capacitance regeneration for this unit, if valid
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

  // process deflector shields regeneration for this unit, if valid
  public static regenShields (unit: Combatant): Combatant {
    if (unit.currShields < 0 || unit.maxShields < 0)
      throw new Error("Invalid value. A combatant's deflector values cannot be negative.");
    else if (unit.currShields > unit.maxShields)
      throw new Error("Invalid value. A combatant's current deflectors value cannot be more than the maximum deflectors value.");

    unit.currShields = unit.currShields + (unit.maxShields * 0.05);
    unit.currShields = unit.currShields < unit.maxShields ? unit.currShields :  unit.maxShields;
    return unit;
  }

  // process HP regeneration for this unit, doesn't check if HP regeneration is valid for this unit
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

  // process damage taken by this unit
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

    return unit;
  }

  // check if battle has ended yet, and if it has, determine result
  public static checkBattleResult (squad1: Combatant[], squad2: Combatant[]) {
    const oneDisabled  = this.checkSquadDisabled (squad1);
    const twoDisabled  = this.checkSquadDisabled (squad2);

    if (oneDisabled && twoDisabled)   // Both disabled, return -1 to indicate a tie
      return -1;
    else if (oneDisabled)             // squad2 victory
      return squad2;
    else if (twoDisabled)             // squad1 victory
      return squad1;
    else                              // Neither squad disabled yet, return 0 to indicate battle hasn't ended
      return 0;
  }

  // check if all units in this squad have been killed or disabled
  public static checkSquadDisabled (squad: Combatant[]) {
    return squad.reduce((prev, curr) => prev && curr.disabled, true);
  }

  // process deaths in a squad by removing all dead units from squad
  public static processDeaths (squad: Combatant[]) : Combatant[] {
    return squad;
  }

  // check if this unit has been killed or disabled, and modify unit to reflect this
  public static checkDisabled (unit: Combatant) : Combatant {
    if(unit.maxIonic > 0 && unit.currIonic <= 0) {
      unit.disabled = true;
    } else if (unit.maxHp > 0 && unit.currHp <= 0) {
      unit.disabled = true
    } else {
      unit.disabled = false;
    }

    return unit;
  }

  // calculate the maximum HP based on the given inputs
  public static calculateHP (strength: number, hpMult: number, level: number) {
    const hp = Math.round((35 * hpMult) + (2 * level * (strength + hpMult)) + strength * 10);
    return hp > 0 ? hp : 0;
  }

  // generate damage based on the provided input and some randomization
  public static rollDamage (
    weaponSkill: number, minDamage: number, maxDamage: number,
    attackFirepower: number, defendArmor: number, damageType: DamageType,
    attackUnitType: UnitType, defendUnitType: UnitType, dualWielded: boolean) {

      // roll base damage and modify by weapon skill
      let damage = this.rollRandomMinMax(minDamage, maxDamage);
      if (this.rollPercentage() < weaponSkill) {   // critital hit chance
        damage = maxDamage * 1.5;
      } else {
        damage = damage * this.getDamageSkillMod(weaponSkill);
        damage = damage < maxDamage ? damage : maxDamage;
      }

      // dual wield penalty
      if (dualWielded && attackUnitType != UnitType.Mechanical)
        damage = damage/2;

      // modify by armor
      damage = this.modDamageByArmor(damage, attackFirepower, defendArmor);

      // modify by damage and unit types
      damage = this.modDamageByType (damage, damageType, defendUnitType);

      return damage;
  }

  // generate a random number between 1 and 100, inclusive
  public static rollPercentage(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  // roll a random number between minimum and maximum, inclusive
  public static rollRandomMinMax(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  // modify the damage value by the defender's unit type
  public static modDamageByType (damageIn: number, damageType: DamageType, defendUnitType: UnitType) : number {
    damageIn = damageIn > 0 ? damageIn : 0;
    return damageIn * damageTypeMods[damageType][defendUnitType];
  }

  // modify the damage value by the defender's armor
  public static modDamageByArmor(damageIn: number, attackFirepower: number, defendArmor: number) : number {

    if (attackFirepower === 0)
      throw new Error("Invalid value. Weapon firepower cannot be 0.");

    const damageOut = damageIn * (attackFirepower / (attackFirepower + defendArmor))
    return damageOut > 0 ? damageOut : 0;
  }

  // determine the average base damage based on the inputs
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

  // get the weapon damage modifier that is based on the appropiate weapon skill
  public static getDamageSkillMod(weaponSkill: number) {
    return 1 + weaponSkill/10;
  }

  // roll a random number between 1 and 100 (inclusive), if it's below the hit chance value, then hit is true
  public static rollHit(hitChance: number) : boolean {
    // roll random number between 1 and 100;
    const hitRoll = this.rollPercentage();

    if (hitRoll < hitChance)
      return true;
    else
      return false;
  }

  // determine the chance to hit based on the given inputs
  public static getHitChance(
    defendDodge: number, optimumRange: number, currentRange: number,
    weaponDropOff: number, dex: number, pwSkill: number,
    npwSkill: number, hwSkill: number, lightSkill: number,
    attackForce: boolean, weaponClass: WeaponClass, damageType: DamageType,
    dualWielded: boolean, attackUnitType: UnitType) : number {

      let dualWieldMod = 1;
      if (dualWielded && attackUnitType != UnitType.Mechanical)
      dualWieldMod = 0.5;
      const weaponSkill = this.getWeaponSkill(pwSkill, npwSkill, hwSkill, lightSkill, attackForce, weaponClass, damageType);
      const attackSkill = this.getAttackSkill(dex, weaponSkill);
      const dodgeTreshHold = this.getDodgeThreshold(defendDodge, attackSkill);
      const rangeModifier = this.getRangeModifier(optimumRange, currentRange, weaponDropOff, weaponClass);

      return dodgeTreshHold * rangeModifier * dualWieldMod;
  }

  // get the threshold number that the attacker must beat in order to overcome the defender's dodge
  public static getDodgeThreshold(defendDodge: number, attackSkill: number) {

    if (defendDodge < 0 || defendDodge > 5)
      throw new Error("Invalid dodge skill value.");
    if (attackSkill < 0 || attackSkill > 7.5)
      throw new Error("Invalid attack skill value.");

    return dodgeThreshold[defendDodge][Math.floor(attackSkill)];
  }

  // get the hit chance modifier applied because of range that the weapon is attacking from
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

  // return the combined attack skill number based on attacker dexterity plus the appropiate weapon skill
  public static getAttackSkill(dex: number, weaponSkill: number)  {

    let attackSkill = dex + weaponSkill/2;
    attackSkill = attackSkill > 7.5 ? 7.5 : attackSkill;
    attackSkill = attackSkill < 0 ? 0 : attackSkill;

    return attackSkill;
  }

  // get the attacker's appropiate weapon skill number for this weapon class and damage type
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
