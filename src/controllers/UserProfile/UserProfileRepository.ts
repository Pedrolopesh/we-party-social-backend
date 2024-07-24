import { ObjectId } from "mongodb";
import { MongoClient } from "../../database/mongo";
import {
  CreateUserProfileParams,
  IUpdateUserProfileParams,
  IUserProfileRepository,
  IUserProfileSearchParams,
  UserProfile,
} from "./UserProfile";

export class UserProfileRepository implements IUserProfileRepository {
  async createUserProfile(
    params: CreateUserProfileParams
  ): Promise<UserProfile> {
    const { insertedId } = await MongoClient.db
      .collection("UserProfile")
      .insertOne(params);

    const users = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .findOne({ _id: insertedId });

    if (!users) {
      throw new Error("User not found");
    }

    const { _id, ...rest } = users;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async findUserProfileByEmail(email: string): Promise<UserProfile | null> {
    const userProfile = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .findOne({ email });

    if (!userProfile) {
      return null;
    }

    return {
      ...userProfile,
      id: userProfile._id.toHexString(),
    };
  }

  async findUserProfileById(id: string): Promise<UserProfile | null> {
    const userProfile = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .findOne({ _id: new ObjectId(id) });

    if (!userProfile) {
      return null;
    }

    return {
      ...userProfile,
      id: userProfile._id.toHexString(),
    };
  }

  async getUserProfiles(
    params?: IUserProfileSearchParams | undefined
  ): Promise<UserProfile[]> {
    const userProfile = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .find({})
      .toArray();

    return userProfile.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async updateUserProfile(
    id: string,
    params: Partial<IUpdateUserProfileParams>
  ): Promise<UserProfile> {
    const updatedUserProfile = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: params },
        { returnDocument: "after" }
      );

    if (!updatedUserProfile) {
      throw new Error("User not found");
    }

    const { _id, ...rest } = updatedUserProfile;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async deleteUserProfile(id: string): Promise<UserProfile | null> {
    const userProfile = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!userProfile) {
      return null;
    }

    const { _id, ...rest } = userProfile;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async getAllUserProfiles(): Promise<UserProfile[]> {
    const users = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .find({})
      .toArray();

    return users.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async addInterestToUserProfile(
    userProfileId: string,
    interestId: string
  ): Promise<UserProfile | null> {
    const userProfile = await this.findUserProfileById(userProfileId);
    if (!userProfile) {
      return null;
    }

    const hasInterests = userProfile?.interest;

    // TODO: it's necessary check if interest exists before add to user profile

    const isFollowing = !!hasInterests
      ? userProfile.interest.some((follow: string) => follow === interestId)
      : false;

    if (isFollowing) {
      // Se estiver seguindo, remove o usuário da lista de following
      const updatedUserProfile = await MongoClient.db
        .collection<Omit<UserProfile, "id">>("UserProfile")
        .findOneAndUpdate(
          { _id: new ObjectId(userProfileId) },
          { $pull: { interest: interestId } },
          { returnDocument: "after" }
        );

      if (!updatedUserProfile) {
        return null;
      }

      const { _id, ...rest } = updatedUserProfile;

      return {
        ...rest,
        id: _id.toHexString(),
      };
    } else {
      // Se não estiver seguindo, adiciona o usuário à lista de following
      const updatedUserProfile = await MongoClient.db
        .collection<Omit<UserProfile, "id">>("UserProfile")
        .findOneAndUpdate(
          { _id: new ObjectId(userProfileId) },
          { $addToSet: { interest: interestId } },
          { returnDocument: "after" }
        );

      if (!updatedUserProfile) {
        return null;
      }

      const { _id, ...rest } = updatedUserProfile;

      return {
        ...rest,
        id: _id.toHexString(),
      };
    }
  }
  async followUserProfile(
    userProfileId: string,
    friendUserProfileId: string
  ): Promise<UserProfile | null> {
    const friendId = friendUserProfileId;

    const userProfile = await this.findUserProfileById(userProfileId);
    if (!userProfile) {
      return null;
    }

    const hasFollowers = userProfile?.following;

    const isFollowing = !!hasFollowers
      ? userProfile.following.some((follow: string) => follow === friendId)
      : false;

    if (isFollowing) {
      // Se estiver seguindo, remove o usuário da lista de following
      const updatedUserProfile = await MongoClient.db
        .collection<Omit<UserProfile, "id">>("UserProfile")
        .findOneAndUpdate(
          { _id: new ObjectId(userProfileId) },
          { $pull: { following: friendId } },
          { returnDocument: "after" }
        );

      if (!updatedUserProfile) {
        return null;
      }

      const { _id, ...rest } = updatedUserProfile;

      return {
        ...rest,
        id: _id.toHexString(),
      };
    } else {
      // Se não estiver seguindo, adiciona o usuário à lista de following
      const updatedUserProfile = await MongoClient.db
        .collection<Omit<UserProfile, "id">>("UserProfile")
        .findOneAndUpdate(
          { _id: new ObjectId(userProfileId) },
          { $addToSet: { following: friendId } },
          { returnDocument: "after" }
        );

      if (!updatedUserProfile) {
        return null;
      }

      const { _id, ...rest } = updatedUserProfile;

      return {
        ...rest,
        id: _id.toHexString(),
      };
    }
  }
}
