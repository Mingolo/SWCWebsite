import { Combatant } from "app/simulation/models/combatant.model";
import { InfantrySimulation } from "app/simulation/models/infantry-simulation.model";
import { SquadStats } from "app/simulation/models/squad-stats.model";
import { Weapon } from "app/simulation/models/weapon.model";
import {
  DamageType,
  damageTypeMods,
  dodgeThreshold,
  hpRegenInterval,
  ionicRegenInterval,
  lsWeaponSkill,
  shieldRegenInterval,
  Tactic, UnitType,
  WeaponClass } from "./ground-combat-constants";

export class GroundCombat {

  // create a squad of Combatants, that is an array of Combatant objects, using the inputs provided
  public static createSquad(
    squadSize: number, strength: number, dex: number,
    dodge: number, pwSkill: number, npwSkill: number, hwSkill: number,
    lightSkill: number, force: boolean, isDroid: boolean,
    hp: number, deflectors: number, ionic: number,
    level: number, hpMult: number, armor: number,
    primaryClass: WeaponClass, primaryType: DamageType, primaryDualWield: boolean,
    primaryFirepower: number, primaryMinDamage: number, primaryMaxDamage: number,
    primaryOptRange: number, primaryDropOff: number, primaryMaxHits: number,
    secondaryClass: WeaponClass, secondaryType: DamageType, secondaryDualWield: boolean,
    secondaryFirepower: number, secondaryMinDamage: number, secondaryMaxDamage: number,
    secondaryOptRange: number, secondaryDropOff: number, secondaryMaxHits: number) : Combatant[] {

      let squad: Combatant[] = [];
      const health = (hp && hp > 0) ? hp : this.calculateHP(strength, hpMult, level);
      let unitType = isDroid ? UnitType.Mechanical : UnitType.Soft;

      for (let i = 0; i < squadSize; i++) {
        let primaryWeapon = new Weapon(
          primaryClass, primaryType, primaryFirepower,
          primaryMinDamage, primaryMaxDamage, primaryOptRange,
          primaryDropOff, primaryMaxHits, primaryDualWield);
        let secondaryWeapon = new Weapon(
          secondaryClass, secondaryType, secondaryFirepower,
          secondaryMinDamage, secondaryMaxDamage, secondaryOptRange,
          secondaryDropOff, secondaryMaxHits, secondaryDualWield);
        let unit = new Combatant(
          strength, dex, dodge, pwSkill, npwSkill, hwSkill,
          lightSkill, force, unitType, health, health, deflectors,
          deflectors, ionic, ionic, armor, primaryWeapon, secondaryWeapon,
          false);

          squad.push(unit);
      }

      return squad;
  }

