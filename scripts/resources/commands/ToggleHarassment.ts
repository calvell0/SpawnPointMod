import Command from "../models/Command";
import { ChatSendBeforeEvent, Player } from "@minecraft/server";
import { getActivePlayerByName, replaceSpaces } from "../Utilities";

import PlayerTargetManager from "../../services/PlayerTargetManager";

export default class ToggleHarassment implements Command {
  private description: string = "Toggles harassment on target players";
  private text: string = "!toggle";
  private privileged: boolean = true;
  private syntax = "§3!toggle§f <§3username§f>";
  private playerTargetManager: PlayerTargetManager;
  private readonly MIN_ARGS: number = 1;

  constructor(playerTargetManager: PlayerTargetManager) {
    this.playerTargetManager = playerTargetManager;
    this.isPrivileged = this.isPrivileged.bind(this);

  }

  getDescription(): string {
    return this.description;
  }

  getSyntax(): string {
    return this.text;
  }

  getText(): string {
    return this.text;
  }

  isPrivileged(): boolean {
    return this.privileged;
  }

  getMinArgs(): number {
    return this.MIN_ARGS;
  }

  run(event: ChatSendBeforeEvent, args?: string[]): void {
    const player: Player = event.sender;
    if (!args) {
      player.sendMessage("§cSyntax error. Correct syntax: §f" + this.syntax);
      return;
    }

    const playerName = replaceSpaces(args[0]);
    const targetPlayer = getActivePlayerByName(playerName);

    if (!targetPlayer) {
      player.sendMessage(`§cPlayer \"${ playerName }\" not found`);
      return;
    }

    const status = this.playerTargetManager.togglePlayerTarget(targetPlayer) ?
      "on" :
      "off";

    player.sendMessage(`Harassment for "${ targetPlayer.name }" toggled ${ status }`);

  }

}