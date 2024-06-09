export default interface ModEvent {
  run(event: any, args?: string[]): void;
}