  // run a complete simulation, write result to given "simulation" object
  public static runSimulation (
    simulation: InfantrySimulation,
    blueName: string, redName: string,
    blueStats: SquadStats, redStats: SquadStats,
    blueRange: number, redRange: number,
    blueTacticFirst: Tactic, blueTacticSecond: Tactic, blueTacticSwitchRound: number,
    redTacticFirst: Tactic, redTacticSecond: Tactic, redTacticSwitchRound: number) {

      simulation.ties = 0;
      let doneBattles = 0;
      simulation.blueTeam.victories = 0;
      simulation.redTeam.victories = 0;
      simulation.blueTeam.squadName = blueName;
      simulation.redTeam.squadName = redName;
      simulation.blueTeam.totalUnits = blueStats.squadSize;
      simulation.blueTeam.maxHP = (blueStats.hp && blueStats.hp > 0) ? blueStats.hp : this.calculateHP(blueStats.strength, blueStats.hpMult, blueStats.level);
      simulation.blueTeam.maxShields = blueStats.deflectors;
      simulation.blueTeam.maxIonic = blueStats.ionic;
      simulation.redTeam.totalUnits = redStats.squadSize;
      simulation.redTeam.maxHP = (redStats.hp && redStats.hp > 0) ? redStats.hp : this.calculateHP(redStats.strength, redStats.hpMult, redStats.level);
      simulation.redTeam.maxShields = redStats.deflectors;
      simulation.redTeam.maxIonic = redStats.ionic;
      let blueUnitsL : number = 0;
      let redUnitsL : number = 0;
      let blueRoundsT : number = 0;
      let redRoundsT : number = 0;
      let blueHP : number = 0;
      let redHP : number = 0;
      let blueShields : number = 0;
      let redShields : number = 0;
      let blueIonic : number = 0;
      let redIonic : number = 0;

      // run battles
      for (doneBattles = 0; doneBattles < simulation.battles; doneBattles++) {
        const blueSquad = GroundCombat.createSquad(
          blueStats.squadSize, blueStats.strength, blueStats.dex,
          blueStats.dodge, blueStats.pwSkill, blueStats.npwSkill, 0,
          blueStats.lightSkill, blueStats.force, blueStats.isDroid,
          blueStats.hp, blueStats.deflectors, blueStats.ionic,
          blueStats.level, blueStats.hpMult, blueStats.armor,
          blueStats.primaryClass, blueStats.primaryType, blueStats.primaryDualWield,
          blueStats.primaryFirepower, blueStats.primaryMinDamage, blueStats.primaryMaxDamage,
          blueStats.primaryOptRange, blueStats.primaryDropOff, blueStats.primaryMaxHits,
          blueStats.secondaryClass, blueStats.secondaryType, blueStats.secondaryDualWield,
          blueStats.secondaryFirepower, blueStats.secondaryMinDamage, blueStats.secondaryMaxDamage,
          blueStats.secondaryOptRange, blueStats.secondaryDropOff, blueStats.secondaryMaxHits);
        const redSquad = GroundCombat.createSquad(
          redStats.squadSize, redStats.strength, redStats.dex,
          redStats.dodge, redStats.pwSkill, redStats.npwSkill, 0,
          redStats.lightSkill, redStats.force, redStats.isDroid,
          redStats.hp, redStats.deflectors, redStats.ionic,
          redStats.level, redStats.hpMult, redStats.armor,
          redStats.primaryClass, redStats.primaryType, redStats.primaryDualWield,
          redStats.primaryFirepower, redStats.primaryMinDamage, redStats.primaryMaxDamage,
          redStats.primaryOptRange, redStats.primaryDropOff, redStats.primaryMaxHits,
          redStats.secondaryClass, redStats.secondaryType, redStats.secondaryDualWield,
          redStats.secondaryFirepower, redStats.secondaryMinDamage, redStats.secondaryMaxDamage,
          redStats.secondaryOptRange, redStats.secondaryDropOff, redStats.secondaryMaxHits);
        const battleResult = this.runBattle(
          blueSquad, redSquad, blueRange, redRange,
          blueTacticFirst, blueTacticSecond, blueTacticSwitchRound,
          redTacticFirst, redTacticSecond, redTacticSwitchRound);

        if (battleResult.winner == -1) {
          simulation.ties++;
        } else if (battleResult.winner == blueSquad) {
          simulation.blueTeam.victories++;
          blueUnitsL += blueSquad.length;
          blueRoundsT += battleResult.rounds;
          const avgHP = blueSquad.reduce((prev, curr) => prev + curr.currHp, 0) / blueSquad.length;
          blueHP += avgHP;
          const avgShields = blueSquad.reduce((prev, curr) => prev + curr.currShields, 0) / blueSquad.length;
          blueShields += avgShields;
          const avgIonic = blueSquad.reduce((prev, curr) => prev + curr.currIonic, 0) / blueSquad.length;
          blueIonic += avgIonic;
        } else if (battleResult.winner == redSquad) {
          simulation.redTeam.victories++;
          redUnitsL += redSquad.length;
          redRoundsT += battleResult.rounds;
          const avgHP = redSquad.reduce((prev, curr) => prev + curr.currHp, 0) / redSquad.length;
          redHP += avgHP;
          const avgShields = redSquad.reduce((prev, curr) => prev + curr.currShields, 0) / redSquad.length;
          redShields += avgShields;
          const avgIonic = redSquad.reduce((prev, curr) => prev + curr.currIonic, 0) / redSquad.length;
          redIonic += avgIonic;
        }
      }

      // write results
      simulation.battles = doneBattles;
      simulation.blueTeam.percentage = this.roundTo((simulation.blueTeam.victories / doneBattles * 100), 1);
      simulation.redTeam.percentage = this.roundTo((simulation.redTeam.victories / doneBattles * 100), 1);

      if (simulation.blueTeam.victories > 0) {
        simulation.blueTeam.unitsLeft = this.roundTo((blueUnitsL / simulation.blueTeam.victories), 1);
        simulation.blueTeam.roundsTaken = this.roundTo((blueRoundsT / simulation.blueTeam.victories), 1);
        simulation.blueTeam.hpLeft = this.roundTo((blueHP / simulation.blueTeam.victories), 1);
        simulation.blueTeam.shieldsLeft = this.roundTo((blueShields / simulation.blueTeam.victories), 1);
        simulation.blueTeam.ionicLeft = this.roundTo((blueIonic / simulation.blueTeam.victories), 1);
      }

      if (simulation.redTeam.victories > 0) {
        simulation.redTeam.unitsLeft = this.roundTo((redUnitsL / simulation.redTeam.victories), 1);
        simulation.redTeam.roundsTaken = this.roundTo((redRoundsT / simulation.redTeam.victories), 1);
        simulation.redTeam.hpLeft = this.roundTo((redHP / simulation.redTeam.victories), 1);
        simulation.redTeam.shieldsLeft = this.roundTo((redShields / simulation.redTeam.victories), 1);
        simulation.redTeam.ionicLeft = this.roundTo((redIonic / simulation.redTeam.victories), 1);
      }
  }

