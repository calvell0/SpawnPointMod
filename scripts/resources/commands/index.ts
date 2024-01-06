import GetSpawn from "./GetSpawn";
import SetSpawn from "./SetSpawn";
import Command from "../model/Command";
import Help from "./Help";
import Yell from "./Yell";

const allCommands: Command[] = [ new GetSpawn(), new SetSpawn(), new Help(), new Yell() ];

export default allCommands;