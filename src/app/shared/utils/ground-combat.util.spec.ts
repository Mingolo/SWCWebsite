import { TestBed } from '@angular/core/testing';
import { Combatant } from 'app/simulation/models/combatant.model';
import { Weapon } from 'app/simulation/models/weapon.model';
import { MockService } from 'ng-mocks';
import { DamageType, UnitType, WeaponClass } from './ground-combat-constants';
import { GroundCombat } from './ground-combat.util';


describe('getArrayAverage()', () => {

  it('should return an error is the input array is empty', () => {
    let array : number[] = [];
    expect(() => GroundCombat.getArrayAverage(array)).toThrow(new Error("Array cannot be empty."));
  });

  it('should return the number at index 0 if there is only one number in the array', () => {
    let array : number[] = [3];
    expect(GroundCombat.getArrayAverage(array)).toEqual(3);
  });

  it('should return the average of the numbers in the array', () => {
    let array : number[] = [3, 8, 9, 7];
    expect(GroundCombat.getArrayAverage(array)).toEqual(6.75);
  });

  it('should return the average of the numbers in the , even with very large numbers', () => {
    let array : number[] = [333333, 8235425, 923452, 72425];
    expect(GroundCombat.getArrayAverage(array)).toEqual(2391158.75);
  });
});

describe('selectWeapon()', () => {
  let weapon1: Weapon;
  let weapon2: Weapon;

  beforeEach(() => {
    weapon1 = MockService(Weapon);
    weapon2 = MockService(Weapon);
  });

  it('should return weapon1 if current range is 0 and both weapons optimal ranges are also 0', () => {
    weapon1.optRange = 0;
    weapon2.optRange = 0;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 0)).toBe(weapon1);
  });

  it('should return weapon1 if weapon optimal ranges are the same', () => {
    weapon1.optRange = 5;
    weapon2.optRange = 5;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 3)).toBe(weapon1);
  });

  it('should return weapon1 if weapon optimal ranges are equally distant from current range', () => {
    weapon1.optRange = 5;
    weapon2.optRange = 1;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 3)).toBe(weapon1);
  });

  it('should return weapon1 if its optimal range is closest to current range', () => {
    weapon1.optRange = 6;
    weapon2.optRange = 1;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 4)).toBe(weapon1);
  });

  it('should return weapon2 if its optimal range is closest to current range', () => {
    weapon1.optRange = 7;
    weapon2.optRange = 2;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 4)).toBe(weapon2);
  });

  it('should return weapon1 if weapon2 is a dualWielded offhand', () => {
    weapon1.optRange = 7;
    weapon2.optRange = 2;
    weapon2.dualWielded = true;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 4)).toBe(weapon1);
  });

  it('should return weapon1 if its optimal range is closest to current range and  weapon2 is a dualWielded offhand', () => {
    weapon1.optRange = 6;
    weapon2.optRange = 1;
    weapon2.dualWielded = true;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 4)).toBe(weapon1);
  });

  it('should return weapon2 if its optimal range is closest to current range, even with very large values', () => {
    weapon1.optRange = 4567;
    weapon2.optRange = 150;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 400)).toBe(weapon2);
  });

  it('should return weapon2 if weapon1 is an NPW weapon, while weapon2 is not and range is over 0', () => {
    weapon1.optRange = 0;
    weapon1.weaponClass = WeaponClass.NonProjectile;
    weapon2.optRange = 7;
    weapon2.weaponClass = WeaponClass.Projectile;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 1)).toBe(weapon2);
  });

  it('should return weapon1 if weapon2 is an NPW weapon, while weapon1 is not and range is over 0', () => {
    weapon1.optRange = 7;
    weapon1.weaponClass = WeaponClass.Projectile;
    weapon2.optRange = 0;
    weapon2.weaponClass = WeaponClass.NonProjectile;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 1)).toBe(weapon1);
  });

  it('should return weapon2 if weapon1 is an NPW weapon, and weapon2 is closer to its optimum range', () => {
    weapon1.optRange = 0;
    weapon1.weaponClass = WeaponClass.NonProjectile;
    weapon2.optRange = 7;
    weapon2.weaponClass = WeaponClass.Projectile;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 5)).toBe(weapon2);
  });

  it('should return weapon2 if weapon2 is an NPW weapon and range is 0', () => {
    weapon1.optRange = 7;
    weapon1.weaponClass = WeaponClass.Projectile;
    weapon2.optRange = 0;
    weapon2.weaponClass = WeaponClass.NonProjectile;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 0)).toBe(weapon2);
  });

  it('should return weapon1 if both weapons are NPW and range is 0', () => {
    weapon1.optRange = 0;
    weapon1.weaponClass = WeaponClass.NonProjectile;
    weapon2.optRange = 0;
    weapon2.weaponClass = WeaponClass.NonProjectile;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 0)).toBe(weapon1);
  });

  it('should return weapon1 if both weapons are NPW and range is 1', () => {
    weapon1.optRange = 0;
    weapon1.weaponClass = WeaponClass.NonProjectile;
    weapon2.optRange = 0;
    weapon2.weaponClass = WeaponClass.NonProjectile;
    expect(GroundCombat.selectWeapon(weapon1, weapon2, 1)).toBe(weapon1);
  });
});

describe('checkBattleResul()', () => {
  let unit1: Combatant;
  let unit2: Combatant;
  let unit3: Combatant;
  let unit4: Combatant;
  let unit5: Combatant;
  let unit6: Combatant;
  let squad1 : Combatant[];
  let squad2: Combatant[];

  beforeEach(() => {
    unit1 = MockService(Combatant);
    unit2 = MockService(Combatant);
    unit3 = MockService(Combatant);
    unit4 = MockService(Combatant);
    unit5 = MockService(Combatant);
    unit6 = MockService(Combatant);
    squad1 = [unit1, unit2, unit3];
    squad2 = [unit4, unit5, unit6];
  });

  it('should return 0 if neither squad is disabled', () => {
    unit1.disabled = false;
    unit2.disabled = false;
    unit3.disabled = false;
    unit4.disabled = false;
    unit5.disabled = false;
    unit6.disabled = false;
    expect(GroundCombat.checkBattleResult(squad1, squad2)).toEqual(0);
  });

  it('should return 0 if neither squad is disabled, even if some units within both squads are disabled', () => {
    unit1.disabled = false;
    unit2.disabled = true;
    unit3.disabled = true;
    unit4.disabled = true;
    unit5.disabled = true;
    unit6.disabled = false;
    expect(GroundCombat.checkBattleResult(squad1, squad2)).toEqual(0);
  });

  it('should return 0 if neither squad is disabled, even if some units only one of the squads are disabled', () => {
    unit1.disabled = false;
    unit2.disabled = false;
    unit3.disabled = false;
    unit4.disabled = true;
    unit5.disabled = true;
    unit6.disabled = false;
    expect(GroundCombat.checkBattleResult(squad1, squad2)).toEqual(0);
  });

  it('should return -1 if both squads are disabled', () => {
    unit1.disabled = true;
    unit2.disabled = true;
    unit3.disabled = true;
    unit4.disabled = true;
    unit5.disabled = true;
    unit6.disabled = true;
    expect(GroundCombat.checkBattleResult(squad1, squad2)).toEqual(-1);
  });

  it('should return squad1 if squad2 is disabled but squad1 is not', () => {
    unit1.disabled = true;
    unit2.disabled = true;
    unit3.disabled = false;
    unit4.disabled = true;
    unit5.disabled = true;
    unit6.disabled = true;
    expect(GroundCombat.checkBattleResult(squad1, squad2)).toBe(squad1);
  });

  it('should return squad2 if squad1 is disabled but squad2 is not', () => {
    unit1.disabled = true;
    unit2.disabled = true;
    unit3.disabled = true;
    unit4.disabled = true;
    unit5.disabled = true;
    unit6.disabled = false;
    expect(GroundCombat.checkBattleResult(squad1, squad2)).toBe(squad2);
  });

  it('should return -1 if all units in both squads have been killed', () => {
    unit1.disabled = false;
    unit2.disabled = false;
    unit3.disabled = false;
    unit4.disabled = false;
    unit5.disabled = false;
    unit6.disabled = false;
    expect(GroundCombat.checkBattleResult([], [])).toEqual(-1);
  });

  it('should return squad1 if all units in squad2 have been killed', () => {
    unit1.disabled = false;
    unit2.disabled = false;
    unit3.disabled = false;
    unit4.disabled = false;
    unit5.disabled = false;
    unit6.disabled = false;
    expect(GroundCombat.checkBattleResult(squad1, [])).toBe(squad1);
  });

  it('should return squad2 if all units in squad1 have been killed', () => {
    unit1.disabled = false;
    unit2.disabled = false;
    unit3.disabled = false;
    unit4.disabled = false;
    unit5.disabled = false;
    unit6.disabled = false;
    expect(GroundCombat.checkBattleResult([], squad2)).toBe(squad2);
  });
});

