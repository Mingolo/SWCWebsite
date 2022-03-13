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

export const chartXAxis = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];

export const statsForm = {
  squadName: ['', [Validators.required]],
  squadSize: ['', [Validators.required]],
  range: ['', [Validators.required]],
  tactic1: ['', [Validators.required]],
  tactic2: ['', [Validators.required]],
  switchRound: ['', [Validators.required]],
  strength: ['', [Validators.required]],
  dex: ['', [Validators.required]],
  dodge: ['', [Validators.required]],
  pwSkill: ['', [Validators.required]],
  npwSkill: ['', [Validators.required]],
  lightSkill: ['', [Validators.required]],
  force: ['', [Validators.required]],
  isDroid: ['', [Validators.required]],
  hp: ['', [Validators.required]],
  deflectors: ['', [Validators.required]],
  ionic: ['', [Validators.required]],
  level: ['', [Validators.required]],
  hpMult: ['', [Validators.required]],
  armor: ['', [Validators.required]],
  primaryClass: ['', [Validators.required]],
  primaryType: ['', [Validators.required]],
  primaryFirepower: ['', [Validators.required]],
  primaryMinDamage: ['', [Validators.required]],
  primaryMaxDamage: ['', [Validators.required]],
  primaryOptRange: ['', [Validators.required]],
  primaryDropOff: ['', [Validators.required]],
  primaryMaxHits: ['', [Validators.required]],
  secondaryClass: ['', [Validators.required]],
  secondaryType: ['', [Validators.required]],
  secondaryDualWield: ['', [Validators.required]],
  secondaryFirepower: ['', [Validators.required]],
  secondaryMinDamage: ['', [Validators.required]],
  secondaryMaxDamage: ['', [Validators.required]],
  secondaryOptRange: ['', [Validators.required]],
  secondaryDropOff: ['', [Validators.required]],
  secondaryMaxHits: ['', [Validators.required]]
};

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
