import Command from "../model/Command";
import { ChatSendBeforeEvent, world } from "@minecraft/server";
import SpawnPointService from "../../SpawnPointService";


export default class SetSpawn implements Command {
  private text: string = "!setspawn";
  private description: string = "Set a secondary spawn point at your current location";
  private spawnService: SpawnPointService;



  handle(event: ChatSendBeforeEvent, command?: string[]) {
    const player = event.sender;
    if (player.dimension !== world.getDimension("overworld")){
      player.sendMessage(`§cError: can't set spawn points in dimension: ${player.dimension.id}`);
      return;
    }
    this.spawnService.registerPlayerSpawn(player);
    const { x, y, z } = player.location;
    player.sendMessage(`Added a new spawn point: §3${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}`);
  }

  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }

  getSyntax(): string {
    return this.text;
  }

  constructor() {
    this.spawnService = SpawnPointService.getSpawnService();
    this.getText = this.getText.bind(this);
    this.getDescription = this.getDescription.bind(this);
  }

}