describe('checkSquadCasualties()', () => {
  let unit1: Combatant;
  let unit2: Combatant;
  let unit3: Combatant;
  let unit4: Combatant;
  let unit5: Combatant;
  let squad : Combatant[];

  beforeEach(() => {
    unit1 = MockService(Combatant);
    unit2 = MockService(Combatant);
    unit3 = MockService(Combatant);
    unit4 = MockService(Combatant);
    unit5 = MockService(Combatant);
    unit1.disabled = false;
    unit2.disabled = false;
    unit3.disabled = false;
    unit4.disabled = false;
    unit5.disabled = false;
    unit1.maxHp = 100;
    unit1.currHp = 50;
    unit2.maxHp = 100;
    unit2.currHp = 50;
    unit3.maxHp = 100;
    unit3.currHp = 50;
    unit4.maxHp = 100;
    unit4.currHp = 50;
    unit5.maxHp = 100;
    unit5.currHp = 50;
    squad = [unit1, unit2, unit3, unit4, unit5];
  });

  it('should return true if there are no units in the squad', () => {
    expect(GroundCombat.checkSquadCasualties([])).toEqual(true);
  });

  it('should return true if all units are disabled', () => {
    unit1.disabled = true;
    unit2.disabled = true;
    unit3.disabled = true;
    unit4.disabled = true;
    unit5.disabled = true;
    expect(GroundCombat.checkSquadCasualties(squad)).toEqual(true);
  });

  it('should return false if at least one unit is not disabled', () => {
    unit1.disabled = true;
    unit2.disabled = true;
    unit4.disabled = true;
    unit5.disabled = true;
    expect(GroundCombat.checkSquadCasualties(squad)).toEqual(false);
  });

  it('should return false if no units are disabled or dead', () => {
    expect(GroundCombat.checkSquadCasualties(squad)).toEqual(false);
  });

  it('should return true if all units are dead', () => {
    unit1.currHp = 0;
    unit2.currHp = 0;
    unit3.currHp = 0;
    unit4.currHp = 0;
    unit5.currHp = 0;
    expect(GroundCombat.checkSquadCasualties(squad)).toEqual(true);
  });

  it('should return false if at least one unit is not dead', () => {
    unit1.currHp = 0;
    unit2.currHp = 0;
    unit3.currHp = 0;
    unit4.currHp = 0;
    expect(GroundCombat.checkSquadCasualties(squad)).toEqual(false);
  });

  it('should return true if all units are dead or disabled', () => {
    unit1.currHp = 0;
    unit2.disabled = true;
    unit3.disabled = true;
    unit4.currHp = 0;
    unit5.currHp = 0;
    expect(GroundCombat.checkSquadCasualties(squad)).toEqual(true);
  });
});

describe('processCasualties()', () => {
  let unit1: Combatant;
  let unit2: Combatant;
  let unit3: Combatant;
  let squad : Combatant[];

  beforeEach(() => {
    unit1 = MockService(Combatant);
    unit2 = MockService(Combatant);
    unit3 = MockService(Combatant);
    squad = [unit1, unit2, unit3];
  });

  it('a squad with all units dead should be returned with no changes', () => {
    expect(GroundCombat.processCasualties ([]).length).toEqual(0);
  });

  it('a squad with only 1 unit that has neither HP nor Ionic should return the same squad unchanged', () => {
    unit1.currIonic = 0;
    unit1.maxIonic = 0;
    unit1.currHp = 0;
    unit1.maxHp = 0;
    unit1.disabled = false;
    expect(GroundCombat.processCasualties (squad.slice(0, 1)).length).toEqual(1);
    expect(squad[0].currIonic).toEqual(0);
    expect(squad[0].maxIonic).toEqual(0);
    expect(squad[0].currHp).toEqual(0);
    expect(squad[0].maxHp).toEqual(0);
    expect(squad[0].disabled).toEqual(false);
  });

  it('a squad with only 1 unit that is both disabled and dead should return an empty squad', () => {
    unit1.currIonic = 0;
    unit1.maxIonic = 10;
    unit1.currHp = 0;
    unit1.maxHp = 10;
    expect(GroundCombat.processCasualties (squad.slice(0, 1)).length).toEqual(0);
  });

  it('a squad with only 1 unit that is disabled should change that unit to be disabled', () => {
    unit1.currIonic = 0;
    unit1.maxIonic = 10;
    unit1.currHp = 5;
    unit1.maxHp = 10;
    unit1.disabled = false;
    expect(GroundCombat.processCasualties (squad.slice(0, 1)).length).toEqual(1);
    expect(squad[0].currIonic).toEqual(0);
    expect(squad[0].maxIonic).toEqual(10);
    expect(squad[0].currHp).toEqual(5);
    expect(squad[0].maxHp).toEqual(10);
    expect(squad[0].disabled).toEqual(true);
  });

  it('a squad with only 1 unit that is dead should return an empty squad', () => {
    unit1.currIonic = 5;
    unit1.maxIonic = 10;
    unit1.currHp = 0;
    unit1.maxHp = 10;
    expect(GroundCombat.processCasualties (squad.slice(0, 1)).length).toEqual(0);
  });

  it('a squad with only 1 unit that is neither disabled nor dead should the same squad not disabled', () => {
    unit1.currIonic = 5;
    unit1.maxIonic = 10;
    unit1.currHp = 5;
    unit1.maxHp = 10;
    unit1.disabled = true;
    expect(GroundCombat.processCasualties (squad.slice(0, 1)).length).toEqual(1);
    expect(squad[0].currIonic).toEqual(5);
    expect(squad[0].maxIonic).toEqual(10);
    expect(squad[0].currHp).toEqual(5);
    expect(squad[0].maxHp).toEqual(10);
    expect(squad[0].disabled).toEqual(false);
  });

  it('a squad with all units dead should return an empty squad', () => {
    unit1.currIonic = 5;
    unit1.maxIonic = 10;
    unit1.currHp = 0;
    unit1.maxHp = 10;
    unit1.disabled = false;

    unit2.currIonic = 5;
    unit2.maxIonic = 15;
    unit2.currHp = 0;
    unit2.maxHp = 15;
    unit2.disabled = false;

    unit3.currIonic = 5;
    unit3.maxIonic = 20;
    unit3.currHp = 0;
    unit3.maxHp = 20;
    unit3.disabled = false;
    expect(GroundCombat.processCasualties (squad).length).toEqual(0);
  });

  it('a squad with some units dead should return the same squad without the dead units', () => {
    unit1.currIonic = 5;
    unit1.maxIonic = 10;
    unit1.currHp = 5;
    unit1.maxHp = 10;
    unit1.disabled = false;

    unit2.currIonic = 5;
    unit2.maxIonic = 15;
    unit2.currHp = 0;
    unit2.maxHp = 15;
    unit2.disabled = false;

    unit3.currIonic = 5;
    unit3.maxIonic = 20;
    unit3.currHp = 5;
    unit3.maxHp = 20;
    unit3.disabled = false;
    expect(GroundCombat.processCasualties (squad).length).toEqual(2);

    expect(squad[0].currIonic).toEqual(5);
    expect(squad[0].maxIonic).toEqual(10);
    expect(squad[0].currHp).toEqual(5);
    expect(squad[0].maxHp).toEqual(10);
    expect(squad[0].disabled).toEqual(false);

    expect(squad[1].currIonic).toEqual(5);
    expect(squad[1].maxIonic).toEqual(20);
    expect(squad[1].currHp).toEqual(5);
    expect(squad[1].maxHp).toEqual(20);
    expect(squad[1].disabled).toEqual(false);
  });

  it('a squad with some units dead and some disabled should return the same squad without the dead units and the disabled units disabled', () => {
    unit1.currIonic = 0;
    unit1.maxIonic = 10;
    unit1.currHp = 5;
    unit1.maxHp = 10;
    unit1.disabled = false;

    unit2.currIonic = 5;
    unit2.maxIonic = 15;
    unit2.currHp = 0;
    unit2.maxHp = 15;
    unit2.disabled = false;

    unit3.currIonic = 5;
    unit3.maxIonic = 20;
    unit3.currHp = 5;
    unit3.maxHp = 20;
    unit3.disabled = true;
    expect(GroundCombat.processCasualties (squad).length).toEqual(2);

    expect(squad[0].currIonic).toEqual(0);
    expect(squad[0].maxIonic).toEqual(10);
    expect(squad[0].currHp).toEqual(5);
    expect(squad[0].maxHp).toEqual(10);
    expect(squad[0].disabled).toEqual(true);

    expect(squad[1].currIonic).toEqual(5);
    expect(squad[1].maxIonic).toEqual(20);
    expect(squad[1].currHp).toEqual(5);
    expect(squad[1].maxHp).toEqual(20);
    expect(squad[1].disabled).toEqual(false);
  });
});

