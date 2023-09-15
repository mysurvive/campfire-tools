import { Camping } from "../camping/camping";
import { Migration } from "./migration";

export class Migration2 extends Migration {
  constructor() {
    super(2);
  }

  override migrateCamping(camping: Camping): void {
    if (camping.increaseWatchActorNumber === undefined) {
      camping.increaseWatchActorNumber = 0;
    }
    if (camping.actorUuidsNotKeepingWatch === undefined) {
      camping.actorUuidsNotKeepingWatch = [];
    }
    if (camping.ignoreSkillRequirements === undefined) {
      camping.ignoreSkillRequirements = false;
    }
  }
}
