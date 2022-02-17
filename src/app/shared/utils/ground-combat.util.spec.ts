import { TestBed } from '@angular/core/testing';
import { DamageType, WeaponClass } from './ground-combat-constants';
import { GroundCombat } from './ground-combat.util';


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
    expect(GroundCombat.getRangeModifier(0, 0, 0)).toEqual(1);
  });

  it('should return 1 if optimumRange and currentRange are the same', () => {
    expect(GroundCombat.getRangeModifier(6, 6, 4.5)).toEqual(1);
  });

  it('should return ~0.1602 if optimumRange is 1, currentRange is 0, and weaponDropOff is 0', () => {
    expect(GroundCombat.getRangeModifier(1, 0, 0)).toBeCloseTo(0.1602, 3);
  });

  it('should return ~0.7325 if optimumRange is 6, currentRange is 2, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(6, 2, 4.5)).toBeCloseTo(0.7325, 3);
  });

  it('should return ~0.9459 if optimumRange is 6, currentRange is 3, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(6, 3, 4.5)).toBeCloseTo(0.9459, 3);
  });

  it('should return ~0.2904 if optimumRange is 6, currentRange is 1, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(6, 1, 4.5)).toBeCloseTo(0.2904, 3);
  });

  it('should return ~0.0353 if optimumRange is 7, currentRange is 0, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(7, 0, 4.5)).toBeCloseTo(0.0353, 3);
  });

  it('should return 0 if optimumRange is 21, currentRange is 0, and weaponDropOff is 4.5', () => {
    expect(GroundCombat.getRangeModifier(21, 0, 4.5)).toEqual(0);
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