describe('regenIonic()', () => {
  let unit: Combatant;

  beforeEach(() => {
    unit = MockService(Combatant);
  });

  it('the combatant should end with 0 ionic if maxIonic is 0', () => {
    unit.currIonic = 0;
    unit.maxIonic = 0;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(0);
  });

  it('the combatant should end with 1 ionic if current ionic is 1 and maxIonic is 1', () => {
    unit.currIonic = 1;
    unit.maxIonic = 1;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(1);
  });

  it('the combatant should end with 60 ionic if current ionic is 50 and maxIonic is 100', () => {
    unit.currIonic = 50;
    unit.maxIonic = 100;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(60);
  });

  it('the combatant should end with 350 ionic if current ionic is 300 and maxIonic is 500', () => {
    unit.currIonic = 300;
    unit.maxIonic = 500;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(350);
  });

  it('the combatant should end with 355.5 ionic if current ionic is 300 and maxIonic is 555', () => {
    unit.currIonic = 300;
    unit.maxIonic = 555;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(355.5);
  });

  it('the combatant should end with 100 ionic if current ionic is 90 and maxIonic is 100', () => {
    unit.currIonic = 90;
    unit.maxIonic = 100;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(100);
  });

  it('the combatant should end with 100 ionic if current ionic is 98 and maxIonic is 100', () => {
    unit.currIonic = 98;
    unit.maxIonic = 100;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(100);
  });

  it('the combatant should end with 100 ionic if current ionic is 100 and maxIonic is 100', () => {
    unit.currIonic = 100;
    unit.maxIonic = 100;
    expect(GroundCombat.regenIonic (unit).currIonic).toEqual(100);
  });

  it('the combatant should return an error if maxIonic is less than currIonic', () => {
    unit.currIonic = 150;
    unit.maxIonic = 100;
    expect(() => GroundCombat.regenIonic (unit)).toThrow(new Error("Invalid value. A combatant's current ionic value cannot be more than the maximum ionic value."));
  });

  it('the combatant should return an error if either ionic value is negative', () => {
    unit.currIonic = -90;
    unit.maxIonic = 100;
    expect(() => GroundCombat.regenIonic (unit)).toThrow(new Error("Invalid value. A combatant's ionic values cannot be negative."));
  });

  it('the combatant should return an error if either ionic value is negative', () => {
    unit.currIonic = -90;
    unit.maxIonic = -50;
    expect(() => GroundCombat.regenIonic (unit)).toThrow(new Error("Invalid value. A combatant's ionic values cannot be negative."));
  });
});

describe('regenShields()', () => {
  let unit: Combatant;

  beforeEach(() => {
    unit = MockService(Combatant);
  });

  it('the combatant should end with 0 shields if maxShields is 0', () => {
    unit.currShields = 0;
    unit.maxShields = 0;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(0);
  });

  it('the combatant should end with 1 shields if current shields is 1 and maxShields is 1', () => {
    unit.currShields = 1;
    unit.maxShields = 1;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(1);
  });

  it('the combatant should end with 55 shields if current shields is 50 and maxShields is 100', () => {
    unit.currShields = 50;
    unit.maxShields = 100;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(55);
  });

  it('the combatant should end with 325 shields if current shields is 300 and maxShields is 500', () => {
    unit.currShields = 300;
    unit.maxShields = 500;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(325);
  });

  it('the combatant should end with 327.75 shields if current shields is 300 and maxShields is 555', () => {
    unit.currShields = 300;
    unit.maxShields = 555;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(327.75);
  });

  it('the combatant should end with 100 shields if current shields is 95 and maxShields is 100', () => {
    unit.currShields = 95;
    unit.maxShields = 100;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(100);
  });

  it('the combatant should end with 100 shields if current shields is 98 and maxShields is 100', () => {
    unit.currShields = 98;
    unit.maxShields = 100;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(100);
  });

  it('the combatant should end with 100 shields if current shields is 100 and maxShields is 100', () => {
    unit.currShields = 100;
    unit.maxShields = 100;
    expect(GroundCombat.regenShields (unit).currShields).toEqual(100);
  });

  it('the combatant should return an error if maxShields is less than currShields', () => {
    unit.currShields = 150;
    unit.maxShields = 100;
    expect(() => GroundCombat.regenShields (unit)).toThrow(new Error("Invalid value. A combatant's current deflectors value cannot be more than the maximum deflectors value."));
  });

  it('the combatant should return an error if either shields value is negative', () => {
    unit.currShields = -90;
    unit.maxShields = 100;
    expect(() => GroundCombat.regenShields (unit)).toThrow(new Error("Invalid value. A combatant's deflector values cannot be negative."));
  });

  it('the combatant should return an error if either shields value is negative', () => {
    unit.currShields = -90;
    unit.maxShields = -50;
    expect(() => GroundCombat.regenShields (unit)).toThrow(new Error("Invalid value. A combatant's deflector values cannot be negative."));
  });
});