  // get the average of an array of numbers
  public static getArrayAverage (array: number[]) {
    if (array.length <= 0) {
      throw new Error("Array cannot be empty.");
    }

    return array.reduce((prev, curr) => prev + curr, 0) / array.length;
  }

  // round to the given number of decimals
  public static roundTo(num: number, decimals: number) : number {
    num = +num.toFixed(decimals);
    return num;
  }

  // run a complete battle, return -1 if tie, or if there was a victor, return the victor
  // if battle lasts more than 500 rounds, declare it a tie, otherwise infinite loops might happen
  public static runBattle (
    squad1: Combatant[], squad2: Combatant[],
    s1Range: number, s2Range: number,
    s1TacticFirst: Tactic, s1TacticSecond: Tactic, s1TacticSwitchRound: number,
    s2TacticFirst: Tactic, s2TacticSecond: Tactic, s2TacticSwitchRound: number) : BattleResult {

    let s1Tactic = s1TacticFirst;
    let s2Tactic = s2TacticFirst;
    let battleResult = this.checkBattleResult(squad1, squad2);
    let round = 1;
    while (battleResult === 0 && round <= 500) {
      // check if it's time to change tactics
      if (round === s1TacticSwitchRound)
        s1Tactic = s1TacticSecond;
      if (round === s2TacticSwitchRound)
        s2Tactic = s2TacticSecond;

      // squad1 is attacker
      this.attackRound(squad1, squad2, s1Range, s1Tactic, s2Tactic, round);
      battleResult = this.checkBattleResult(squad1, squad2);
      if (battleResult != 0)
        break;
      round++;
      if (round > 500)
        break;

      // check if it's time to change tactics
      if (round === s1TacticSwitchRound)
        s1Tactic = s1TacticSecond;
      if (round === s2TacticSwitchRound)
        s2Tactic = s2TacticSecond;

      // squad2 is attacker
      this.attackRound(squad2, squad1, s2Range, s2Tactic, s1Tactic, round);
      battleResult = this.checkBattleResult(squad1, squad2);
      round++;
    }

    if (battleResult === 0 && round > 500)
      battleResult = -1;

    return new BattleResult(battleResult, round);
  }

