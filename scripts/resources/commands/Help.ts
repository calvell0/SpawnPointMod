import Command from "../model/Command";
import { ChatSendBeforeEvent, Player, Vector3 } from "@minecraft/server";
import commands from "./index";
export default class Help implements Command{
  private text = "!help";
  private description = "Lists all available commands";
  private readonly privileged: boolean = false;
  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }

  getSyntax(): string {
    return this.text;
  }

  run(event: ChatSendBeforeEvent, args?: string[]): void {
    let helpMsg: string = "";
    for (let cmd of commands){
        if (!this.hasPermission(event.sender, cmd)) return;
        let cmdMsg = `§3${cmd.getText()}: §f${cmd.getDescription()}\n`;
        helpMsg += cmdMsg;
    }
    event.sender.sendMessage(helpMsg);
  }

  hasPermission(player: Player, command: Command){
    return (!command.isPrivileged()) || player.isOp();
  }

  isPrivileged(): boolean {
    return this.privileged;
  }

}