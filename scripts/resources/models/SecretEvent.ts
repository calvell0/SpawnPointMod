import ModEvent from "./ModEvent";


export interface SecretEvent extends ModEvent {
  annoyingLevel: number;

  run(event: any): void;
}