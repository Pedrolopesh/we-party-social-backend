import { Request, Response } from "express";

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

export interface IRemoveCommentInEvent {
  eventId: string;
  commentId: string;
}

export interface IEventController {
  createEvent(req: Request, res: Response): Promise<void>;

  updateEvent(req: Request, res: Response): Promise<void>;

  deleteEvent(req: Request, res: Response): Promise<void>;

  searchEvents(req: Request, res: Response): Promise<void>;

  confirmPresenceInEvent(req: Request, res: Response): Promise<void>;
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

  removeCommentInEvent(params: IRemoveCommentInEvent): Promise<IEvent | null>;
}

export interface IEventService {
  createEvent(body: Omit<IEvent, "id">): Promise<IEvent>;

  deleteEvent(id: string): Promise<IEvent | null>;

  searchEvents(body: ISearchEventQuerys): Promise<IEvent[] | IEvent>;

  updateEvent(body: Partial<IEvent>): Promise<IEvent>;

  confirmPresenceInEvent(
    userProfileId: string,
    eventUserProfileId: string
  ): Promise<IEvent | string>;
}
