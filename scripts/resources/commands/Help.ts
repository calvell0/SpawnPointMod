import Command from "../model/Command";
import { ChatSendBeforeEvent, Player, Vector3 } from "@minecraft/server";
import commands from "./index";
export default class Help implements Command{
  private text = "!help";
  private description = "Lists all available commands"
  getDescription(): string {
    return this.description;
  }

  getText(): string {
    return this.text;
  }

  getSyntax(): string {
    return this.text;
  }

  handle(event: ChatSendBeforeEvent, command?: string[]): void {
    let helpMsg: string = "";
    for (let cmd of commands){
        let cmdMsg = `§3${cmd.getText()}: §f${cmd.getDescription()}\n`;
        helpMsg += cmdMsg;
    }
    event.sender.sendMessage(helpMsg);
  }

}