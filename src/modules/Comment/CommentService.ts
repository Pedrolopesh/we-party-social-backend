import { IEventRepository } from "../Event/Event";
import { IUserProfileRepository } from "../UserProfile/UserProfile";
import {
  IComment,
  ICommentRepository,
  ICommentService,
  ILikeCommentBody,
  ISearchCommentQuerys,
} from "./Comment";

export class CommentService implements ICommentService {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly eventRepository: IEventRepository
  ) {}

  async createCommentService(comment: IComment): Promise<IComment> {
    const findUserProfile =
      await this.userProfileRepository.findUserProfileById(comment.userProfile);

    if (!findUserProfile) {
      throw new Error("User not found");
    }

    const findEvent = await this.eventRepository.searchEventRepository({
      id: comment.commentedEvent,
    });

    if (!findEvent) {
      throw new Error("Event not found");
    }

    const createdComment = await this.commentRepository.createCommentRepository(
      comment
    );

    const updateEvent = await this.eventRepository.updateEventRepository({
      id: comment.commentedEvent,
      comments: [createdComment.id],
    });

    return {
      ...createdComment,
      commentedEvent: updateEvent.id,
    };
  }

  async updateCommentService(comment: Partial<IComment>): Promise<IComment> {
    const findComment = await this.commentRepository.searchCommentRepository({
      id: comment.id,
    });

    if (!findComment) {
      throw new Error("Comment not found");
    }

    if (comment.userProfile) {
      throw new Error("User cannot be updated");
    }

    if (comment.commentedEvent) {
      throw new Error("Event cannot be updated");
    }

    const updatedComment = await this.commentRepository.updateCommentRepository(
      comment
    );

    return updatedComment;
  }

  async deleteCommentService(id: string): Promise<IComment | null> {
    const findComment = await this.commentRepository.searchCommentRepository({
      id,
    });

    if (!findComment) {
      throw new Error("Comment not found");
    }

    const updateEvent = await this.eventRepository.removeCommentInEvent({
      commentId: id,
      eventId: findComment[0].commentedEvent,
    });

    if (!updateEvent) {
      throw new Error("Event not found");
    }

    const deletedComment = await this.commentRepository.deleteCommentRepository(
      id
    );

    return deletedComment;
  }

  async searchCommentService(
    querys: ISearchCommentQuerys
  ): Promise<IComment[]> {
    return this.commentRepository.searchCommentRepository(querys);
  }

  async likeCommentService(body: ILikeCommentBody): Promise<IComment> {
    const { commentId, userProfileId } = body;

    return this.commentRepository.likeCommentRepository(
      commentId,
      userProfileId
    );
  }
}