describe('regenHP()', () => {
  let unit: Combatant;

  beforeEach(() => {
    unit = MockService(Combatant);
  });

  it('the combatant should end with 0 HP if maxHp is 0', () => {
    unit.currHp = 0;
    unit.maxHp = 0;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(0);
  });

  it('the combatant should end with 1 HP if current HP is 1 and maxHp is 1', () => {
    unit.currHp = 1;
    unit.maxHp = 1;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(1);
  });

  it('the combatant should end with 60 HP if current HP is 50 and maxHp is 100', () => {
    unit.currHp = 50;
    unit.maxHp = 100;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(60);
  });

  it('the combatant should not regenerate HP if it is a droid', () => {
    unit.currHp = 50;
    unit.maxHp = 100;
    unit.unitType = UnitType.Mechanical;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(50);
  });

  it('the combatant should not regenerate HP if it is a vehicle', () => {
    unit.currHp = 50;
    unit.maxHp = 100;
    unit.unitType = UnitType.Vehicle;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(50);
  });

  it('the combatant should not regenerate HP if it is a facility', () => {
    unit.currHp = 50;
    unit.maxHp = 100;
    unit.unitType = UnitType.Facility;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(50);
  });

  it('the combatant should end with 350 HP if current HP is 300 and maxHp is 500', () => {
    unit.currHp = 300;
    unit.maxHp = 500;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(350);
  });

  it('the combatant should end with 355.5 HP if current HP is 300 and maxHp is 555', () => {
    unit.currHp = 300;
    unit.maxHp = 555;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(355.5);
  });

  it('the combatant should end with 100 HP if current HP is 90 and maxHp is 100', () => {
    unit.currHp = 90;
    unit.maxHp = 100;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(100);
  });

  it('the combatant should end with 100 HP if current HP is 98 and maxHp is 100', () => {
    unit.currHp = 98;
    unit.maxHp = 100;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(100);
  });

  it('the combatant should end with 100 HP if current HP is 100 and maxHp is 100', () => {
    unit.currHp = 100;
    unit.maxHp = 100;
    unit.unitType = UnitType.Soft;
    expect(GroundCombat.regenHP (unit).currHp).toEqual(100);
  });

  it('the combatant should return an error if maxHp is less than currHp', () => {
    unit.currHp = 150;
    unit.maxHp = 100;
    unit.unitType = UnitType.Soft;
    expect(() => GroundCombat.regenHP (unit)).toThrow(new Error("Invalid value. A combatant's current HP cannot be more than the maximum HP."));
  });

  it('the combatant should return an error if either HP value is negative', () => {
    unit.currHp = -90;
    unit.maxHp = 100;
    unit.unitType = UnitType.Soft;
    expect(() => GroundCombat.regenHP (unit)).toThrow(new Error("Invalid value. A combatant's HP values cannot be negative."));
  });

  it('the combatant should return an error if either HP value is negative', () => {
    unit.currHp = -90;
    unit.maxHp = -50;
    unit.unitType = UnitType.Soft;
    expect(() => GroundCombat.regenHP (unit)).toThrow(new Error("Invalid value. A combatant's HP values cannot be negative."));
  });
});

describe('applyDamage()', () => {
  let unit: Combatant;

  beforeEach(() => {
    unit = MockService(Combatant);
    unit.currHp = 100;
  });

  // Normal Damage

  it('the combatant should have the same HP it started with if damage is 0', () => {
    unit.currShields = 0;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 0, DamageType.EnergyP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 99 HP if damage is 1, starting HP is 100, there are no shields or ionic, and damage type is Energy (P)', () => {
    unit.currShields = 0;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 1, DamageType.EnergyP);
    expect(unit.currHp).toEqual(99);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 90 HP and 0 shields if damage is 20, starting HP is 100, shields are 10, ionic is 0, and damage type is Energy (P)', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.EnergyP);
    expect(unit.currHp).toEqual(90);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 90 HP and 0 shields if damage is 20, starting HP is 100, shields are 10, ionic is 0, and damage type is Physical (H)', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.PhysicalH);
    expect(unit.currHp).toEqual(90);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 100 HP and 5 shields if damage is 20, starting HP is 100, shields are 25, ionic is 0, and damage type is Energy (P)', () => {
    unit.currShields = 25;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.EnergyP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(5);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 100 HP and 0 shields if damage is 20, starting HP is 100, shields are 20, ionic is 0, and damage type is Energy (P)', () => {
    unit.currShields = 20;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.EnergyP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });


  // Ionic Damage

  it('the combatant should end with 100 HP, 99 ionic if damage is 1, starting HP is 100, ionic is 100, and shields are 0, and damage type is Ionic (P)', () => {
    unit.currShields = 0;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 1, DamageType.IonicP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(99);
  });

  it('the combatant should end with 100 HP, 90 ionic and 0 shields if damage is 20, starting HP is 100, shields are 10, ionic is 100, and damage type is Ionic (P)', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.IonicP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(90);
  });

  it('the combatant should end with 100 HP, 90 ionic and 0 shields if damage is 20, starting HP is 100, shields are 10, ionic is 100, and damage type is Ionic (H)', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.IonicH);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(90);
  });

  it('the combatant should end with 100 HP, 90 ionic and 0 shields if damage is 20, starting HP is 100, shields are 10, ionic is 100, and damage type is Ionic (O)', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.IonicO);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(90);
  });

  it('the combatant should end with 100 HP, 100 ionic and 5 shields if damage is 20, starting HP is 100, shields are 25, ionic is 100, and damage type is Ionic (P)', () => {
    unit.currShields = 25;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.IonicP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(5);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 100 HP, 100 ionic and 0 shields if damage is 20, starting HP is 100, shields are 20, ionic is 100, and damage type is Ionic (P)', () => {
    unit.currShields = 20;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.IonicP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 100 HP, 0 ionic and 0 shields if damage is 20, starting HP is 100, shields are 10, ionic is 0, and damage type is Ionic (P)', () => {
    unit.currShields = 10;
    unit.currIonic = 0;
    unit = GroundCombat.applyDamage(unit, 20, DamageType.IonicP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(0);
  });


  // Nonlethal Damage

  it('non-lethal damage should not take soft targets below 1 hp', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit.unitType = UnitType.Soft;
    unit = GroundCombat.applyDamage(unit, 500, DamageType.Nonlethal);
    expect(unit.currHp).toEqual(1);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('non-lethal damage should behave normally against mechannical targets', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit.unitType = UnitType.Mechanical;
    unit = GroundCombat.applyDamage(unit, 500, DamageType.Nonlethal);
    expect(unit.currHp).toEqual(0);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('non-lethal damage should behave normally against facility targets', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit.unitType = UnitType.Facility;
    unit = GroundCombat.applyDamage(unit, 500, DamageType.Nonlethal);
    expect(unit.currHp).toEqual(0);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('non-lethal damage should behave normally against vehicle targets', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit.unitType = UnitType.Vehicle;
    unit = GroundCombat.applyDamage(unit, 500, DamageType.Nonlethal);
    expect(unit.currHp).toEqual(0);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });


  // Boundary Cases

  it('the combatant should end with 0 HP and 0 shields if damage is 500, starting HP is 100, shields are 10, ionic is 0, and damage type is Energy (P)', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 500, DamageType.EnergyP);
    expect(unit.currHp).toEqual(0);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(100);
  });

  it('the combatant should end with 100 HP, 0 ionic and 0 shields if damage is 500, starting HP is 100, shields are 10, ionic is 100, and damage type is Ionic (P)', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    unit = GroundCombat.applyDamage(unit, 500, DamageType.IonicP);
    expect(unit.currHp).toEqual(100);
    expect(unit.currShields).toEqual(0);
    expect(unit.currIonic).toEqual(0);
  });

  it('if damage is negative an error should be returned', () => {
    unit.currShields = 10;
    unit.currIonic = 100;
    expect(() => GroundCombat.applyDamage(unit, -20, DamageType.EnergyP)).toThrow(new Error("Invalid value. Damage cannot be negative."));
  });
});

