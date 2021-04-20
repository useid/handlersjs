export interface HttpHandlerRequest {
  url: URL;
  method: string;
  parameters?: { [key: string]: string };
  headers: { [key: string]: string };
  body?: any;
}
