import {
  CreateUserProfileParams,
  IUserProfile,
  IUserProfileRepository,
  IUserProfileSearchParams,
  IUserProfileService,
  LoginUserProfileParams,
} from "../../modules/UserProfile/UserProfile";
import { IInterestRepository } from "../Interest/Interest";
import {
  requestCreateExternalUser,
  requestLoginExternalUser,
} from "../../middlewares/requestExternalService";
import { ILoginExternalUserResponse } from "types/User";
import {
  IUserProfileInterestParams,
  IFollowUserInput,
} from "./UserProfileController";

export class UserProfileService implements IUserProfileService {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly interestRepository?: IInterestRepository
  ) {}
  updateUserProfile(body: Partial<IUserProfile>): Promise<IUserProfile> {
    throw new Error("Method not implemented.");
  }

  async createUserProfile(
    body: CreateUserProfileParams
  ): Promise<IUserProfile> {
    if (!body) {
      throw new Error("Body is required");
    }

    const { password, ...mongoBody } = body;

    const getUser = await this.userProfileRepository.findUserProfileByEmail(
      mongoBody.email
    );

    if (getUser) {
      throw new Error("User already exists");
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
      throw new Error("Error creating external user");
    }

    await this.userProfileRepository.updateUserProfile(userProfile.id, {
      sqlUserId: createdSqlUser.userId,
    });

    const result: any = {
      ...userProfile,
      token: createdSqlUser.token,
      tokenExpiresAt: createdSqlUser.tokenExpiresAt,
    };

    return result;
  }

  async loginUserProfile(
    body: LoginUserProfileParams
  ): Promise<ILoginExternalUserResponse> {
    if (!body) {
      throw new Error("Body is required");
    }

    const loginExternalUser = await requestLoginExternalUser({
      email: body.email,
      password: body.password,
    });

    if (loginExternalUser?.status !== 200) {
      throw new Error("Login failed");
    }

    return loginExternalUser;
  }

  async searchUserProfile(
    body?: IUserProfileSearchParams
  ): Promise<IUserProfile[]> {
    const findEvent = await this.userProfileRepository.searchUserProfile({
      ...(body?.id && { name: body.id }),
      ...(body?.email && { id: body.email }),
      ...(body?.name && { id: body.name }),
      ...(body?.phone && { id: body.phone }),
    });

    if (!findEvent) {
      throw new Error("Event not found");
    }

    return findEvent;
  }

  async deleteUserProfile(id: string): Promise<IUserProfile> {
    if (!id) {
      throw new Error("Id is required");
    }

    const userProfile = await this.userProfileRepository.deleteUserProfile(id);

    if (!userProfile) {
      throw new Error("User not found");
    }

    return userProfile;
  }

  async addInterestToUserProfile(
    params: IUserProfileInterestParams
  ): Promise<IUserProfile | null> {
    const { userProfileId, interestId } = params;

    const userProfile = await this.userProfileRepository.findUserProfileById(
      userProfileId
    );

    if (!userProfile) {
      throw new Error("User not found");
    }

    if (!this.interestRepository) {
      throw new Error("Interest repository not found");
    }

    const interest = await this.interestRepository.searchInterestRepository({
      id: interestId,
    });

    if (!interest) {
      throw new Error("Interest not found");
    }

    const updatedInterest =
      await this.userProfileRepository.addInterestToUserProfile(
        userProfileId,
        interestId
      );

    if (!updatedInterest) {
      throw new Error("Error adding interest");
    }

    return updatedInterest;
  }

  async followUserProfile(
    params: IFollowUserInput
  ): Promise<IUserProfile | null> {
    const { userProfileId, friendUserProfileId } = params;

    const findUserProfileFriend =
      await this.userProfileRepository.findUserProfileById(friendUserProfileId);

    if (!findUserProfileFriend) {
      throw new Error("User not found");
    }

    const followUserProfile =
      await this.userProfileRepository.followUserProfile(
        friendUserProfileId,
        userProfileId
      );

    if (!followUserProfile) {
      throw new Error("Error following user");
    }

    return findUserProfileFriend;
  }
}
