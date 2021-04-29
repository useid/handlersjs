import { HttpMethod } from './http-method';

export interface HttpHandlerRequest<B = any> {
  url: URL;
  method: HttpMethod;
  parameters?: { [key: string]: string };
  headers: { [key: string]: string };
  body?: B;
}
