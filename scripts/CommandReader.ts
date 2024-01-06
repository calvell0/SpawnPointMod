

import { ChatSendBeforeEvent, Player } from "@minecraft/server";
import Command from "./resources/model/Command";
import allCommands from "./resources/commands/index";

/*
Singleton class for reading chat events and parsing commands
 */
export default class CommandReader{

  private static reader: CommandReader | undefined;

  static getReader(): CommandReader {
    return CommandReader.reader || new CommandReader();
  }

  handleChatEvents(event: ChatSendBeforeEvent): void {
    const chat: string = event.message;
    if (!chat.startsWith("!")) {
      return;
    }
    event.cancel = true;
    let commandArgs: string[] = chat.split(" ");
    const [chatCommand, ...args] = commandArgs;

    for (let cmd of allCommands){
      if (chatCommand.equalsIgnoreCase(cmd.getText())){
        cmd.handle(event, args);
        return;
      }
    }
    event.sender.sendMessage("§c Error: Invalid command. Type §3!help §cto see a list of commands.")


  };

  private constructor() {
    CommandReader.reader = this;
  }




}