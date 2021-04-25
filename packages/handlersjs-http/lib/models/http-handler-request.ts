export interface HttpHandlerRequest<B = any> {
  url: URL;
  method: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
  parameters?: { [key: string]: string };
  headers: { [key: string]: string };
  body?: B;
}