describe('calculateHP()', () => {

  it('should return 0 if all inputs are 0', () => {
    expect(GroundCombat.calculateHP(0, 0, 0)).toEqual(0);
  });

  it('should return 10 if strength is 1, HP multiplier is 0, and level is 0', () => {
    expect(GroundCombat.calculateHP(1, 0, 0)).toEqual(10);
  });

  it('should return 10 if strength is 1, HP multiplier is 0, and level is 0', () => {
    expect(GroundCombat.calculateHP(1, 0, 0)).toEqual(10);
  });

  it('should return 49 if strength is 1, HP multiplier is 1, and level is 1', () => {
    expect(GroundCombat.calculateHP(1, 1, 1)).toEqual(49);
  });

  it('should return 49 if strength is 1, HP multiplier is 1, and level is 1', () => {
    expect(GroundCombat.calculateHP(1, 1, 1)).toEqual(49);
  });

  it('should return 145 if strength is 3, HP multiplier is 1, and level is 10', () => {
    expect(GroundCombat.calculateHP(3, 1, 10)).toEqual(145);
  });

  it('should return 193 if strength is 4, HP multiplier is 2.5, and level is 5', () => {
    expect(GroundCombat.calculateHP(4, 2.5, 5)).toEqual(193);
  });

  it('should return 0 if strength is 4, HP multiplier is -2.5, and level is 5', () => {
    expect(GroundCombat.calculateHP(4, -2.5, 5)).toEqual(0);
  });
});

describe('rollDamage()', () => {

  it('rolled damage should be 0 if all inputs are 0, no penalties, no critical hit, and rolled number was 0', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(0);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(1);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 0,/* minDamage */ 0,/* maxDamage */ 0,
      /* attackFirepower */ 1,/* defendArmor */ 0,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toEqual(0);
  });

  it('rolled damage should be 0.5 if all inputs are 1, no penalties, no critical hit, and rolled number was 1', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(1);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(1);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 1,/* minDamage */ 1,/* maxDamage */ 1,
      /* attackFirepower */ 1,/* defendArmor */ 1,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toEqual(0.5);
  });

  it('rolled damage should be ~9.053 if all inputs are average, no penalties, no critical hit, and rolled number was 15', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(15);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(50);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 3,/* minDamage */ 10,/* maxDamage */ 20,
      /* attackFirepower */ 13,/* defendArmor */ 15,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toBeCloseTo(9.053, 2);
  });

  it('rolled damage should be ~13.928 if all inputs are average, no penalties, with critical hit, and rolled number was 15', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(15);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(2);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 3,/* minDamage */ 10,/* maxDamage */ 20,
      /* attackFirepower */ 13,/* defendArmor */ 15,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toBeCloseTo(13.928, 2);
  });

  it('rolled damage should be ~9.053 if all inputs are average, no penalties, no critical hit (but missed it only by 1), and rolled number was 15', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(15);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(3);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 3,/* minDamage */ 10,/* maxDamage */ 20,
      /* attackFirepower */ 13,/* defendArmor */ 15,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toBeCloseTo(9.053, 2);
  });

  it('rolled damage should be ~9.053 if all inputs are average, no penalties, no critical hit (but missed it only by 2), and rolled number was 15', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(15);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(4);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 3,/* minDamage */ 10,/* maxDamage */ 20,
      /* attackFirepower */ 13,/* defendArmor */ 15,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toBeCloseTo(9.053, 2);
  });

  it('rolled damage should be ~4.526 if all inputs are average, dual wield penalties, no critical hit, and rolled number was 15', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(15);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(50);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 3,/* minDamage */ 10,/* maxDamage */ 20,
      /* attackFirepower */ 13,/* defendArmor */ 15,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ true)).toBeCloseTo(4.526, 2);
  });

  it('rolled damage should be ~9.053 if all inputs are average, dual wield penalties but is droid, no critical hit, and rolled number was 15', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(15);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(50);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 3,/* minDamage */ 10,/* maxDamage */ 20,
      /* attackFirepower */ 13,/* defendArmor */ 15,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Mechanical, /* defendUnitType */ UnitType.Soft,/* dualWielded */ true)).toBeCloseTo(9.053, 2);
  });

  it('rolled damage should be ~1.358 if all inputs are average, dual wield and damageType penalties, no critical hit, and rolled number was 15', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(15);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(50);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 3,/* minDamage */ 10,/* maxDamage */ 20,
      /* attackFirepower */ 13,/* defendArmor */ 15,/* damageType */ DamageType.ConcussiveH,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Facility,/* dualWielded */ true)).toBeCloseTo(1.358, 2);
  });

  it('rolled damage should be 100 if all attack values are high and defend values are low, no penalties, no critical hit, and rolled number was 100', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(100);     // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(50);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 5,/* minDamage */ 50,/* maxDamage */ 100,
      /* attackFirepower */ 25,/* defendArmor */ 0,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toEqual(100);
  });

  it('rolled damage should be 0.038 if all attack values are low and defend values are high, no penalties, no critical hit, and rolled number was 1', () => {
    spyOn(GroundCombat, "rollRandomMinMax").and.returnValue(1);      // damage roll
    spyOn(GroundCombat, "rollPercentage").and.returnValue(50);       //critical hit roll
    expect(GroundCombat.rollDamage (
      /* weaponSkill */ 0,/* minDamage */ 1,/* maxDamage */ 5,
      /* attackFirepower */ 1,/* defendArmor */ 25,/* damageType */ DamageType.EnergyP,
      /* attackUnitType */ UnitType.Soft, /* defendUnitType */ UnitType.Soft,/* dualWielded */ false)).toBeCloseTo(0.038, 2);
  });
});

