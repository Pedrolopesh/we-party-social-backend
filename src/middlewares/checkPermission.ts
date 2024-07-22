import { UserProfileRepository } from "../database/RepoUserProfile";
import { Request, Response, NextFunction } from "express";
import { requestCheckUserProfileRole } from "./requestExternalService";

export class PermissionMiddleware {
  private userProfileRepository: UserProfileRepository;

  constructor() {
    this.userProfileRepository = new UserProfileRepository();
  }
  async checkPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void> {
    try {
      const route = req.originalUrl;
      console.log({ route });

      const permissions: { [key: string]: string[] } = {
        common: [
          "/userprofile/create",
          "/userprofile/login",
          "/api/userprofile/all",
        ],
        admin: ["/userprofile/all"],
        promoter: ["/userprofile/all"],
      };

      const token = req.headers.authorization;
      const userId = req.headers.userprofileid;

      if (!token || !userId) {
        return res.status(401).send("No token provided");
      }

      if (typeof userId !== "string") {
        return res.status(401).send("Invalid user id");
      }

      const userProfile = await this.userProfileRepository.findUserProfileById(
        userId
      );

      if (!userProfile) {
        return res.status(401).send("User not found");
      }

      const checkUserProfile = await requestCheckUserProfileRole(
        userProfile.email,
        token
      );

      if (checkUserProfile.status !== 200) {
        return res
          .status(checkUserProfile.status)
          .send(checkUserProfile.response);
      }

      const userHasPermission =
        permissions[checkUserProfile.response.role].includes(route);

      if (!userHasPermission) {
        return res.status(403).send("User does not have permission");
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  }
}
