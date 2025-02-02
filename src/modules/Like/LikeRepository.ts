import { ObjectId } from "mongodb";
import { MongoClient } from "../../database/mongo";
import { ILike, ILikeRepository, ISearchLikeQuerys } from "./Like";

export class LikeRepository implements ILikeRepository {
  async createLikeRepository(params: ILike): Promise<ILike> {
    const { insertedId } = await MongoClient.db
      .collection("Like")
      .insertOne(params);

    const foundedLike = await MongoClient.db
      .collection<Omit<ILike, "id">>("Like")
      .findOne({ _id: insertedId });

    if (!foundedLike) {
      throw new Error("Like not found");
    }

    const { _id, ...rest } = foundedLike;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async deleteLikeRepository(id: string): Promise<ILike | null> {
    const deletedLike = await MongoClient.db
      .collection<Omit<ILike, "id">>("Like")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedLike) {
      throw new Error("Error deleting like");
    }

    const { _id, ...rest } = deletedLike;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async searchAllLikesRepository(): Promise<ILike[]> {
    const foundedLikes = await MongoClient.db
      .collection<Omit<ILike, "id">>("Like")
      .find({})
      .toArray();

    return foundedLikes.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }
  async searchLikeByIdRepository(id: string): Promise<ILike | null> {
    const foundedLike = await MongoClient.db
      .collection<Omit<ILike, "id">>("Like")
      .findOne({ _id: new ObjectId(id) });

    if (!foundedLike) {
      return null;
    }

    const { _id, ...rest } = foundedLike;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async searchLikeRepository(querys: ISearchLikeQuerys): Promise<ILike[]> {
    const foundedLikes = await MongoClient.db
      .collection<Omit<ILike, "id">>("Like")
      .find({
        userProfileId: querys.userProfileId,
        eventLikedId: querys.eventLikedId,
      })
      .toArray();

    return foundedLikes.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }
}
