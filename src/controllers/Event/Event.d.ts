export interface IEvent {
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
  userProfileId: string;
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

export interface ISearchEventQuerys {
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

export interface IEventController {
  createEvent(
    httpRequest: HttpRequest<Omit<IEvent, "id">>
  ): Promise<HttpResponse<IEvent>>;

  deleteEvent(
    httpRequest: HttpRequest<{ id: string }>
  ): Promise<HttpResponse<IEvent>>;

  searchEvents(
    httpRequest: HttpRequest<ISearchEventQuerys>
  ): Promise<HttpResponse<IEvent[]>>;

  updateEvent(
    httpRequest: HttpRequest<Omit<IEvent, "id">>
  ): Promise<HttpResponse<IEvent>>;

  confirmPresenceInEvent(
    httpRequest: HttpRequest<{ userProfileId: string }>
  ): Promise<HttpResponse<IEvent>>;
}

export interface IEventRepository {
  createEventRepository(params: Omit<IEvent, "id">): Promise<IEvent>;

  deleteEventRepository(id: string): Promise<IEvent | null>;

  searchEventRepository(params: ISearchEventQuerys): Promise<IEvent[]>;

  updateEventRepository(params: Partial<IEvent>): Promise<IEvent>;

  confirmPresenceInEventRepository(
    userProfileId: string,
    eventUserProfileId: string
  ): Promise<IEvent | null>;
}
