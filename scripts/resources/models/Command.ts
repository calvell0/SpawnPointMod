import { ChatSendBeforeEvent } from "@minecraft/server";
import ModEvent from "./ModEvent";

export default interface Command extends ModEvent {

  run(event: ChatSendBeforeEvent, args?: string[]): void;

  getText(): string;

  getDescription(): string;

  getSyntax(): string;

  isPrivileged(): boolean;

  getMinArgs(): number;
}


