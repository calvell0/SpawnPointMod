import Command from "../model/Command";
import { ChatSendBeforeEvent, DimensionLocation, Player, Vector3, world } from "@minecraft/server";
import Utilities from "../Utilities";
import SpawnPointService from "../../SpawnPointService";

export default class SetSpawn implements Command {
  private text: string = "!setspawn";
  private description: string = "Set a secondary spawn point at your current location";
  private spawnService: SpawnPointService = SpawnPointService.getSpawnService();

  constructor() {
  }

  handle(command: string[], player: Player) {
    if (player.dimension !== world.getDimension("overworld")){
      player.sendMessage(`Error: can't set spawn points in dimension: ${player.dimension.id}`);
      return;
    }
    this.spawnService.registerPlayerSpawn(player);
    const { x, y, z } = player.location;
    player.sendMessage(`Added a new spawn point: x:${x}, y:${y}, z:${z}`);
  }

  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }
}
