import {
  IUserProfileController,
  IUserProfileService,
} from "../UserProfile/UserProfile";
import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtils";

export interface IUserProfileInterestParams {
  userProfileId: string;
  interestId: string;
}

export interface IFollowUserInput {
  userProfileId: string;
  friendUserProfileId: string;
}

export class UserProfileController implements IUserProfileController {
  constructor(private readonly userProfileService: IUserProfileService) {}

  async createUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const result = await this.userProfileService.createUserProfile(req.body);
      sendSuccessResponse(res, result, 201);
    } catch (error: any) {
      console.log("error", error.message);
      sendErrorResponse(res, error.message, 500);
    }
  }

  async loginUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const result = await this.userProfileService.loginUserProfile(req.body);
      sendSuccessResponse(res, result, 200);
    } catch (error: any) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      if (!body?.id) {
        sendErrorResponse(res, "Id is required", 400);
      }

      const result = await this.userProfileService.updateUserProfile(req.body);
      sendSuccessResponse(res, result, 200);
    } catch (error: any) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async searchUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const result = await this.userProfileService.searchUserProfile(req.body);
      sendSuccessResponse(res, result, 200);
    } catch (error: any) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async deleteUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { params } = req;

      if (!params) {
        sendErrorResponse(res, "params is required", 400);
      }

      if (!params?.id) {
        sendErrorResponse(res, "Id is required", 400);
      }

      const result = await this.userProfileService.deleteUserProfile(req.params.id);
      sendSuccessResponse(res, result, 201);
    } catch (error: any) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async addInterestToUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const result = await this.userProfileService.addInterestToUserProfile(
        req.body
      );
      sendSuccessResponse(res, result, 200);
    } catch (error: any) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async followUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { body } = req;

      if (!body) {
        sendErrorResponse(res, "Body is required", 400);
      }

      const result = await this.userProfileService.followUserProfile(req.body);
      sendSuccessResponse(res, result, 200);
    } catch (error: any) {
      sendErrorResponse(res, error.message, 500);
    }
  }
}
