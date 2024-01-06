import { ChatSendBeforeEvent } from "@minecraft/server";

export default interface Command {

  handle(event: ChatSendBeforeEvent, command?: string[]): void;
  getText(): string;
  getDescription(): string;
  getSyntax(): string;
}


