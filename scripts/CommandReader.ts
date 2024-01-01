

import { ChatSendBeforeEvent, Player } from "@minecraft/server";
import Command from "./resources/model/Command";
import allCommands from "./resources/commands/index.js";

/*
Singleton class for reading chat events and parsing commands
 */
export default class CommandReader{
  private constructor() {
    CommandReader.reader = this;
  }



  private static reader: CommandReader | undefined;

  static getCommandReader(): CommandReader {
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
        cmd.handle(args, event.sender);
        return;
      }
    }

  };





}