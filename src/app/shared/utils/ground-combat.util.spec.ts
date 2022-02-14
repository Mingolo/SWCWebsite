import { TestBed } from '@angular/core/testing';
import { DamageType, WeaponClass } from './ground-combat-constants';
import { GroundCombat } from './ground-combat.util';

describe('getAttackSkill()', () => {

    it('should return 0 if all skills are 0', () => {
        expect(GroundCombat.getAttackSkill(0, 0, 0, 0, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toBe(0);
    });

    it('should return 4 if Dex 3, PW 2, NPW 4, HW 1, and attacking with projectile', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toBe(4);
    });

    it('should return 5 if Dex 3, PW 2, NPW 4, HW 1, and attacking with non-projectile', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 0, false, WeaponClass.NonProjectile, DamageType.PhysicalP)).toBe(5);
    });

    it('should return 3.5 if Dex 3, PW 2, NPW 4, HW 1, and attacking with heavy projectile', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 0, false, WeaponClass.HeavyProjectile, DamageType.EnergyH)).toBe(3.5);
    });

    it('should return 4 if Dex 3, PW 2, NPW 4, HW 1, not a forcie, and attacking with lightsaber', () => {
        expect(GroundCombat.getAttackSkill(3, 2, 4, 1, 5, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toBe(4);
    });

    it('should return 4.5 if Dex 3, PW 0, NPW 2, HW 1, forcie with LS 5, and attacking with lightsaber', () => {
        expect(GroundCombat.getAttackSkill(3, 0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toBe(4.5);
    });

    it('should return 7.5 if the final result is greater than 7.5', () => {
        expect(GroundCombat.getAttackSkill(30, 0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toBe(7.5);
    });

    it('should return 0 if the final result is less than 0', () => {
        expect(GroundCombat.getAttackSkill(-30, 0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toBe(0);
    });

    it('should return 7.5 if Dex 5, PW 2, NPW 5, HW 1, and attacking with non-projectile', () => {
      expect(GroundCombat.getAttackSkill(5, 2, 5, 1, 0, false, WeaponClass.NonProjectile, DamageType.PhysicalP)).toBe(7.5);
    });
});

describe('getWeaponSkill()', () => {

    it('should return 0 if all skills are 0', () => {
      expect(GroundCombat.getWeaponSkill(0, 0, 0, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toBe(0);
    });

    it('should return 2 if Dex 3, PW 2, NPW 4, HW 1, and attacking with projectile', () => {
      expect(GroundCombat.getWeaponSkill(2, 4, 1, 0, false, WeaponClass.Projectile, DamageType.EnergyP)).toBe(2);
    });

    it('should return 4 if Dex 3, PW 2, NPW 4, HW 1, and attacking with non-projectile', () => {
        expect(GroundCombat.getWeaponSkill(2, 4, 1, 0, false, WeaponClass.NonProjectile, DamageType.PhysicalP)).toBe(4);
    });

    it('should return 1 if Dex 3, PW 2, NPW 4, HW 1, and attacking with heavy projectile', () => {
        expect(GroundCombat.getWeaponSkill(2, 4, 1, 0, false, WeaponClass.HeavyProjectile, DamageType.EnergyH)).toBe(1);
    });

    it('should return 2 if Dex 3, PW 2, NPW 4, HW 1, not a forcie, and attacking with lightsaber', () => {
        expect(GroundCombat.getWeaponSkill(2, 4, 1, 5, false, WeaponClass.NonProjectile, DamageType.Lightsaber)).toBe(2);
    });

    it('should return 3 if Dex 3, PW 0, NPW 2, HW 1, forcie with LS 5, and attacking with lightsaber', () => {
        expect(GroundCombat.getWeaponSkill(0, 2, 1, 5, true, WeaponClass.NonProjectile, DamageType.Lightsaber)).toBe(3);
    });
});
