export interface HttpHandlerRequest {
  path: string;
  method: string;
  parameters?: { [key: string]: string };
  query?: { [key: string]: string };
  headers: { [key: string]: string };
  body?: any;
}
