export interface Interest {
  id: string;
  name: string;
  createdBy: string;
}

export interface CreateInterestParams {
  name: string;
}

export interface IInterestSearchParams {
  id?: string;
  name?: string;
}

export interface IInterestController {
  createInterest(
    httpRequest: HttpRequest<CreateInterestParams>
  ): Promise<HttpResponse<Interest>>;

  updateInterest(
    httpRequest: HttpRequest<{ id: string; newInterest: Interest<Omit<id>> }>
  ): Promise<HttpResponse<Interest>>;

  serachInterest(
    httpRequest: HttpRequest<IInterestSearchParams>
  ): Promise<HttpResponse<Interest>>;

  getAllInterests(
    httpRequest: HttpRequest<IInterestSearchParams>
  ): Promise<HttpResponse<Interest[]>>;

  deleteInterest(
    httpRequest: HttpRequest<{ id: string }>
  ): Promise<HttpResponse<Interest>>;
}

export interface IInterestRepository {
  createInterestRepository(params: CreateInterestParams): Promise<Interest>;

  updateInterestRepository(
    id: string,
    newInterest: CreateInterestParams
  ): Promise<Interest>;

  searchInterestRepository(params?: IInterestSearchParams): Promise<Interest[]>;

  deleteInterestRepository(id: string): Promise<Interest | null>;
}
