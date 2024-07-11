import { HttpRequest, HttpResponse } from "controllers/protocols";
import {
  CreateUserProfileParams,
  IUserProfileController,
  IUserProfileRepository,
  IUserProfileSearchParams,
  UserProfile,
} from "types/UserProfile";

export class UserProfileController implements IUserProfileController {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async createUserProfile(
    httpRequest: HttpRequest<CreateUserProfileParams>
  ): Promise<HttpResponse<UserProfile>> {
    const { body } = httpRequest;

    if (!body) {
      return {
        status: 400,
        body: "Body is required",
      };
    }

    const userProfile = await this.userProfileRepository.createUserProfile(
      body
    );

    return {
      status: 201,
      body: userProfile,
    };
  }

  async getUserProfiles(
    params?: IUserProfileSearchParams
  ): Promise<HttpResponse<UserProfile[]>> {
    const userProfiles = await this.userProfileRepository.getUserProfiles(
      params
    );

    return {
      status: 200,
      body: userProfiles,
    };
  }
}
