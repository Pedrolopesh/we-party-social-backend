import {
  IDeleteEventLikeParams,
  ILike,
  ILikeRepository,
  ILikeService,
  ISearchLikeQuerys,
} from "./Like";
import { IUserProfileRepository } from "../UserProfile/UserProfile";
import { ICommentRepository } from "../Comment/Comment";
import { IEventRepository } from "../Event/Event";

export class LikeService implements ILikeService {
  constructor(
    private readonly likeRepository: ILikeRepository,
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly eventRepository: IEventRepository,
    private readonly commentRepository: ICommentRepository
  ) {}

  async likeEventService(like: ILike): Promise<ILike> {
    const findUserProfile =
      await this.userProfileRepository.findUserProfileById(like.userProfileId);

    if (!findUserProfile) {
      throw new Error("User not found");
    }

    const alredyLiked = await this.likeRepository.searchLikeRepository({
      eventLikedId: like.eventLikedId,
    });

    if (alredyLiked.length > 0) {
      throw new Error("User already liked this event");
    }

    const createdLike = await this.likeRepository.createLikeRepository(like);

    const updateEventLike = await this.eventRepository.updateEventRepository({
      id: like.eventLikedId,
      eventLike: [createdLike.id],
    });

    createdLike.eventLikedId = updateEventLike.id;

    return createdLike;
  }

  async likeCommentService(like: ILike): Promise<ILike> {
    const findUserProfile =
      await this.userProfileRepository.findUserProfileById(like.userProfileId);

    if (!findUserProfile) {
      throw new Error("User not found");
    }

    const alredyLiked = await this.likeRepository.searchLikeRepository({
      commentLikedId: like.commentLikedId,
    });

    if (alredyLiked.length > 0) {
      throw new Error("User already liked this comment");
    }

    const createdLike = await this.likeRepository.createLikeRepository(like);

    const updateCommentLike =
      await this.commentRepository.updateCommentRepository({
        id: like.commentLikedId,
        commentLikes: [createdLike.id],
      });

    createdLike.commentLikedId = updateCommentLike.id;

    return createdLike;
  }

  async deleteEventLikeService(
    deleteEventLikeParams: IDeleteEventLikeParams
  ): Promise<ILike | null> {
    console.log("deleteEventLikeParams: ", deleteEventLikeParams);

    const [findLike] = await this.likeRepository.searchLikeRepository({
      eventLikedId: deleteEventLikeParams.eventLikedId,
      userProfileId: deleteEventLikeParams.userProfileId,
    });

    console.log("findLike: ", findLike);

    if (!findLike) {
      throw new Error("Like not found");
    }

    const updatedEvent = await this.eventRepository.deleteLikeEventRepository({
      id: deleteEventLikeParams.eventLikedId,
      eventLike: findLike.id,
    });

    const deletedLike = await this.likeRepository.deleteLikeRepository(
      findLike.id
    );

    console.log("deletedLike: ", deletedLike, updatedEvent);

    // deletedLike?.eventLikedId = updatedEvent.id;

    return deletedLike;
  }

  async deleteCommentLikeService(id: string): Promise<ILike | null> {
    const findLike = await this.likeRepository.searchLikeByIdRepository(id);

    if (!findLike) {
      throw new Error("Like not found");
    }

    const deletedLike = await this.likeRepository.deleteLikeRepository(id);

    return deletedLike;
  }

  async searchLikeService(querys: ISearchLikeQuerys): Promise<ILike[]> {
    if (!querys) {
      return await this.likeRepository.searchAllLikesRepository();
    }

    if (querys.id) {
      const foundLike = await this.likeRepository.searchLikeByIdRepository(
        querys.id
      );

      return foundLike ? [foundLike] : [];
    }

    return this.likeRepository.searchLikeRepository(querys);
  }
}
