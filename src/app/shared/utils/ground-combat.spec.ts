import { TestBed } from '@angular/core/testing';
import { GroundCombat } from './ground-combat.util';

describe('GroundCombatUtilityTests', () => {
  
    it('should return true if the value is included in the string array', () => {  
        expect(GroundCombat.getDay()).toBe(true);
      });
  });