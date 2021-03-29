export interface HttpHandlerRequest {
  headers: { [key: string]: string };
  method: string;
  body?: any;
  parameters?: { [key: string]: string };
  query?: { [key: string]: string };
}
