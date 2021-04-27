export type methodType = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
export interface HttpHandlerRequest<B = any> {
  url: URL;
  method: methodType;
  parameters?: { [key: string]: string };
  headers: { [key: string]: string };
  body?: B;
}
