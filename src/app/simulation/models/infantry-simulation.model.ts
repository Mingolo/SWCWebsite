import { InfantrySquadResult } from "./infantry-squad-result.model";

export class InfantrySimulation {

  constructor(
    public battles: number, public blueTeam: InfantrySquadResult,
    public redTeam: InfantrySquadResult, public ties: number = 0) {

  }
}
