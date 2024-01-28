import { ChatSendBeforeEvent } from "@minecraft/server";

export default interface Command {

  run(event: ChatSendBeforeEvent, args?: string[]): void;
  getText(): string;
  getDescription(): string;
  getSyntax(): string;
  isPrivileged(): boolean;
}


