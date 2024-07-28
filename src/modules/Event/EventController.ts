import { HttpRequest, HttpResponse } from "controllers/protocols";
import { IEvent, IEventController, IEventService } from "./Event";
import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtils";

export class EventController implements IEventController {
  constructor(private readonly eventService: IEventService) {}

  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const event = await this.eventService.createEvent(body);

      sendSuccessResponse(res, event, 201);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      if (!body?.id) {
        sendErrorResponse(res, "Id is required", 400);
      }

      const event = await this.eventService.updateEvent(body);

      sendSuccessResponse(res, event, 200);
    } catch (err: any) {
      sendErrorResponse(res, err.message, 400);
    }
  }

  async searchEvents(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const event = await this.eventService.searchEvents(body);

      sendSuccessResponse(res, event, 200);
    } catch (error) {
      sendErrorResponse(res, "Error searching event", 400);
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      if (!body?.id) {
        sendErrorResponse(res, "Id is required", 400);
      }

      const event = await this.eventService.deleteEvent(body.id);

      sendSuccessResponse(res, event, 201);
    } catch (err: any) {
      sendErrorResponse(res, err.message, 400);
    }
  }

  async confirmPresenceInEvent(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const updatedEvent = await this.eventService.confirmPresenceInEvent(
        body.userProfileId,
        body.eventUserProfileId
      );

      sendSuccessResponse(res, updatedEvent, 200);
    } catch (err: any) {
      sendErrorResponse(res, err.message, 400);
    }
  }
}
