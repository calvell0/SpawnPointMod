import { Player, WorldBeforeEvents } from "@minecraft/server";

export default interface Command {

  handle(command: string[], player: Player): void;
  getText(): string;
  getDescription(): string;
}


