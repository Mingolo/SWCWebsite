import { TestBed } from '@angular/core/testing';
import { DamageType, WeaponClass } from './ground-combat-constants';
import { GroundCombat } from './ground-combat.util';


describe('getRangeModifier()', () => {

  it('should return 0.525 if all inputs are 0', () => {
    expect(GroundCombat.getRangeModifier(0, 0, 0)).toEqual(0.525);
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
        expect(GroundCombat.getAttackSkill(0, 0, 0, 0, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toEqual(0);
    });

    it('should return 4 if Dex 3, PW 2, NPW 4, HW 1, and attacking with projectile', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toEqual(4);
    });

    it('should return 5 if Dex 3, PW 2, NPW 4, HW 1, and attacking with non-projectile', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 0, false, WeaponClass.NonProjectile, DamageType.PhysicalP)).toEqual(5);
    });

    it('should return 3.5 if Dex 3, PW 2, NPW 4, HW 1, and attacking with heavy projectile', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 0, false, WeaponClass.HeavyProjectile, DamageType.EnergyH)).toEqual(3.5);
    });

    it('should return 4 if Dex 3, PW 2, NPW 4, HW 1, not a forcie, and attacking with lightsaber', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 5, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(4);
    });

    it('should return 4.5 if Dex 3, PW 0, NPW 2, HW 1, forcie with LS 5, and attacking with lightsaber', () => {
        expect(GroundCombat.getAttackSkill(3, 0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(4.5);
    });

    it('should return 7.5 if the final result is greater than 7.5', () => {
        expect(GroundCombat.getAttackSkill(30, 0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(7.5);
    });

    it('should return 0 if the final result is less than 0', () => {
        expect(GroundCombat.getAttackSkill(-30, 0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toEqual(0);
    });

    it('should return 7.5 if Dex 5, PW 2, NPW 5, HW 1, and attacking with non-projectile', () => {
      expect(GroundCombat.getAttackSkill(5, 2, 5, 1, 0, false, WeaponClass.NonProjectile, DamageType.PhysicalP)).toEqual(7.5);
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
});
