import { Validators } from "@angular/forms";

export enum DamageType {
    PhysicalP = 'Physical (P)',
    EnergyP = 'Energy (P)',
    ExplosiveP = 'Explosive (P)',
    IonicP = 'Ionic (P)',
    Lightsaber = 'Lightsaber',
    Poison = 'Poison',
    Nonlethal = 'Nonlethal',
    PhysicalH = 'Physical (H)',
    EnergyH = 'Energy (H)',
    ExplosiveH = 'Explosive (H)',
    IonicH = 'Ionic (H)',
    ConcussiveH = 'Concussive (H)',
    TurbolaserH = 'Turbolaser (H)',
    EnergyO = 'Energy (O)',
    IonicO = 'Ionic (O)'
}

export enum Tactic {
  SpreadFire = 'Spread Fire',
  FocusFire = 'Focus Fire'
}

export enum WeaponClass {
  Projectile = 'Projectile',
  NonProjectile = 'Non-Projectile',
  HeavyProjectile = 'Heavy Projectile'
}

export enum UnitType {
  Soft = 'Soft',
  Mechanical = 'Mechanical',
  Facility = 'Facility',
  Vehicle = 'Vehicle'
}

export const hpRegenInterval = 96;    // hp regen every 24 hours, there are 48 30 minute blocks in 24 hours, and every single of those 48 blocks there are 2 rounds of combat (each squad attacks separately), so 48 * 2 = 96 combat rounds in between each regen
export const ionicRegenInterval = 96;
export const shieldRegenInterval = 4;

export const chartXAxis = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];

export const blueSquadForm = [
  /*squadName*/           "Avg. Lv 10 Stormtroopers",
  /*squadSize*/           12,
  /*range*/               5,
  /*tactic1*/             Tactic.SpreadFire,
  /*tactic2*/             Tactic.SpreadFire,
  /*switchRound*/         0,
  /*strength*/            4,
  /*dex*/                 3,
  /*dodge*/               3,
  /*pwSkill*/             4,
  /*npwSkill*/            2,
  /*lightSkill*/          0,
  /*force*/               false,
  /*isDroid*/             false,
  /*hp*/                  0,
  /*deflectors*/          0,
  /*ionic*/               0,
  /*level*/               10,
  /*hpMult*/              1.0,
  /*armor*/               15,
  /*primaryClass*/        WeaponClass.Projectile,
  /*primaryType*/         DamageType.EnergyP,
  /*primaryDualWield*/    false,
  /*primaryFirepower*/    15,
  /*primaryMinDamage*/    2,
  /*primaryMaxDamage*/    10,
  /*primaryOptRange*/     5,
  /*primaryDropOff*/      4.5,
  /*primaryMaxHits*/      5,
  /*secondaryClass*/      WeaponClass.Projectile,
  /*secondaryType*/       DamageType.EnergyP,
  /*secondaryDualWield*/  false,
  /*secondaryFirepower*/  16,
  /*secondaryMinDamage*/  6,
  /*secondaryMaxDamage*/  18,
  /*secondaryOptRange*/   2,
  /*secondaryDropOff*/    4.5,
  /*secondaryMaxHits*/    3
] as const;

export const redSquadForm = [
  /*squadName*/           "Avg. Lv 10 Riflemen",
  /*squadSize*/           12,
  /*range*/               4,
  /*tactic1*/             Tactic.SpreadFire,
  /*tactic2*/             Tactic.SpreadFire,
  /*switchRound*/         0,
  /*strength*/            4,
  /*dex*/                 3,
  /*dodge*/               3,
  /*pwSkill*/             4,
  /*npwSkill*/            0,
  /*lightSkill*/          0,
  /*force*/               false,
  /*isDroid*/             false,
  /*hp*/                  0,
  /*deflectors*/          0,
  /*ionic*/               0,
  /*level*/               10,
  /*hpMult*/              1.5,
  /*armor*/               15,
  /*primaryClass*/        WeaponClass.Projectile,
  /*primaryType*/         DamageType.EnergyP,
  /*primaryDualWield*/    false,
  /*primaryFirepower*/    17,
  /*primaryMinDamage*/    6,
  /*primaryMaxDamage*/    11,
  /*primaryOptRange*/     4,
  /*primaryDropOff*/      4.5,
  /*primaryMaxHits*/      5,
  /*secondaryClass*/      WeaponClass.Projectile,
  /*secondaryType*/       DamageType.PhysicalP,
  /*secondaryDualWield*/  false,
  /*secondaryFirepower*/  18,
  /*secondaryMinDamage*/  15,
  /*secondaryMaxDamage*/  30,
  /*secondaryOptRange*/   1,
  /*secondaryDropOff*/    4.5,
  /*secondaryMaxHits*/    2
] as const;

export const lsWeaponSkill = [
  [0,1,1,1,2,2],
  [1,1,2,2,2,3],
  [2,2,2,3,3,3],
  [2,3,3,3,3,4],
  [3,3,3,4,4,4],
  [3,4,4,4,5,5]
];

export const dodgeThreshold = [
  [58,72,83,92,97,99,99,99],
  [42,58,72,83,92,97,99,99],
  [28,42,58,72,83,92,97,99],
  [17,28,42,58,72,83,92,97],
  [8,17,28,42,58,72,83,92],
  [3,8,17,28,42,58,72,83]
];

export const damageTypeMods: { [key in DamageType]: { [key in UnitType]: number}} = {
  "Physical (P)": {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 0.10, "Vehicle": 0.10},
  "Energy (P)": {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 0.10, "Vehicle": 0.10},
  "Explosive (P)" : {
      "Soft": 0.10, "Mechanical": 1.00, "Facility": 1.00, "Vehicle": 1.00},
  "Ionic (P)": {
      "Soft": 0.00, "Mechanical": 1.00, "Facility": 0.10, "Vehicle": 0.10},
  "Lightsaber" : {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 1.00, "Vehicle": 1.00},
  "Poison": {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 0.10, "Vehicle": 0.10},
  "Nonlethal": {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 0.10, "Vehicle": 0.10},
  "Physical (H)": {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 1.00, "Vehicle": 1.00},
  "Energy (H)": {
      "Soft": 0.30, "Mechanical": 0.30, "Facility": 0.50, "Vehicle": 1.00},
  "Explosive (H)": {
      "Soft": 0.10, "Mechanical": 0.10, "Facility": 1.00, "Vehicle": 0.50},
  "Ionic (H)": {
      "Soft": 0.00, "Mechanical": 0.10, "Facility": 1.00, "Vehicle": 1.00},
  "Concussive (H)": {
      "Soft": 0.20, "Mechanical": 0.10, "Facility": 0.30, "Vehicle": 1.00},
  "Turbolaser (H)": {
      "Soft": 0.10, "Mechanical": 0.10, "Facility": 1.00, "Vehicle": 0.50},
  "Energy (O)": {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 1.00, "Vehicle": 1.00},
  "Ionic (O)": {
      "Soft": 1.00, "Mechanical": 1.00, "Facility": 1.00, "Vehicle": 1.00 }
}
