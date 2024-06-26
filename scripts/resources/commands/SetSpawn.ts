import Command from "../models/Command";
import { ChatSendBeforeEvent, world } from "@minecraft/server";
import SpawnPointService from "../../services/SpawnPointService";


export default class SetSpawn implements Command {
  private text: string = "!setspawn";
  private description: string = "Set a secondary spawn point at your current location";
  private spawnService: SpawnPointService;
  private readonly privileged: boolean = false;
  private readonly MIN_ARGS: number = 0;

  constructor(spawnService: SpawnPointService) {
    this.spawnService = spawnService;
    this.getText = this.getText.bind(this);
    this.getDescription = this.getDescription.bind(this);
  }

  run(event: ChatSendBeforeEvent, command?: string[]) {
    const player = event.sender;
    if (player.dimension !== world.getDimension("overworld")) {
      player.sendMessage(`§cError: can't set spawn points in dimension: ${ player.dimension.id }`);
      return;
    }
    this.spawnService.registerPlayerSpawn(player);
    const { x, y, z } = player.location;
    player.sendMessage(`Added a new spawn point: §3${ Math.round(x) }, ${ Math.round(y) }, ${ Math.round(z) }`);
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

  isPrivileged(): boolean {
    return this.privileged;
  }

  getMinArgs(): number {
    return this.MIN_ARGS;
  }

}
