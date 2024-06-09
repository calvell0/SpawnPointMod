import Command from "../models/Command";
import { ChatSendBeforeEvent, Player } from "@minecraft/server";
import commands from "./index";

export default class Help implements Command {
  private text = "!help";
  private description = "Lists all available commands";
  private readonly privileged: boolean = false;
  private readonly MIN_ARGS: number = 0;

  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }

  getSyntax(): string {
    return this.text;
  }

  getMinArgs(): number {
    return this.MIN_ARGS;
  }

  run(event: ChatSendBeforeEvent, args?: string[]): void {
    let helpMsg: string = "";
    for (let cmd of commands) {
      if (!this.hasPermission(event.sender, cmd)) continue;
      let cmdMsg = `§3${ cmd.getText() }: §f${ cmd.getDescription() }\n`;
      helpMsg += cmdMsg;
    }
    event.sender.sendMessage(helpMsg);
  }

  hasPermission(player: Player, command: Command) {
    return (!command.isPrivileged()) || player.isOp();
  }

  isPrivileged(): boolean {
    return this.privileged;
  }

}