describe('modDamageByType()', () => {

  it('should return 0 if damageIn is 0', () => {
    expect(GroundCombat.modDamageByType(0, DamageType.EnergyP, UnitType.Soft)).toEqual(0);
  });

  it('should return 1 if damageIn is 1, damageType is Energy (P), and unitType is Soft', () => {
    expect(GroundCombat.modDamageByType(1, DamageType.EnergyP, UnitType.Soft)).toEqual(1);
  });

  it('should return 100 if damageIn is 100, damageType is Energy (P), and unitType is Soft', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.EnergyP, UnitType.Soft)).toEqual(100);
  });

  it('should return 10 if damageIn is 100, damageType is Explosive (P), and unitType is Soft', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.ExplosiveP, UnitType.Soft)).toEqual(10);
  });

  it('should return 100 if damageIn is 100, damageType is Explosive (P), and unitType is Mechanical', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.ExplosiveP, UnitType.Mechanical)).toEqual(100);
  });

  it('should return 0 if damageIn is 100, damageType is Ionic (P), and unitType is Soft', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.IonicP, UnitType.Soft)).toEqual(0);
  });

  it('should return 100 if damageIn is 100, damageType is Ionic (P), and unitType is Mechanical', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.IonicP, UnitType.Mechanical)).toEqual(100);
  });

  it('should return 100 if damageIn is 100, damageType is Lightsaber, and unitType is Mechanical', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.Lightsaber, UnitType.Mechanical)).toEqual(100);
  });

  it('should return 30 if damageIn is 100, damageType is Energy (H), and unitType is Soft', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.EnergyH, UnitType.Soft)).toEqual(30);
  });

  it('should return 20 if damageIn is 100, damageType is Concussive (H), and unitType is Soft', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.ConcussiveH, UnitType.Soft)).toEqual(20);
  });

  it('should return 100 if damageIn is 100, damageType is Energy (O), and unitType is Soft', () => {
    expect(GroundCombat.modDamageByType(100, DamageType.EnergyO, UnitType.Soft)).toEqual(100);
  });

  it('should return 0 if damageIn is negative', () => {
    expect(GroundCombat.modDamageByType(-100, DamageType.EnergyO, UnitType.Soft)).toEqual(0);
  });
});

describe('modDamageByArmor()', () => {

  it('should return error if all inputs are 0', () => {
    expect(() => GroundCombat.modDamageByArmor(0, 0, 0)).toThrow(new Error("Invalid value. Weapon firepower cannot be 0."));
  });

  it('should return error if attackFirepower is 0', () => {
    expect(() => GroundCombat.modDamageByArmor(15, 0, 5)).toThrow(new Error("Invalid value. Weapon firepower cannot be 0."));
  });

  it('should return 15 if damage is 15, firepower is 10, and armor is 0', () => {
    expect(GroundCombat.modDamageByArmor(15, 10, 0)).toEqual(15);
  });

  it('should return ~6.52 if damage is 15, firepower is 10, and armor is 13', () => {
    expect(GroundCombat.modDamageByArmor(15, 10, 13)).toBeCloseTo(6.52, 1);
  });

  it('should return ~13.63 if damage is 15, firepower is 10, and armor is 1', () => {
    expect(GroundCombat.modDamageByArmor(15, 10, 1)).toBeCloseTo(13.63, 1);
  });

  it('should return ~3.75 if damage is 15, firepower is 10, and armor is 30', () => {
    expect(GroundCombat.modDamageByArmor(15, 10, 30)).toBeCloseTo(3.75, 1);
  });

  it('should return ~1.07 if damage is 15, firepower is 1, and armor is 13', () => {
    expect(GroundCombat.modDamageByArmor(15, 1, 13)).toBeCloseTo(1.07, 1);
  });

  it('should return 0 if damage is -15', () => {
    expect(GroundCombat.modDamageByArmor(-15, 1, 13)).toEqual(0);;
  });
});

describe('getAvgBaseDamage()', () => {

  it('should return 0 if all inputs are 0', () => {
    expect(GroundCombat.getAvgBaseDamage(0, 0, 0, 0)).toEqual(0);
  });

  it('should return 0 if weaponSkill is 0, damageSkillMod is 1, minDamage is 0, maxDamage is 0', () => {
    expect(GroundCombat.getAvgBaseDamage(0, 1, 0, 0)).toEqual(0);
  });

  it('should return 0 if  weaponSkill is 0, damageSkillMod is 0, minDamage is 1, maxDamage is 1', () => {
    expect(GroundCombat.getAvgBaseDamage(0, 0, 1, 1)).toEqual(0);
  });

  it('should return ~4.5 if  weaponSkill is 0, damageSkillMod is 1, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(0, 1, 3, 6)).toBeCloseTo(4.5, 2);
  });

  it('should return ~4.8 if  weaponSkill is 1, damageSkillMod is 1.1, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(1, 1.1, 3, 6)).toBeCloseTo(4.8, 2);
  });

  it('should return ~5.139 if  weaponSkill is 2, damageSkillMod is 1.2, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(2, 1.2, 3, 6)).toBeCloseTo(5.139, 2);
  });

  it('should return ~5.3495 if  weaponSkill is 3, damageSkillMod is 1.3, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(3, 1.3, 3, 6)).toBeCloseTo(5.3495, 2);
  });

  it('should return ~5.5565 if  weaponSkill is 4, damageSkillMod is 1.4, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(4, 1.4, 3, 6)).toBeCloseTo(5.5565, 2);
  });

  it('should return ~5.76 if  weaponSkill is 5, damageSkillMod is 1.5, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(5, 1.5, 3, 6)).toBeCloseTo(5.76, 2);
  });

  it('should return ~1.6785 if  weaponSkill is 2, damageSkillMod is 1.2, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(2, 1.2, 0, 3)).toBeCloseTo(1.6785, 2);
  });

  it('should return 0 if  weaponSkill is 5, damageSkillMod is -1.5, minDamage is 3, maxDamage is 6', () => {
    expect(GroundCombat.getAvgBaseDamage(5, -1.5, 3, 6)).toEqual(0);
  });
});

describe('getDamageSkillMod()', () => {

  it('should return 1 if weaponSkill is 0', () => {
    expect(GroundCombat.getDamageSkillMod(0)).toEqual(1);
  });

  it('should return 1.1 if weaponSkill is 0', () => {
    expect(GroundCombat.getDamageSkillMod(1)).toEqual(1.1);
  });

  it('should return 1.2 if weaponSkill is 0', () => {
    expect(GroundCombat.getDamageSkillMod(2)).toEqual(1.2);
  });

  it('should return 1.3 if weaponSkill is 0', () => {
    expect(GroundCombat.getDamageSkillMod(3)).toEqual(1.3);
  });

  it('should return 1.4 if weaponSkill is 0', () => {
    expect(GroundCombat.getDamageSkillMod(4)).toEqual(1.4);
  });

  it('should return 1.5 if weaponSkill is 0', () => {
    expect(GroundCombat.getDamageSkillMod(5)).toEqual(1.5);
  });
});

describe('rollHit()', () => {

  it('should return false if hit chance is 0 and rolled percentage was 1', () => {
    spyOn(GroundCombat, "rollPercentage").and.returnValue(1);
    expect(GroundCombat.rollHit(0)).toEqual(false);
  });

  it('should return false if hit chance is 1 and rolled percentage was 1', () => {
    spyOn(GroundCombat, "rollPercentage").and.returnValue(1);
    expect(GroundCombat.rollHit(1)).toEqual(false);
  });

  it('should return false if hit chance is 50 and rolled percentage was 50', () => {
    spyOn(GroundCombat, "rollPercentage").and.returnValue(50);
    expect(GroundCombat.rollHit(50)).toEqual(false);
  });

  it('should return false if hit chance is 50 and rolled percentage was 51', () => {
    spyOn(GroundCombat, "rollPercentage").and.returnValue(51);
    expect(GroundCombat.rollHit(50)).toEqual(false);
  });

  it('should return true if hit chance is 50 and rolled percentage was 49', () => {
    spyOn(GroundCombat, "rollPercentage").and.returnValue(49);
    expect(GroundCombat.rollHit(50)).toEqual(true);
  });

  it('should return false if hit chance is 99 and rolled percentage was 100', () => {
    spyOn(GroundCombat, "rollPercentage").and.returnValue(100);
    expect(GroundCombat.rollHit(99)).toEqual(false);
  });

  it('should return true if hit chance is 99 and rolled percentage was 98', () => {
    spyOn(GroundCombat, "rollPercentage").and.returnValue(98);
    expect(GroundCombat.rollHit(99)).toEqual(true);
  });
});

