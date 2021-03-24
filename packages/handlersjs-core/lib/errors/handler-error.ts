export class HandlerError extends Error {
  public readonly name = HandlerError.name;

  constructor(messsage: string, public cause: Error) {
    super(messsage);

    Object.setPrototypeOf(this, HandlerError.prototype);
  }
}
