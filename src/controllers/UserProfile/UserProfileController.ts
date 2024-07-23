import { ILoginExternalUserResponse } from "types/User";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  requestCreateExternalUser,
  requestLoginExternalUser,
} from "../../middlewares/requestExternalService";
import {
  CreateUserProfileParams,
  IUserProfileController,
  IUserProfileRepository,
  IUserProfileSearchParams,
  LoginUserProfileParams,
  UserProfile,
} from "controllers/UserProfile/UserProfile";
import { IInterestRepository } from "controllers/Interest/Interest";

export interface IUserProfileInterestParams {
  userProfileId: string;
  interestId: string;
}

export interface IFollowUserInput {
  userProfileId: string;
  friendUserProfileId: string;
}

export class UserProfileController implements IUserProfileController {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly interestRepository?: IInterestRepository
  ) {}

  async createUserProfile(
    httpRequest: HttpRequest<CreateUserProfileParams>
  ): Promise<HttpResponse<UserProfile>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        return {
          status: 400,
          body: "Body is required",
        };
      }

      const { password, ...mongoBody } = body;

      const getUser = await this.userProfileRepository.findUserProfileByEmail(
        mongoBody.email
      );

      if (getUser) {
        return {
          status: 400,
          body: "User already exists",
        };
      }

      const userProfile = await this.userProfileRepository.createUserProfile(
        mongoBody
      );

      const createdSqlUser = await requestCreateExternalUser({
        ...body,
        password,
        mongoUserId: userProfile.id,
      });

      if (!createdSqlUser) {
        return {
          status: 400,
          body: "Body is required",
        };
      }

      await this.userProfileRepository.updateUserProfile(userProfile.id, {
        sqlUserId: createdSqlUser.userId,
      });

      const result: any = {
        ...userProfile,
        token: createdSqlUser.token,
        tokenExpiresAt: createdSqlUser.tokenExpiresAt,
      };

      return {
        status: 201,
        body: result,
      };
    } catch (error: any) {
      console.log("error", error);
      return {
        status: 500,
        body: error,
      };
    }
  }

  async loginUserProfile(
    httpRequest: HttpRequest<LoginUserProfileParams>
  ): Promise<HttpResponse<ILoginExternalUserResponse>> {
    const { body } = httpRequest;

    if (!body) {
      return {
        status: 400,
        body: "Body is required",
      };
    }

    const loginExternalUser = await requestLoginExternalUser({
      email: body.email,
      password: body.password,
    });

    if (loginExternalUser?.status !== 200) {
      return {
        status: loginExternalUser.status,
        body: loginExternalUser,
      };
    }

    return {
      status: 200,
      body: loginExternalUser,
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
  async addInterestToUserProfile(
    httpRequest: HttpRequest<IUserProfileInterestParams>
  ): Promise<HttpResponse<UserProfile | null>> {
    const { body } = httpRequest;

    if (!body) {
      return {
        status: 400,
        body: "Body is required",
      };
    }

    const userProfile = await this.userProfileRepository.findUserProfileById(
      body.userProfileId
    );

    if (!userProfile) {
      return {
        status: 400,
        body: "User not found",
      };
    }

    if (!this.interestRepository) {
      return {
        status: 400,
        body: "Interest repository not found",
      };
    }

    const interest = await this.interestRepository.searchInterestRepository({
      id: body.interestId,
    });

    if (!interest) {
      return {
        status: 400,
        body: "Interest not found",
      };
    }

    const updatedInterest =
      await this.userProfileRepository.addInterestToUserProfile(
        body.userProfileId,
        body.interestId
      );

    if (!updatedInterest) {
      return {
        status: 400,
        body: "Error adding interest",
      };
    }

    return {
      status: 200,
      body: updatedInterest,
    };
  }

  async followUserProfile(
    httpRequest: HttpRequest<IFollowUserInput>
  ): Promise<HttpResponse<UserProfile | null>> {
    const { body } = httpRequest;

    if (!body) {
      return Promise.resolve({
        status: 400,
        body: "Body is required",
      });
    }

    const findUserProfileFriend =
      await this.userProfileRepository.findUserProfileById(
        body.friendUserProfileId
      );

    if (!findUserProfileFriend) {
      return {
        status: 400,
        body: "User not found",
      };
    }

    const followUserProfile =
      await this.userProfileRepository.followUserProfile(
        body.friendUserProfileId,
        body.userProfileId
      );

    if (!followUserProfile) {
      return {
        status: 400,
        body: "Error following user",
      };
    }

    return {
      status: 200,
      body: findUserProfileFriend,
    };
  }
}
