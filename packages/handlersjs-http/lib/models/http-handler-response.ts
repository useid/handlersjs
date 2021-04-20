export interface HttpHandlerResponse {
  body: any;
  headers: { [key: string]: string };
  status: number;
}
