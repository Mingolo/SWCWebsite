export class InfantrySquadResult {

  constructor(
    public squadName: string = '', public victories: number = 0, public percentage: number = 0,
    public totalUnits: number = 0, public unitsLeft: number = 0, public roundsTaken: number = 0,
    public maxHP: number = 0, public hpLeft: number = 0,
    public maxShields: number = 0, public shieldsLeft: number = 0,
    public maxIonic: number = 0, public ionicLeft: number = 0) {

  }
}
