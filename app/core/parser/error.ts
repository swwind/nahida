import { Position } from "unist";

export class ParseError extends Error {
  constructor(errmsg: string, position: Position | undefined) {
    super(`${errmsg} at line ${position?.start.line}`);
  }
}
