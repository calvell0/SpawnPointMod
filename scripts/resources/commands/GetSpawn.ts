import Command from "../models/Command";
import { ChatSendBeforeEvent, Vector3 } from "@minecraft/server";
import { coordsToString } from "../Utilities";
import SpawnPointService from "../../services/SpawnPointService";

export default class GetSpawn implements Command {
  private text: string = "!getspawn";
  private description: string = "View your current spawn point(s)";
  private readonly privileged: boolean = false;
  private spawnService: SpawnPointService;
  private readonly MIN_ARGS: number = 0;

  constructor(spawnService: SpawnPointService) {
    this.spawnService = spawnService;
  }

  getSyntax(): string {
    return this.text;
  }

  getText(): string {
    return this.text;
  }

  getDescription(): string {
    return this.description;
  }

  getMinArgs(): number {
    return this.MIN_ARGS;
  }

  run(event: ChatSendBeforeEvent, args?: string[]): void {
    const player = event.sender;
    const spawnLoc: Vector3 | undefined = player.getDynamicProperty("spawn:secondary") as Vector3 | undefined;
    const message = !!(spawnLoc) ?
      `Current secondary spawn point: §3${ coordsToString(spawnLoc) }` :
      "§cSecondary spawn point not found";
    player.sendMessage(message);
  }

  isPrivileged(): boolean {
    return this.privileged;
  }

}