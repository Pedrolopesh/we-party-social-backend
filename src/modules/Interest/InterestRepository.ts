import { ObjectId } from "mongodb";
import { MongoClient } from "../../database/mongo";

import {
  CreateInterestParams,
  IInterestRepository,
  IInterestSearchParams,
  Interest,
} from "./Interest";

export class InterestRepository implements IInterestRepository {
  async createInterestRepository(
    params: CreateInterestParams
  ): Promise<Interest> {
    const { insertedId } = await MongoClient.db
      .collection("Interest")
      .insertOne(params);

    const interests = await MongoClient.db
      .collection<Omit<Interest, "id">>("Interest")
      .findOne({ _id: insertedId });

    if (!interests) {
      throw new Error("Interest not found");
    }

    const { _id, ...rest } = interests;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async updateInterestRepository(
    id: string,
    params: Partial<CreateInterestParams>
  ): Promise<Interest> {
    const interest = await this.searchInterestRepository({ name: params.name });

    if (interest.length > 0) {
      throw new Error("Interest name already exists");
    }

    const updatedInterest = await MongoClient.db
      .collection<Omit<Interest, "id">>("Interest")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: params },
        { returnDocument: "after" }
      );

    if (!updatedInterest) {
      throw new Error("Interest not found");
    }

    const { _id, ...rest } = updatedInterest;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async searchInterestRepository(
    params?: IInterestSearchParams
  ): Promise<Interest[]> {
    if (!params) {
      const interests = await MongoClient.db
        .collection<Omit<Interest, "id">>("Interest")
        .find({})
        .toArray();

      return interests.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toHexString(),
      }));
    }

    if (params?.id) {
      const interest = await MongoClient.db
        .collection<Omit<Interest, "id">>("Interest")
        .findOne({ _id: new ObjectId(params.id) });

      if (!interest) {
        return [];
      }

      const { _id, ...rest } = interest;

      return [
        {
          ...rest,
          id: _id.toHexString(),
        },
      ];
    }

    const interests = await MongoClient.db
      .collection<Omit<Interest, "id">>("Interest")
      .find(params)
      .toArray();

    return interests.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async deleteInterestRepository(id: string): Promise<Interest | null> {
    const interest = await MongoClient.db
      .collection<Omit<Interest, "id">>("Interest")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!interest) {
      return null;
    }

    const { _id, ...rest } = interest;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }
}
