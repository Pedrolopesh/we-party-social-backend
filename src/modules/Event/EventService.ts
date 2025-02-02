// src/features/event/EventService.ts
import {
  IEvent,
  IEventRepository,
  IEventService,
  ISearchEventQuerys,
} from "./Event";
import { IUserProfileRepository } from "../UserProfile/UserProfile";
import { IInterestRepository } from "../Interest/Interest";

export class EventService implements IEventService {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly interestRepository: IInterestRepository
  ) {}

  async createEvent(body: Omit<IEvent, "id">): Promise<IEvent> {
    if (!body) {
      throw new Error("Body is required");
    }

    const findEvent = await this.eventRepository.searchEventRepository({
      nameEvent: body.nameEvent,
    });

    if (findEvent.length > 0) {
      throw new Error("Event already exists");
    }

    const findUserProfile =
      await this.userProfileRepository.findUserProfileById(body.userProfileId);

    if (!findUserProfile) {
      throw new Error("User not found");
    }

    return await this.eventRepository.createEventRepository(body);
  }

  async updateEvent(body: Partial<IEvent>): Promise<IEvent> {
    if (!body) {
      throw new Error("Body is required");
    }

    if (!body?.id) {
      throw new Error("Id is required");
    }

    const hasInteres =
      body?.interest && body?.interest?.length > 0
        ? await this.interestRepository.searchInterestRepository({
            id: body.interest[0],
          })
        : [];

    if (body?.interest && hasInteres.length === 0) {
      throw new Error("Interest not found");
    }

    const hasUserProfile =
      body?.userProfileConfirmationsInEvent &&
      body?.userProfileConfirmationsInEvent?.length > 0
        ? await this.userProfileRepository.findUserProfileById(
            body.userProfileConfirmationsInEvent[0]
          )
        : null;

    if (body?.userProfileConfirmationsInEvent && !hasUserProfile) {
      throw new Error("UserProfile not found");
    }

    const event = await this.eventRepository.updateEventRepository(body);

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async searchEvents(body: ISearchEventQuerys): Promise<IEvent | IEvent[]> {
    const findEvent = await this.eventRepository.searchEventRepository({
      ...(body.nameEvent && { name: body.nameEvent }),
      ...(body.id && { id: body.id }),
    });

    if (!findEvent) {
      throw new Error("Event not found");
    }

    return await this.eventRepository.searchEventRepository(body);
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    if (!id) {
      throw new Error("Id is required");
    }

    const event = await this.eventRepository.deleteEventRepository(id);

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async confirmPresenceInEvent(
    userProfileId: string,
    eventUserProfileId: string
  ): Promise<IEvent | string> {
    const updatedEvent =
      await this.eventRepository.confirmPresenceInEventRepository(
        userProfileId,
        eventUserProfileId
      );

    if (!updatedEvent) {
      throw new Error("Error confirming presence in event");
    }

    return updatedEvent;
  }
}