  // run a complete combat round
  public static attackRound (
    attackSquad: Combatant[], defendSquad: Combatant[], range: number,
    attackTactic: Tactic, defendTactic: Tactic, round: number) {

    // process all regeneration
    if (round % hpRegenInterval === 0) {
      for (let unit of attackSquad)
        this.regenHP(unit)
      for (let unit of defendSquad)
        this.regenHP(unit)
    }
    if (round % ionicRegenInterval === 0) {
      for (let unit of attackSquad)
        this.regenIonic(unit)
      for (let unit of defendSquad)
        this.regenIonic(unit)
    }
    if (round % shieldRegenInterval === 0) {
      for (let unit of attackSquad)
        this.regenShields(unit)
      for (let unit of defendSquad)
        this.regenShields(unit)
    }
    this.processCasualties(attackSquad);
    this.processCasualties(defendSquad);

    // atttacking squad attacks
    attackSquad.forEach (attacker => {
      let weapon = this.selectWeapon(attacker.primaryWeapon, attacker.secondaryWeapon, range);
      let defender = this.rollTarget(defendSquad, attackTactic);
      for (let i = 0; i < weapon.maxHits; i++) {
        if (attackTactic === Tactic.SpreadFire)
          defender = this.rollTarget(defendSquad, attackTactic);
        this.calcAttackHit(attacker, defender, range, weapon);
      }
      // add damage from dual wielding
      if (attacker.secondaryWeapon.dualWielded) {
        weapon = attacker.secondaryWeapon;
        for (let i = 0; i < weapon.maxHits; i++) {
          if (attackTactic === Tactic.SpreadFire)
            defender = this.rollTarget(defendSquad, attackTactic);
          this.calcAttackHit(attacker, defender, range, weapon);
        }
      }
    })

    // defending squad attacks
    defendSquad.forEach (attacker => {
      let weapon = this.selectWeapon(attacker.primaryWeapon, attacker.secondaryWeapon, range);
      let defender = this.rollTarget(attackSquad, defendTactic);
      for (let i = 0; i < weapon.maxHits; i++) {
        if (defendTactic === Tactic.SpreadFire)
          defender = this.rollTarget(attackSquad, defendTactic);
        this.calcAttackHit(attacker, defender, range, weapon);
      }
      // add damage from dual wielding
      if (attacker.secondaryWeapon.dualWielded) {
        weapon = attacker.secondaryWeapon;
        for (let i = 0; i < weapon.maxHits; i++) {
          if (defendTactic === Tactic.SpreadFire)
            defender = this.rollTarget(attackSquad, defendTactic);
          this.calcAttackHit(attacker, defender, range, weapon);
        }
      }
    })

    this.processCasualties(attackSquad);
    this.processCasualties(defendSquad);
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
    const squadDisabled = this.checkSquadCasualties (squad);

    while (attackTactic === Tactic.SpreadFire && !squadDisabled && squad[i].maxHp > 0 && squad[i].currHp <= 0) {
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
    else if (unit.unitType != UnitType.Soft)
      return unit;

    unit.currHp = unit.currHp + (unit.maxHp * 0.1);
    unit.currHp = unit.currHp < unit.maxHp ? unit.currHp :  unit.maxHp;
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
    const oneDisabled  = this.checkSquadCasualties (squad1);
    const twoDisabled  = this.checkSquadCasualties (squad2);

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
  public static checkSquadCasualties (squad: Combatant[]) {
    return squad.reduce((prev, curr) => prev && (curr.disabled || (curr.maxHp > 0 && curr.currHp <= 0)), true);
  }

  // check all units in a squad, set them to disabled if disabled, or delete from squad if dead
  public static processCasualties (squad: Combatant[]) : Combatant[] {

    for (let i = squad.length-1; i >= 0; i--) {
      if(squad[i].maxIonic > 0 && squad[i].currIonic <= 0) {
        squad[i].disabled = true;
      } else {
        squad[i].disabled = false;
      }

      if (squad[i].maxHp > 0 && squad[i].currHp <= 0) {
        squad.splice(i, 1);
      }
    }

    return squad;
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

export class BattleResult {

  constructor (public winner: any = -1, public rounds: number = 0) {

  }
}
