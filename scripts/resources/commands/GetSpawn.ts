import Command from "../model/Command";
import { ChatSendBeforeEvent, Vector3 } from "@minecraft/server";
import { coordsToString } from "../Utilities";
import { message } from "gulp-typescript/release/utils";
import SpawnPointService from "../../SpawnPointService";

export default class GetSpawn implements Command{
  private text: string = "!getspawn";
  private description: string = "View your current spawn point(s)";
  private readonly privileged: boolean = false;
  private spawnService: SpawnPointService;

  getSyntax(): string {
    return this.text;
  }

  getText(): string {
    return this.text;
  }

  getDescription(): string {
    return this.description;
  }

  run(event: ChatSendBeforeEvent, args?: string[]): void {
    const player = event.sender;
    const spawnLoc: Vector3 | undefined = player.getDynamicProperty("spawn:secondary") as Vector3 | undefined;
    const message = !!(spawnLoc) ?
      `Current secondary spawn point: §3${coordsToString(spawnLoc)}` :
      "§cSecondary spawn point not found";
    player.sendMessage(message);
  }

  isPrivileged(): boolean {
    return this.privileged;
  }

  constructor(spawnService: SpawnPointService) {
    this.spawnService = spawnService;
  }

}