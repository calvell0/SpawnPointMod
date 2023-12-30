import Command from "../../scripts/Command";

class set implements Command {
  text: string = "!set";
  description: string = "Set a secondary spawn point at your current location";

  handle(event) {}
}
