import SecretEventService from "../../SecretEventService";
import { SecretEvent } from "../model/SecretEvent";
import { Entity, PlayerDimensionChangeAfterEvent, system, Vector3 } from "@minecraft/server";
import { getRandomNewLocation, pickRandomUnweighted } from "../Utilities";

export class NetherMobSpawner implements SecretEvent{
  annoyingLevel: number = 5;
  private static netherEntityList: string[] = ["ghast", "magma_cube", "skeleton"];

  run(event: PlayerDimensionChangeAfterEvent): void {
    const { player } = event;
    const handle: number = system.runInterval(() => {
      const spawnLocation: Vector3 = getRandomNewLocation(player.getHeadLocation(), 35);
      const mobToSpawn: string = pickRandomUnweighted(NetherMobSpawner.netherEntityList);
      player.dimension.spawnEntity(`minecraft:${mobToSpawn}`, spawnLocation);
    }, 400);
    player.setDynamicProperty("netherspawn:handle", handle);
  }

  clearNetherspawnHandle(event: PlayerDimensionChangeAfterEvent):void {
    const { player } = event;
    let handle;
    if(!(handle = player.getDynamicProperty("netherspawn:handle") as number)){
      return;
    }

    system.clearRun(handle);
  }

}