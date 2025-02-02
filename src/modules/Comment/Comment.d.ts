import { Request, Response } from "express";

export interface IComment {
  id: string;
  commentText: string;
  commentedEvent: string;
  userProfile: string;
  commentLikes?: string[];
}

export interface ISearchCommentQuerys {
  id?: string;
  commentedEvent?: string;
  userProfile?: string;
}

export interface ILikeCommentBody {
  commentId: string;
  userProfileId: string;
}

export interface ICommentController {
  createComment(req: Request, res: Response): Promise<void>;

  updateComment(req: Request, res: Response): Promise<void>;

  deleteComment(req: Request, res: Response): Promise<void>;

  searchComment(req: Request, res: Response): Promise<void>;

  likeComment(req: Request, res: Response): Promise<void>;
}

export interface ICommentService {
  createCommentService(comment: IComment): Promise<IComment>;

  updateCommentService(comment: IComment): Promise<IComment>;

  deleteCommentService(id: string): Promise<IComment | null>;

  searchCommentService(querys: ISearchCommentQuerys): Promise<IComment[]>;

  likeCommentService(body: ILikeCommentBody): Promise<IComment>;
}

export interface ICommentRepository {
  createCommentRepository(params: IComment): Promise<IComment>;

  deleteCommentRepository(id: string): Promise<IComment | null>;

  searchCommentRepository(querys: ISearchCommentQuerys): Promise<IComment[]>;

  updateCommentRepository(params: Partial<IComment>): Promise<IComment>;

  likeCommentRepository(id: string, userProfileId: string): Promise<IComment>;

  searchAllCommentsRepository(): Promise<IComment[]>;

  searchCommentByIdRepository(id: string): Promise<IComment | null>;

  deleteLikeCommentRepository(params: {
    commentLike: string;
    id: string;
  }): Promise<IComment | null>;
}
