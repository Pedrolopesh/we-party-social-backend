import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtils";
import { ICommentController, ICommentService } from "./Comment";
import { Request, Response } from "express";

export class CommentController implements ICommentController {
  constructor(private readonly eventService: ICommentService) {}

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const event = await this.eventService.createCommentService(body);

      sendSuccessResponse(res, event, 201);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      if (!body?.id) {
        sendErrorResponse(res, "Id is required", 400);
      }

      const event = await this.eventService.updateCommentService(body);

      sendSuccessResponse(res, event, 200);
    } catch (err: any) {
      sendErrorResponse(res, err.message, 400);
    }
  }

  async searchComment(req: Request, res: Response): Promise<void> {
    try {
      const querys = req.query;

      // console.log("querys", querys.userProfileId);

      const event = await this.eventService.searchCommentService(querys);

      sendSuccessResponse(res, event, 200);
    } catch (error) {
      sendErrorResponse(res, "Error searching event", 400);
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      console.log("params", req.params);
      const { id } = req.params;

      if (!id) {
        sendErrorResponse(res, "id params is required", 400);
      }

      const event = await this.eventService.deleteCommentService(id);

      sendSuccessResponse(res, event, 200);
    } catch (error) {
      sendErrorResponse(res, "Error deleting event", 400);
    }
  }

  async likeComment(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const event = await this.eventService.likeCommentService(body);

      sendSuccessResponse(res, event, 200);
    } catch (error) {
      sendErrorResponse(res, "Error liking event", 400);
    }
  }
}
