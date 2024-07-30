import { Request, Response } from "express";

// Interfaces para Like
export interface ILike {
  id: string;
  userProfileId: string;
  likeType: string;
  eventLikedId?: string;
  commentLikedId?: string;
}

export interface ISearchLikeQuerys {
  id?: string;
  userProfileId?: string;
  likeType?: string;
  eventLikedId?: string;
  commentLikedId?: string;
}

export interface IDeleteLikeBody {
  id: string;
}

export interface IDeleteEventLikeParams {
  eventLikedId: string;
  userProfileId: string;
}

// Interface para o controlador de Like
export interface ILikeController {
  likeEvent(req: Request, res: Response): Promise<void>;

  likeComment(req: Request, res: Response): Promise<void>;

  deleteEventLike(req: Request, res: Response): Promise<void>;

  deleteCommentLike(req: Request, res: Response): Promise<void>;

  searchLike(req: Request, res: Response): Promise<void>;
}

// Interface para o serviço de Like
export interface ILikeService {
  likeEventService(like: ILike): Promise<ILike>;

  likeCommentService(like: ILike): Promise<ILike>;

  deleteEventLikeService(like: IDeleteEventLikeParams): Promise<ILike | null>;

  deleteCommentLikeService(id: string): Promise<ILike | null>;

  searchLikeService(querys: ISearchLikeQuerys): Promise<ILike[]>;
}

// Interface para o repositório de Like
export interface ILikeRepository {
  createLikeRepository(params: ILike): Promise<ILike>;

  deleteLikeRepository(id: string): Promise<ILike | null>;

  searchLikeRepository(querys: ISearchLikeQuerys): Promise<ILike[]>;

  searchAllLikesRepository(): Promise<ILike[]>;

  searchLikeByIdRepository(id: string): Promise<ILike | null>;
}
