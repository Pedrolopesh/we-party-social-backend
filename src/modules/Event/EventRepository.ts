import { ObjectId } from "mongodb";
import { MongoClient } from "../../database/mongo";

import {
  IEvent,
  IEventRepository,
  IRemoveCommentInEvent,
  ISearchEventQuerys,
} from "./Event";
import { IUserProfile } from "../UserProfile/UserProfile";

export class EventRepository implements IEventRepository {
  async createEventRepository(params: Partial<IEvent>): Promise<IEvent> {
    const { insertedId } = await MongoClient.db
      .collection("Event")
      .insertOne(params);

    const foundedEvents = await MongoClient.db
      .collection<Omit<IEvent, "id">>("Event")
      .findOne({ _id: insertedId });

    if (!foundedEvents) {
      throw new Error("Event not found");
    }

    const { _id, ...rest } = foundedEvents;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async updateEventRepository(params: Partial<IEvent>): Promise<IEvent> {
    const updatedEvent = await MongoClient.db
      .collection<Omit<IEvent, "id">>("Event")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: params },
        { returnDocument: "after" }
      );

    if (!updatedEvent) {
      throw new Error("Event not found");
    }

    const { _id, ...rest } = updatedEvent;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async searchEventRepository(params?: ISearchEventQuerys): Promise<IEvent[]> {
    if (!params) {
      const foundedEvents = await MongoClient.db
        .collection<Omit<IEvent, "id">>("Event")
        .find({})
        .toArray();

      return foundedEvents.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toHexString(),
      }));
    }

    if (params?.id) {
      const foundedEvents = await MongoClient.db
        .collection<Omit<IEvent, "id">>("Event")
        .findOne({ id: params.id });

      if (!foundedEvents) {
        return [];
      }

      const { _id, ...rest } = foundedEvents;

      return [
        {
          ...rest,
          id: _id.toHexString(),
        },
      ];
    }

    const foundedEvents = await MongoClient.db
      .collection<Omit<IEvent, "id">>("Event")
      .find(params)
      .toArray();

    return foundedEvents.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async deleteEventRepository(id: string): Promise<IEvent | null> {
    const deletedEvent = await MongoClient.db
      .collection<Omit<IEvent, "id">>("Event")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedEvent) {
      return null;
    }

    const { _id, ...rest } = deletedEvent;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async confirmPresenceInEventRepository(
    userProfileId: string,
    eventUserProfileId: string
  ): Promise<IEvent | null> {
    const findUserProfileId = await MongoClient.db
      .collection<Omit<IUserProfile, "id">>("UserProfile")
      .findOne({ _id: new ObjectId(userProfileId) });

    const findEvent = await this.searchEventRepository({
      id: eventUserProfileId,
    });

    if (findEvent.length === 0 || !findUserProfileId) {
      return null;
    }

    const userProfileAlredyConfirmed =
      findEvent[0]?.userProfileConfirmationsInEvent;

    if (!findEvent[0].userProfileConfirmationsInEvent) {
      return null;
    }

    const isFollowing = !!userProfileAlredyConfirmed
      ? findEvent[0].userProfileConfirmationsInEvent.some(
          (EventUserProfileId: string) =>
            EventUserProfileId === eventUserProfileId
        )
      : false;

    if (isFollowing) {
      // Se estiver seguindo, remove o usuário da lista de following
      const updatedUserProfile = await MongoClient.db
        .collection<Omit<IEvent, "id">>("Event")
        .findOneAndUpdate(
          { id: eventUserProfileId },
          { $pull: { userProfileConfirmationsInEvent: userProfileId } },
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
        .collection<Omit<IEvent, "id">>("Event")
        .findOneAndUpdate(
          { _id: new ObjectId(userProfileId) },
          { $addToSet: { userProfileConfirmationsInEvent: userProfileId } },
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

  async removeCommentInEvent(
    params: IRemoveCommentInEvent
  ): Promise<IEvent | null> {
    const updatedEvent = await MongoClient.db
      .collection<Omit<IEvent, "id">>("Event")
      .findOneAndUpdate(
        { _id: new ObjectId(params.eventId) },
        { $pull: { comments: params.commentId } },
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
}
