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

  async searchAllCommentsRepository(): Promise<IComment[]> {
    const foundedComments = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .find({})
      .toArray();

    return foundedComments.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async searchCommentByIdRepository(id: string): Promise<IComment | null> {
    const foundedComment = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .findOne({ _id: new ObjectId(id) });

    if (!foundedComment) {
      return null;
    }

    const { _id, ...rest } = foundedComment;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async searchCommentRepository(
    querys: ISearchCommentQuerys
  ): Promise<IComment[]> {
    const foundedComments = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .find({
        userProfile: querys.userProfile,
      })
      .toArray();

    return foundedComments.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async updateCommentRepository(params: Partial<IComment>): Promise<IComment> {
    const { id, ...updatedParams } = params;

    const updatedComment = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedParams },
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

  async deleteLikeCommentRepository(params: {
    commentLike: string;
    id: string;
  }): Promise<IComment | null> {
    const updatedEvent = await MongoClient.db
      .collection<Omit<IComment, "id">>("Comment")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $pull: { commentLikes: params.commentLike } },
        { returnDocument: "after" }
      );

    if (!updatedEvent) {
      return null;
    }

    const { _id, ...rest } = updatedEvent;

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
