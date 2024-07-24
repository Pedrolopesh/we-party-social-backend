import { ObjectId } from "mongodb";
import { MongoClient } from "../../database/mongo";

import {
  IPromoterEvent,
  IPromoterEventRepository,
  ISearchPromoterEventQuerys,
} from "./PromoterEvent";
import { param } from "express-validator";
import { UserProfile } from "controllers/UserProfile/UserProfile";

export class PromoterEventRepository implements IPromoterEventRepository {
  async createPromoterEventRepository(
    params: Partial<IPromoterEvent>
  ): Promise<IPromoterEvent> {
    const { insertedId } = await MongoClient.db
      .collection("PromoterEvent")
      .insertOne(params);

    const promoterEvent = await MongoClient.db
      .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
      .findOne({ _id: insertedId });

    if (!promoterEvent) {
      throw new Error("PromoterEvent not found");
    }

    const { _id, ...rest } = promoterEvent;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async updatePromoterEventRepository(
    params: Partial<IPromoterEvent>
  ): Promise<IPromoterEvent> {
    const promoterEvent = await this.searchPromoterEventRepository({
      id: params.id,
    });

    if (promoterEvent.length > 0) {
      throw new Error("PromoterEvent name already exists");
    }

    const updatedPromoterEvent = await MongoClient.db
      .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
      .findOneAndUpdate(
        { id: params.id },
        { $set: params },
        { returnDocument: "after" }
      );

    if (!updatedPromoterEvent) {
      throw new Error("PromoterEvent not found");
    }

    const { _id, ...rest } = updatedPromoterEvent;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async searchPromoterEventRepository(
    params?: ISearchPromoterEventQuerys
  ): Promise<IPromoterEvent[]> {
    if (!params) {
      const promoterEvents = await MongoClient.db
        .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
        .find({})
        .toArray();

      return promoterEvents.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toHexString(),
      }));
    }

    if (params?.id) {
      const promoterEvent = await MongoClient.db
        .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
        .findOne({ id: params.id });

      if (!promoterEvent) {
        return [];
      }

      const { _id, ...rest } = promoterEvent;

      return [
        {
          ...rest,
          id: _id.toHexString(),
        },
      ];
    }

    const promoterEvents = await MongoClient.db
      .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
      .find(params)
      .toArray();

    return promoterEvents.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async deletePromoterEventRepository(
    id: string
  ): Promise<IPromoterEvent | null> {
    const promoterEvent = await MongoClient.db
      .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!promoterEvent) {
      return null;
    }

    const { _id, ...rest } = promoterEvent;

    return {
      ...rest,
      id: _id.toHexString(),
    };
  }

  async confirmPresenceInEventRepository(
    userProfileId: string,
    eventUserProfileId: string
  ): Promise<IPromoterEvent | null> {
    const findUserProfileId = await MongoClient.db
      .collection<Omit<UserProfile, "id">>("UserProfile")
      .findOne({ _id: new ObjectId(userProfileId) });

    const findPromoterEvent = await this.searchPromoterEventRepository({
      id: eventUserProfileId,
    });

    if (findPromoterEvent.length === 0 || !findUserProfileId) {
      return null;
    }

    const userProfileAlredyConfirmed =
      findPromoterEvent[0]?.userProfileConfirmationsInEvent;

    if (!findPromoterEvent[0].userProfileConfirmationsInEvent) {
      return null;
    }

    const isFollowing = !!userProfileAlredyConfirmed
      ? findPromoterEvent[0].userProfileConfirmationsInEvent.some(
          (promoterEventUserProfileId: string) =>
            promoterEventUserProfileId === eventUserProfileId
        )
      : false;

    if (isFollowing) {
      // Se estiver seguindo, remove o usuário da lista de following
      const updatedUserProfile = await MongoClient.db
        .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
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
        .collection<Omit<IPromoterEvent, "id">>("PromoterEvent")
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
}
