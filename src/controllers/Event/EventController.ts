import { HttpRequest, HttpResponse } from "controllers/protocols";
import {
  IEvent,
  IEventController,
  IEventRepository,
  ISearchEventQuerys,
} from "./Event";
import { IUserProfileRepository } from "controllers/UserProfile/UserProfile";

export class EventController implements IEventController {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly userProfileRepository: IUserProfileRepository
  ) {}

  async createEvent(
    httpRequest: HttpRequest<IEvent>
  ): Promise<HttpResponse<IEvent>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        return Promise.resolve({
          status: 400,
          body: "Body is required",
        });
      }

      const findEvent = await this.eventRepository.searchEventRepository({
        nameEvent: body.nameEvent,
      });

      if (findEvent.length > 0) {
        return {
          status: 400,
          body: "Event already exists",
        };
      }

      const findUserProfile =
        await this.userProfileRepository.findUserProfileById(
          body.userProfileId
        );

      if (!findUserProfile) {
        return {
          status: 400,
          body: "User not found",
        };
      }

      const eventRepository = await this.eventRepository.createEventRepository(
        body
      );

      return {
        status: 200,
        body: eventRepository,
      };
    } catch (error: any) {
      return {
        status: 400,
        body: error.message,
      };
    }
  }

  async updateEvent(
    httpRequest: HttpRequest<Partial<IEvent>>
  ): Promise<HttpResponse<IEvent>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        return Promise.resolve({
          status: 400,
          body: "Body is required",
        });
      }

      if (!body?.id) {
        return {
          status: 400,
          body: "Id is required",
        };
      }

      const event = await this.eventRepository.updateEventRepository(body);

      if (!event) {
        return {
          status: 404,
          body: "Event not found",
        };
      }

      return {
        status: 200,
        body: event,
      };
    } catch (err: any) {
      return {
        status: 400,
        body: err.message,
      };
    }
  }

  async searchEvents(
    httpRequest: HttpRequest<ISearchEventQuerys>
  ): Promise<HttpResponse<IEvent | IEvent[]>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        return Promise.resolve({
          status: 400,
          body: "Body is required",
        });
      }

      const findEvent = await this.eventRepository.searchEventRepository({
        ...(body.nameEvent && { name: body.nameEvent }),
        ...(body.id && { id: body.id }),
      });

      if (!findEvent) {
        return {
          status: 400,
          body: "Event not found",
        };
      }

      const event = await this.eventRepository.searchEventRepository(body);

      if (!event) {
        return {
          status: 400,
          body: "Error searching event",
        };
      }

      return {
        status: 200,
        body: event,
      };
    } catch (error) {
      return {
        status: 400,
        body: "Error searching event",
      };
    }
  }

  async deleteEvent(
    httpRequest: HttpRequest<{ id: string }>
  ): Promise<HttpResponse<IEvent | null>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        return Promise.resolve({
          status: 400,
          body: "Body is required",
        });
      }

      const event = await this.eventRepository.deleteEventRepository(body.id);

      if (!event) {
        return {
          status: 404,
          body: "Event not found",
        };
      }

      return {
        status: 200,
        body: event,
      };
    } catch (error) {
      return {
        status: 400,
        body: "Error deleting event",
      };
    }
  }

  async confirmPresenceInEvent(
    httpRequest: HttpRequest<{
      userProfileId: string;
      eventUserProfileId: string;
    }>
  ): Promise<HttpResponse<IEvent>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        return Promise.resolve({
          status: 400,
          body: "Body is required",
        });
      }

      const updatedEvent =
        await this.eventRepository.confirmPresenceInEventRepository(
          body.userProfileId,
          body.eventUserProfileId
        );

      if (!updatedEvent) {
        return {
          status: 400,
          body: "Error confirming presence in event",
        };
      }

      return {
        status: 200,
        body: updatedEvent,
      };
    } catch (error) {
      return {
        status: 400,
        body: "Error confirming presence in event",
      };
    }
  }
}
