import { Camping } from "../camping/camping";

export abstract class Migration {
  protected constructor(public readonly version: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  migrateCamping(camping: Camping): void {}
}
