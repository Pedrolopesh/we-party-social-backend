export interface IPromoterEvent {
  id: string;
  nameEvent: string;
  eventMidia?: string[];
  description: string;
  startDateTime: Date;
  endDateTime?: Date;
  zipCode: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  streat: string;
  streatNumber: string;
  complement?: string;
  latitude?: string;
  longitude?: string;
  aditionalLocationInfo?: string;
  eventDoubts?: string;
  eventImpression?: number;
  comments?: string[];
  eventLike?: string[];
  interest?: string[];
  eventReports?: string[];
  // createdAt?: Date;
  // updatedAt?: Date;
  userProfileConfirmationsInEvent?: string[];
}

export interface ISearchPromoterEventQuerys {
  id?: string;
  userProfileId?: string;
  nameEvent?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  zipCode?: string;
  country?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  streat?: string;
  streatNumber?: string;
  latitude?: string;
  longitude?: string;
  eventImpression?: number;
  eventReports?: string;
}

export interface PromoterEventController {
  createPromoterEvent(
    httpRequest: HttpRequest<Omit<IPromoterEvent, "id">>
  ): Promise<HttpResponse<IPromoterEvent>>;

  deletePromoterEvent(
    httpRequest: HttpRequest<{ id: string }>
  ): Promise<HttpResponse<IPromoterEvent>>;

  searchPromoterEvents(
    httpRequest: HttpRequest<ISearchPromoterEventQuerys>
  ): Promise<HttpResponse<IPromoterEvent[]>>;

  updatePromoterEvent(
    httpRequest: HttpRequest<Omit<IPromoterEvent, "id">>
  ): Promise<HttpResponse<IPromoterEvent>>;

  confirmPresenceInEvent(
    httpRequest: HttpRequest<{ userProfileId: string }>
  ): Promise<HttpResponse<IPromoterEvent>>;
}

export interface IPromoterEventRepository {
  createPromoterEventRepository(
    params: Omit<IPromoterEvent, "id">
  ): Promise<IPromoterEvent>;

  deletePromoterEventRepository(id: string): Promise<PromoterEvent>;

  searchPromoterEventRepository(
    params: ISearchPromoterEventQuerys
  ): Promise<PromoterEvent[]>;

  updatePromoterEventRepository(params: PromoterEvent): Promise<PromoterEvent>;

  confirmPresenceInEventRepository(
    userProfileId: string,
    eventUserProfileId: string
  ): Promise<PromoterEvent | null>;
}
