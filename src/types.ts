export interface Range {
  start: Position;
  end: Position;
}

export interface Position {
  index: number;
  line: number;
  column: number;
}

export interface ErrorObject {
  kind: string,
  message: string,
  range?: Range,
}
