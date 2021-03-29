export abstract class HttpHandlerCorsOptions {
  constructor(
    public allowMethods?: string[],
    public exposeHeaders?: string[],
    public allowHeaders?: string[],
    public origin?: string,
    public maxAge?: number,
    public credentials?: boolean,
  ) { }
}
