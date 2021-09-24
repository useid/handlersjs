export class HandlerError extends Error {

  public readonly name = HandlerError.name;

  constructor(message: string, public cause?: Error) {

    super(message);

    Object.setPrototypeOf(this, HandlerError.prototype);

  }

}
