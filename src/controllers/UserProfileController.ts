import { HttpRequest, HttpResponse } from "../controllers/protocols";
import { requestCreateExternalUser } from "../middlewares/requestExternalService";
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

    console.log("userProfile =>", userProfile);

    const createdSqlUser = await requestCreateExternalUser({
      ...body,
      mongoUserId: userProfile.id,
    });

    const updatedUserProfile =
      await this.userProfileRepository.updateUserProfile(userProfile.id, {
        sqlUserId: createdSqlUser.sqlUserId,
      });

    const result: any = {
      userProfile,
      createdSqlUser,
      updatedUserProfile,
    };

    return {
      status: 201,
      body: result,
    };
  }

  async deleteUserProfile(
    httpRequest: HttpRequest<{ id: string }>
  ): Promise<HttpResponse<UserProfile>> {
    // TO DO: Colocar validação dos campos que são enviados pela requisição (se estão no formato correto, se estão vazios como uma sanitização dos dados que estão sendo enviados)
    const { body } = httpRequest;

    if (!body) {
      return {
        status: 400,
        body: "body is required",
      };
    }

    if (!body?.id) {
      return {
        status: 400,
        body: "Id is required",
      };
    }

    console.log("deleteUserProfile");
    const userProfile = await this.userProfileRepository.deleteUserProfile(
      body?.id
    );

    if (!userProfile) {
      return {
        status: 404,
        body: "User not found",
      };
    }

    return {
      status: 200,
      body: userProfile,
    };
  }

  async getAllUserProfiles(
    _httpRequest: HttpRequest<IUserProfileSearchParams>
  ): Promise<HttpResponse<UserProfile[]>> {
    const userProfiles = await this.userProfileRepository.getAllUserProfiles();

    return {
      status: 200,
      body: userProfiles,
    };
  }
}
