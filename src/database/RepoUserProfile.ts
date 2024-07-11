import { ObjectId } from "mongodb";
import { MongoClient } from "../database/mongo";
import {
  CreateUserProfileParams,
  IUserProfileRepository,
  IUserProfileSearchParams,
  UserProfile,
} from "types/UserProfile";

export class UserProfileRepository implements IUserProfileRepository {
  async createUserProfile(
    params: CreateUserProfileParams
  ): Promise<UserProfile> {
    const { insertedId } = await MongoClient.db
      .collection("UserProfile")
      .insertOne(params);

    const users = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .findOne({ id: insertedId });

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
      throw new Error("User not found");
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
      throw new Error("User not found");
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
}
