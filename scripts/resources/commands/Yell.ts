import Command from "../models/Command";
import { ChatSendBeforeEvent, system, world } from "@minecraft/server";
import PlayerInterface from "../../services/PlayerInterface";
import { replaceSpaces } from "../Utilities";

export default class Yell implements Command {

  private text = "!yell";
  private description = "Send a loud message to a player";
  private syntax = "§3!yell§f <§3username§f> <§3message§f>";
  private readonly privileged: boolean = false;
  private readonly MIN_ARGS: number = 2;

  constructor() {
    this.isPrivileged = this.isPrivileged.bind(this);
  }

  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }

  getSyntax(): string {
    return this.syntax;
  }

  getMinArgs(): number {
    return this.MIN_ARGS;
  }

  run(event: ChatSendBeforeEvent, args?: string[]): void {
    if (!args) {
      event.sender.sendMessage("§cSyntax error. Correct syntax: §f" + this.syntax);
      return;
    }
    let [ target, ...message ] = args;
    target = replaceSpaces(target);
    const targetPlayer = world.getPlayers().filter((val) => val.name.equalsIgnoreCase(target));
    if (!targetPlayer[0]) {
      event.sender.sendMessage(`§cPlayer \"${ target }\" not found`);
      return;
    }
    system.run(() => PlayerInterface.setTitle(targetPlayer[0], message.join(" ")));
  }

  isPrivileged(): boolean {
    return this.privileged;
  }


}