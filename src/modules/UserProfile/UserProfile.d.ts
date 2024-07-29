import { HttpRequest, HttpResponse } from "../protocols";
import { Request, Response } from "express";

export interface IUserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  type: string;
  followers: string;
  acceptedTerms: boolean;
  notificationActive: boolean;
  sqlUserId: string;
  following: string[];
  interest: string[];
}

export interface CreateUserProfileParams {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  acceptedTerms: boolean;
  notificationActive: boolean;
  document: string;
}

export interface IUpdateUserProfileParams {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  sqlUserId?: string;
  acceptedTerms?: boolean;
  notificationActive?: boolean;
  document?: string;
}

export interface IUserProfileSearchParams {
  name?: string;
  email?: string;
  phone?: string;
  id?: string;
}

export interface ICreatedExternalUser {
  userId: string;
  token: string;
  tokenExpiresAt: string;
}

export interface LoginUserProfileParams {
  email: string;
  password: string;
}

export interface IUserProfileInterestParams {
  userProfileId: string;
  interestId: string;
}

export interface IUserProfileController {
  createUserProfile(req: Request, res: Response): Promise<void>;

  loginUserProfile(req: Request, res: Response): Promise<void>;

  updateUserProfile(req: Request, res: Response): Promise<void>;

  searchUserProfile(req: Request, res: Response): Promise<void>;

  deleteUserProfile(req: Request, res: Response): Promise<void>;

  addInterestToUserProfile(req: Request, res: Response): Promise<void>;

  followUserProfile(req: Request, res: Response): Promise<void>;
}

export interface IUserProfileRepository {
  createUserProfile(
    params: CreateUserProfileParams<Omit<password>>
  ): Promise<IUserProfile>;

  updateUserProfile(
    id: string,
    params: IUpdateUserProfileParams
  ): Promise<IUserProfile>;
  deleteUserProfile(id: string): Promise<IUserProfile | null>;

  addInterestToUserProfile(
    userProfileId: string,
    interestId: string
  ): Promise<IUserProfile | null>;

  followUserProfile(
    userProfileId: string,
    friendUserProfileId: string
  ): Promise<IUserProfile | null>;

  findUserProfileById(id: string): Promise<IUserProfile | null>;

  findUserProfileByEmail(email: string): Promise<IUserProfile | null>;

  searchUserProfile(params?: IUserProfileSearchParams): Promise<IUserProfile[]>;
}

export interface IUserProfileService {
  createUserProfile(body: CreateUserProfileParams): Promise<IUserProfile>;

  deleteUserProfile(id: string): Promise<IUserProfile | null>;

  searchUserProfile(
    body: ISearchEventQuerys
  ): Promise<IUserProfile[] | IUserProfile>;

  updateUserProfile(body: Partial<IUserProfile>): Promise<IUserProfile>;

  loginUserProfile(
    body: Partial<IUserProfile>
  ): Promise<ILoginExternalUserResponse>;

  addInterestToUserProfile(
    params: IUserProfileInterestParams
  ): Promise<IUserProfile | null>;

  followUserProfile(params: IFollowUserInput): Promise<IUserProfile | null>;
}
