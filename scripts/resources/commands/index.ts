import GetSpawn from "./GetSpawn";
import SetSpawn from "./SetSpawn";
import Command from "../model/Command";

const allCommands: Command[] = [ new GetSpawn(), new SetSpawn() ]

export default allCommands;