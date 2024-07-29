import { ObjectId } from "mongodb";
import { MongoClient } from "../../database/mongo";
import { IComment, ICommentRepository, ISearchCommentQuerys } from "./Comment";

export class CommentRepository implements ICommentRepository {
  async createCommentRepository(params: IComment): Promise<IComment> {
    const { insertedId } = await MongoClient.db
      .collection("Comment")
      .insertOne(params);

    const foundedComments = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .findOne({ _id: insertedId });

    if (!foundedComments) {
      throw new Error("Comment not found");
    }

    const { _id, ...rest } = foundedComments;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async deleteCommentRepository(id: string): Promise<IComment | null> {
    const deletedComment = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedComment) {
      throw new Error("Error deleting comment");
    }

    const { _id, ...rest } = deletedComment;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async searchCommentRepository(
    querys: ISearchCommentQuerys
  ): Promise<IComment[]> {
    if (!querys) {
      const foundedComments = await MongoClient.db
        .collection<Omit<IComment, "id">>("Comment")
        .find({})
        .toArray();

      return foundedComments.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toHexString(),
      }));
    }

    if (querys.id) {
      const foundedComment = await MongoClient.db
        .collection<Omit<IComment, "id">>("Comment")
        .findOne({ _id: new ObjectId(querys.id) });

      if (!foundedComment) {
        return [];
      }

      const { _id, ...rest } = foundedComment;

      return [
        {
          ...rest,
          id: _id.toHexString(),
        },
      ];
    }

    const foundedComments = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .find(querys)
      .toArray();

    return foundedComments.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async updateCommentRepository(params: Partial<IComment>): Promise<IComment> {
    const updatedComment = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: params },
        { returnDocument: "after" }
      );

    if (!updatedComment) {
      throw new Error("Error updating comment");
    }

    const { _id, ...rest } = updatedComment;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async likeCommentRepository(
    id: string,
    userProfileId: string
  ): Promise<IComment> {
    throw new Error("Method not implemented.");
  }
}
