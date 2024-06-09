import ModEvent from "../resources/models/ModEvent";

export default class EventDispatcher {


  constructor() {
    this.runEvent = this.runEvent.bind(this);

  }

  runEvent(modEvent: ModEvent, event: any, args?: string[]) {
    console.log(`[DISPATCH] Running Event: ${ modEvent.constructor.name } with args: ${ args }`);
    modEvent.run(event, args);

  }
}