describe('getHitChance()', () => {

  it('hit chance should be 58 if all inputs are 0', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 0,/* optimumRange */ 0,/* currentRange */ 0,
      /* weaponDropOff */ 0,/* dex */ 0,/* pwSkill */ 0,
      /* npwSkill */ 0,/* hwSkill */ 0,/* lightSkill */ 0,
      /* attackForce */ false,/* weaponClass */ WeaponClass.Projectile,/* damageType */ DamageType.EnergyP,
      /* dualWielded */ false,/* attackUnitType */ UnitType.Soft)).toEqual(58);
  });

  it('hit chance should be 29 if all inputs are 1 and weapon is dual-wielded off-hand', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 1,/* optimumRange */ 1,/* currentRange */ 1,
      /* weaponDropOff */ 1,/* dex */ 1,/* pwSkill */ 1,
      /* npwSkill */ 1,/* hwSkill */ 1,/* lightSkill */ 1,
      /* attackForce */ true,/* weaponClass */ WeaponClass.Projectile,/* damageType */ DamageType.EnergyP,
      /* dualWielded */ true,/* attackUnitType */ UnitType.Soft)).toEqual(29);
  });

  it('hit chance should be 72 if at average skill values, no range or dual-wielding penalties', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 3,/* optimumRange */ 4,/* currentRange */ 4,
      /* weaponDropOff */ 4.5,/* dex */ 3,/* pwSkill */ 2,
      /* npwSkill */ 2,/* hwSkill */ 2,/* lightSkill */ 0,
      /* attackForce */ false,/* weaponClass */ WeaponClass.Projectile,/* damageType */ DamageType.EnergyP,
      /* dualWielded */ false,/* attackUnitType */ UnitType.Soft)).toEqual(72);
  });

  it('hit chance should be 36 if at average skill values with dual-wielding penalties as a non-droid', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 3,/* optimumRange */ 4,/* currentRange */ 4,
      /* weaponDropOff */ 4.5,/* dex */ 3,/* pwSkill */ 2,
      /* npwSkill */ 2,/* hwSkill */ 2,/* lightSkill */ 0,
      /* attackForce */ false,/* weaponClass */ WeaponClass.Projectile,/* damageType */ DamageType.EnergyP,
      /* dualWielded */ true,/* attackUnitType */ UnitType.Soft)).toEqual(36);
  });

  it('hit chance should be 72 if at average skill values with dual-wielding penalties as a droid', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 3,/* optimumRange */ 4,/* currentRange */ 4,
      /* weaponDropOff */ 4.5,/* dex */ 3,/* pwSkill */ 2,
      /* npwSkill */ 2,/* hwSkill */ 2,/* lightSkill */ 0,
      /* attackForce */ false,/* weaponClass */ WeaponClass.Projectile,/* damageType */ DamageType.EnergyP,
      /* dualWielded */ true,/* attackUnitType */ UnitType.Mechanical)).toEqual(72);
  });

  it('hit chance should be ~71.11 if at average skill values with range penalty of -2', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 3,/* optimumRange */ 4,/* currentRange */ 2,
      /* weaponDropOff */ 4.5,/* dex */ 3,/* pwSkill */ 2,
      /* npwSkill */ 2,/* hwSkill */ 2,/* lightSkill */ 0,
      /* attackForce */ false,/* weaponClass */ WeaponClass.Projectile,/* damageType */ DamageType.EnergyP,
      /* dualWielded */ false,/* attackUnitType */ UnitType.Soft)).toBeCloseTo(71.11, 2);
  });

  it('hit chance should be ~35.56 if at average skill values with range penalty of -2 and dual-wielding penalties', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 3,/* optimumRange */ 4,/* currentRange */ 2,
      /* weaponDropOff */ 4.5,/* dex */ 3,/* pwSkill */ 2,
      /* npwSkill */ 2,/* hwSkill */ 2,/* lightSkill */ 0,
      /* attackForce */ false,/* weaponClass */ WeaponClass.Projectile,/* damageType */ DamageType.EnergyP,
      /* dualWielded */ true,/* attackUnitType */ UnitType.Soft)).toBeCloseTo(35.56, 2);
  });

  it('hit chance should be 83 if all skill values are at maximum, no penalties, forcie attacking with lightsaber', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 5,/* optimumRange */ 4,/* currentRange */ 4,
      /* weaponDropOff */ 4.5,/* dex */ 5,/* pwSkill */ 5,
      /* npwSkill */ 5,/* hwSkill */ 5,/* lightSkill */ 5,
      /* attackForce */ true,/* weaponClass */ WeaponClass.NonProjectile,/* damageType */ DamageType.Lightsaber,
      /* dualWielded */ false,/* attackUnitType */ UnitType.Soft)).toEqual(83);
  });

  it('hit chance should be 99 if attack skills are at maximum but dodge is 0, no penalties, forcie attacking with lightsaber', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 0,/* optimumRange */ 4,/* currentRange */ 4,
      /* weaponDropOff */ 4.5,/* dex */ 5,/* pwSkill */ 5,
      /* npwSkill */ 5,/* hwSkill */ 5,/* lightSkill */ 5,
      /* attackForce */ true,/* weaponClass */ WeaponClass.NonProjectile,/* damageType */ DamageType.Lightsaber,
      /* dualWielded */ false,/* attackUnitType */ UnitType.Soft)).toEqual(99);
  });

  it('hit chance should be 3 if dodge is at maximum but attack skills are all 0, no penalties, forcie attacking with lightsaber', () => {
    expect(GroundCombat.getHitChance(
      /* defendDodge */ 5,/* optimumRange */ 4,/* currentRange */ 4,
      /* weaponDropOff */ 4.5,/* dex */ 0,/* pwSkill */ 0,
      /* npwSkill */ 0,/* hwSkill */ 0,/* lightSkill */ 0,
      /* attackForce */ true,/* weaponClass */ WeaponClass.NonProjectile,/* damageType */ DamageType.Lightsaber,
      /* dualWielded */ false,/* attackUnitType */ UnitType.Soft)).toEqual(3);
  });
});

