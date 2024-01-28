import Command from "../model/Command";
import { ChatSendBeforeEvent, Player, world } from "@minecraft/server";
import { getActivePlayerByName, getPlayerFromList, replaceSpaces } from "../Utilities";
import SecretEventService from "../../SecretEventService";
import secretEvents from "../secret_events/secretEventIndex";

export class ToggleHarassment implements Command {
  private description: string = "Toggles harassment on target players";
  private text: string = "!toggle";
  private privileged: boolean = true;
  private syntax = "§3!toggle§f <§3username§f>";
  private secretService: SecretEventService;

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

  run(event: ChatSendBeforeEvent, args?: string[]): void{
    const player: Player = event.sender;
    if (!args){
      player.sendMessage("§cSyntax error. Correct syntax: §f"+ this.syntax);
      return;
    }

    const playerName = replaceSpaces(args[0]);
    const targetPlayer = getActivePlayerByName(playerName);

    if (!targetPlayer){
      player.sendMessage(`§cPlayer \"${playerName}\" not found`);
      return;
    }

    const msg = this.secretService.togglePlayerTarget(targetPlayer) ?
      "on" :
      "off";

    player.sendMessage(`Harassment for "${targetPlayer}" toggled ${msg}`);

  }

  constructor(secretService: SecretEventService) {
    this.secretService = secretService;
    this.isPrivileged = this.isPrivileged.bind(this);
  }

}