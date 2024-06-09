import EventDispatcher from "./EventDispatcher";
import { ChatSendBeforeEvent } from "@minecraft/server";
import CommandReader from "./CommandReader";


export default class ChatEventHandler {

  private eventDispatcher: EventDispatcher;
  private commandReader: CommandReader;

  constructor(eventDispatcher: EventDispatcher, commandReader: CommandReader) {
    this.eventDispatcher = eventDispatcher;
    this.commandReader = commandReader;
    this.handleChat = this.handleChat.bind(this);
  }

  handleChat(event: ChatSendBeforeEvent) {
    const chat = event.message;
    if (!chat.startsWith("!")) {
      return;
    }
    this.commandReader.parseCommmand(event);
  }
}