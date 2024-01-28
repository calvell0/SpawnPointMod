

import { ChatSendBeforeEvent, Player } from "@minecraft/server";
import allCommands from "./resources/commands/index";
import Command from "./resources/model/Command";

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
        if (this.canRunCommand(event.sender, cmd) && cmd.run(event, args)) return;

      }
    }
    event.sender.sendMessage("§c Error: Invalid command. Type §3!help §cto see a list of commands.")
  }

  /**
   * returns true if the player has permission to run the command
   * @param player
   * @param command
   */
  canRunCommand(player: Player, command: Command):boolean {
    return (!command.isPrivileged()) || player.isOp();
  }

  private constructor() {
    CommandReader.reader = this;
  }




}