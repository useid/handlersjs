export interface HttpHandlerResponse<T = unknown> {
  body?: T;
  headers: { [key: string]: string };
  status: number;
}