describe('getDodgeThreshold()', () => {

  it('should return 58 if both dodge and attackSkill are 0', () => {
    expect(GroundCombat.getDodgeThreshold(0, 0)).toEqual(58);
  });

  it('should return 83 if Dodge 2, attackSkill 4', () => {
    expect(GroundCombat.getDodgeThreshold(2, 4)).toEqual(83);
  });

  it('should return 83 if Dodge 2, attackSkill 4.5', () => {
    expect(GroundCombat.getDodgeThreshold(2, 4.5)).toEqual(83);
  });

  it('should return 72 if Dodge 3, attackSkill 4', () => {
    expect(GroundCombat.getDodgeThreshold(3, 4)).toEqual(72);
  });

  it('should return 92 if Dodge 2, attackSkill 5', () => {
      expect(GroundCombat.getDodgeThreshold(2, 5)).toEqual(92);
  });

  it('should return 72 if Dodge 2, attackSkill 3.5', () => {
      expect(GroundCombat.getDodgeThreshold(2, 3.5)).toEqual(72);
  });

  it('should return 99 if Dodge 0, attackSkill 7.5', () => {
    expect(GroundCombat.getDodgeThreshold(0, 7.5)).toEqual(99);
  });

  it('should return 3 if Dodge 5, attackSkill 0', () => {
    expect(GroundCombat.getDodgeThreshold(5, 0)).toEqual(3);
  });

  it('should return 83 if Dodge 5, attackSkill 7.5', () => {
    expect(GroundCombat.getDodgeThreshold(5, 7.5)).toEqual(83);
  });

  it('should return error if Dodge 5, attackSkill 8', () => {
    expect(() => GroundCombat.getDodgeThreshold(5, 8)).toThrow(new Error("Invalid attack skill value."));
  });

  it('should return error if Dodge 5, attackSkill -1', () => {
    expect(() => GroundCombat.getDodgeThreshold(5, -1)).toThrow(new Error("Invalid attack skill value."));
  });

  it('should return error if Dodge 6, attackSkill 7.5', () => {
    expect(() => GroundCombat.getDodgeThreshold(6, 7.5)).toThrow(new Error("Invalid dodge skill value."));
  });

  it('should return error if Dodge -1, attackSkill 7.5', () => {
    expect(() => GroundCombat.getDodgeThreshold(-1, 7.5)).toThrow(new Error("Invalid dodge skill value."));
  });
});

describe('getRangeModifier()', () => {

  it('should return 1 if all inputs are 0', () => {
    expect(GroundCombat.getRangeModifier(0, 0, 0, WeaponClass.Projectile)).toEqual(1);
  });

  it('should return 1 if optimumRange and currentRange are the same', () => {
    expect(GroundCombat.getRangeModifier(6, 6, 4.5, WeaponClass.Projectile)).toEqual(1);
  });

  it('should return ~0.1602 if optimumRange is 1, currentRange is 0, and weaponDropOff is 0', () => {
    expect(GroundCombat.getRangeModifier(1, 0, 0, WeaponClass.Projectile)).toBeCloseTo(0.1602, 3);
  });

  it('should return ~0.7325 if optimumRange is 6, currentRange is 2, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(6, 2, 4.5, WeaponClass.Projectile)).toBeCloseTo(0.7325, 3);
  });

  it('should return ~0.9459 if optimumRange is 6, currentRange is 3, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(6, 3, 4.5, WeaponClass.Projectile)).toBeCloseTo(0.9459, 3);
  });

  it('should return ~0.2904 if optimumRange is 6, currentRange is 1, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(6, 1, 4.5, WeaponClass.Projectile)).toBeCloseTo(0.2904, 3);
  });

  it('should return ~0.0353 if optimumRange is 7, currentRange is 0, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(7, 0, 4.5, WeaponClass.Projectile)).toBeCloseTo(0.0353, 3);
  });

  it('should return 0 if optimumRange is 21, currentRange is 0, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(21, 0, 4.5, WeaponClass.Projectile)).toEqual(0);
  });

  it('should return 0 if currentRange > 0 and attacking with NPW weapon', () => {
    expect(GroundCombat.getRangeModifier(6, 3, 4.5, WeaponClass.NonProjectile)).toEqual(0);
  });

  it('should return 1 if attacking with NPW and currentRange is 0', () => {
    expect(GroundCombat.getRangeModifier(0, 0, 4.5, WeaponClass.NonProjectile)).toEqual(1);
  });
});

describe('getAttackSkill()', () => {

    it('should return 0 if all skills are 0', () => {
        expect(GroundCombat.getAttackSkill(0, 0)).toEqual(0);
    });

    it('should return 4 if Dex 3, weaponSkill 2', () => {
        expect(GroundCombat.getAttackSkill(3, 2)).toEqual(4);
    });

    it('should return 5 if Dex 3, weaponSkill 4', () => {
        expect(GroundCombat.getAttackSkill(3, 4)).toEqual(5);
    });

    it('should return 3.5 if Dex 3, weaponSkill 1', () => {
        expect(GroundCombat.getAttackSkill(3, 1)).toEqual(3.5);
    });

    it('should return 4.5 if Dex 3, weaponSkill 3', () => {
        expect(GroundCombat.getAttackSkill(3, 3)).toEqual(4.5);
    });

    it('should return 7.5 if the final result is greater than 7.5', () => {
        expect(GroundCombat.getAttackSkill(30, 5)).toEqual(7.5);
    });

    it('should return 0 if the final result is less than 0', () => {
        expect(GroundCombat.getAttackSkill(-30, 0)).toEqual(0);
    });

    it('should return 7.5 if Dex 5, weaponSkill 5', () => {
      expect(GroundCombat.getAttackSkill(5, 5)).toEqual(7.5);
    });
});

describe('getWeaponSkill()', () => {

    it('should return 0 if all skills are 0', () => {
      expect(GroundCombat.getWeaponSkill(0, 0, 0, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toEqual(0);
    });

    it('should return 2 if PW 2, NPW 4, HW 1, and attacking with projectile', () => {
      expect(GroundCombat.getWeaponSkill(2, 4, 1, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toEqual(2);
    });

    it('should return 4 if PW 2, NPW 4, HW 1, and attacking with non-projectile', () => {
        expect(GroundCombat.getWeaponSkill(2, 4, 1, 0, false, WeaponClass.NonProjectile, DamageType.PhysicalP)).toEqual(4);
    });

    it('should return 1 if PW 2, NPW 4, HW 1, and attacking with heavy projectile', () => {
        expect(GroundCombat.getWeaponSkill(2, 4, 1, 0, false, WeaponClass.HeavyProjectile, DamageType.EnergyH)).toEqual(1);
    });

    it('should return 2 if PW 2, NPW 4, HW 1, not a forcie, and attacking with lightsaber', () => {
        expect(GroundCombat.getWeaponSkill(2, 4, 1, 0, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(2);
    });

    it('should return 3 if PW 0, NPW 2, HW 1, forcie with LS 5, and attacking with lightsaber', () => {
        expect(GroundCombat.getWeaponSkill(0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(3);
    });

    it('should return 5 if PW 0, NPW 5, HW 1, forcie with LS 5, and attacking with lightsaber', () => {
      expect(GroundCombat.getWeaponSkill(0, 5, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(5);
    });

    it('should return 5 if PW 2, NPW 4, HW 5, and attacking with heavy projectile', () => {
      expect(GroundCombat.getWeaponSkill(2, 4, 5, 0, false, WeaponClass.HeavyProjectile, DamageType.EnergyH)).toEqual(5);
    });

    it('should return 2 if PW 2, NPW 4, HW 1, not a forcie with LS, and attacking with lightsaber', () => {
      expect(GroundCombat.getWeaponSkill(2, 4, 1, 5, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(2);
    });

    it('should return error if Lightsaber skill is 6', () => {
      expect(() => GroundCombat.getWeaponSkill(2, 4, 1, 6, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toThrow(new Error("Invalid lightsaber skill value."));
    });

    it('should return error if Lightsaber skill is -1', () => {
      expect(() => GroundCombat.getWeaponSkill(2, 4, 1, -1, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toThrow(new Error("Invalid lightsaber skill value."));
    });

    it('should return error if NPW skill is 6', () => {
      expect(() => GroundCombat.getWeaponSkill(2, 6, 1, 5, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toThrow(new Error("Invalid npwSkill skill value."));
    });

    it('should return error if NPW skill is -1', () => {
      expect(() => GroundCombat.getWeaponSkill(2, -1, 1, 5, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toThrow(new Error("Invalid npwSkill skill value."));
    });
});
