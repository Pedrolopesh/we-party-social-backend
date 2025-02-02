export interface HttpResponse<T> {
  status: number;
  body: T | string;
}
export interface HttpRequest<B> {
  params?: any;
  headers?: any;
  body?: B;
}
