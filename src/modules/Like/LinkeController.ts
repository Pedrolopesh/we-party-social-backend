import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtils";
import { ILikeController, ILikeService } from "./Like";
import { Request, Response } from "express";

export class LikeController implements ILikeController {
  constructor(private readonly likeService: ILikeService) {}

  async likeEvent(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
        return;
      }

      const like = await this.likeService.likeEventService(body);

      sendSuccessResponse(res, like, 201);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async likeComment(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
        return;
      }

      const like = await this.likeService.likeCommentService(body);

      sendSuccessResponse(res, like, 201);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async deleteEventLike(req: Request, res: Response): Promise<void> {
    try {
      const { eventLikedId } = req.params;

      if (!eventLikedId) {
        sendErrorResponse(res, "event Liked Id params is required", 400);
        return;
      }

      const userprofileid = req.headers.userprofileid;

      if (!userprofileid || typeof userprofileid !== "string") {
        sendErrorResponse(res, "User profile id is required", 400);
        return;
      }

      const userProfileId: string = userprofileid;

      const like = await this.likeService.deleteEventLikeService({
        eventLikedId,
        userProfileId,
      });

      sendSuccessResponse(res, like, 200);
    } catch (error) {
      sendErrorResponse(res, "Error deleting like", 400);
    }
  }

  async deleteCommentLike(req: Request, res: Response): Promise<void> {
    try {
      const { commentLikedId } = req.params;

      if (!commentLikedId) {
        sendErrorResponse(res, "comment Liked Id params is required", 400);
        return;
      }

      const like = await this.likeService.deleteCommentLikeService(
        commentLikedId
      );

      sendSuccessResponse(res, like, 200);
    } catch (error) {
      sendErrorResponse(res, "Error deleting like", 400);
    }
  }

  async searchLike(req: Request, res: Response): Promise<void> {
    try {
      const querys = req.query;

      const likes = await this.likeService.searchLikeService(querys);

      sendSuccessResponse(res, likes, 200);
    } catch (error) {
      sendErrorResponse(res, "Error searching likes", 400);
    }
  }
}
