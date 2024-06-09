import { ChatSendBeforeEvent, Player } from "@minecraft/server";

import Command from "../resources/models/Command";
import EventDispatcher from "./EventDispatcher";


export default class CommandReader {

  private eventDispatcher: EventDispatcher;
  private readonly allCommands: Command[];

  constructor(eventDispatcher: EventDispatcher, allCommands: Command[]) {
    this.eventDispatcher = eventDispatcher;
    this.allCommands = allCommands;
    this.parseCommmand = this.parseCommmand.bind(this);
    this.canRunCommand = this.canRunCommand.bind(this);
  }


  parseCommmand(event: ChatSendBeforeEvent): void {
    const chat: string = event.message;

    event.cancel = true;
    let commandArgs: string[] = chat.split(" ");
    const [ chatCommand, ...args ] = commandArgs;

    for (let cmd of this.allCommands) {
      if (chatCommand.equalsIgnoreCase(cmd.getText())) {
        if (this.canRunCommand(event.sender, cmd, args)) {
          if (!this.hasEnoughArgs(cmd, args)) {
            event.sender.sendMessage(`§cNot enough arguments. Correct syntax: §f${ cmd.getSyntax() }`);
            return;
          }
          this.eventDispatcher.runEvent(cmd, event, args);
          return;
        }

      }
    }
    event.sender.sendMessage("§c Error: Invalid command. Type §3!help §cto see a list of commands.");
  }

  /**
   * returns true if the player has permission to run the command
   * @param player
   * @param command
   * @param args
   */
  canRunCommand(player: Player, command: Command, args: string[] | string | undefined): boolean {
    return (!command.isPrivileged()) || player.isOp();
  };

  hasEnoughArgs(command: Command, args: string[] | string | undefined): boolean {
    let argLength = (args?.length) ? args.length : 0;
    return command.getMinArgs() === 0 || argLength >= command.getMinArgs();
  }


}