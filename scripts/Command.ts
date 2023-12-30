import { WorldBeforeEvents } from "@minecraft/server";

interface Command {
  text: string;
  description: string;

  handle(event: any): void;
}

export default Command;
