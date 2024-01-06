import Command from "../model/Command";
import { ChatSendBeforeEvent, Player, system, world } from "@minecraft/server";
import PlayerInterface from "../../PlayerInterface";

export default class Yell implements Command{
  private text = "!yell";
  private description = "Send a loud message to a player";
  private syntax = "§3!yell§f {§3username§f} {§3message§f}";
  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }

  getSyntax(): string {
    return this.syntax;
  }

  handle(event: ChatSendBeforeEvent, command?: string[]): void {
    if (!command){
      event.sender.sendMessage("§cSyntax error. Correct syntax: §f"+ this.syntax);
      return;
    }
    const [target, ...message] = command;
    const targetPlayer = world.getPlayers().filter((val) => val.name.equalsIgnoreCase(target));
    if (!targetPlayer[0]){
      event.sender.sendMessage(`§cPlayer \"${target}\" not found`);
      return;
    }
    system.run(() => PlayerInterface.setTitle(targetPlayer[0], message.join(" ")));
  }

}