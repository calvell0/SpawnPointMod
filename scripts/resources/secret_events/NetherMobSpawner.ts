import { SecretEvent } from "../models/SecretEvent";
import { PlayerDimensionChangeAfterEvent, system, Vector3 } from "@minecraft/server";
import { getRandomNewLocation, pickRandomUnweighted } from "../Utilities";

export class NetherMobSpawner implements SecretEvent {
  private static netherEntityList: string[] = [ "ghast", "magma_cube", "skeleton", "pig" ];
  annoyingLevel: number = 5;

  constructor() {
    this.run = this.run.bind(this);
    this.clearNetherspawnHandle = this.clearNetherspawnHandle.bind(this);
  }

  run(event: PlayerDimensionChangeAfterEvent): void {
    const { player } = event;
    console.warn("nether run called");
    const handle: number = system.runInterval(() => {
      const spawnLocation: Vector3 = getRandomNewLocation(player.getHeadLocation(), 35);
      const mobToSpawn: string = pickRandomUnweighted(NetherMobSpawner.netherEntityList);
      console.warn(`Spawning ${ mobToSpawn } at ${ spawnLocation }`);
      player.dimension.spawnEntity(`minecraft:${ mobToSpawn }`, spawnLocation);
    }, 400);
    player.setDynamicProperty("netherspawn:handle", handle);
  }

  clearNetherspawnHandle(event: PlayerDimensionChangeAfterEvent): void {
    const { player } = event;
    let handle;
    if (!(handle = player.getDynamicProperty("netherspawn:handle") as number)) {
      return;
    }

    system.clearRun(handle);
  }


}