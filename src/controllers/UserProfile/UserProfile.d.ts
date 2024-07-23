import { HttpRequest, HttpResponse } from "controllers/protocols";

export interface UserProfile {
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
  createUserProfile(
    httpRequest: HttpRequest<CreateUserProfileParams>
  ): Promise<HttpResponse<UserProfile>>;

  deleteUserProfile(
    httpRequest: HttpRequest<{ id: string }>
  ): Promise<HttpResponse<UserProfile>>;

  getAllUserProfiles(
    httpRequest: HttpRequest<IUserProfileSearchParams>
  ): Promise<HttpResponse<UserProfile[]>>;

  addInterestToUserProfile(
    httpRequest: HttpRequest<IUserProfileInterestParams>
  ): Promise<HttpResponse<UserProfile | null>>;

  followUserProfile(
    httpRequest: HttpRequest<IFollowUserInput>
  ): Promise<HttpResponse<UserProfile | null>>;
}

export interface IUserProfileRepository {
  createUserProfile(
    params: CreateUserProfileParams<Omit<password>>
  ): Promise<UserProfile>;
  getAllUserProfiles(params?: IUserProfileSearchParams): Promise<UserProfile[]>;
  findUserProfileById(id: string): Promise<UserProfile | null>;
  findUserProfileByEmail(email: string): Promise<UserProfile | null>;
  updateUserProfile(
    id: string,
    params: IUpdateUserProfileParams
  ): Promise<UserProfile>;
  deleteUserProfile(id: string): Promise<UserProfile | null>;

  addInterestToUserProfile(
    userProfileId: string,
    interestId: string,
    interestName: string
  ): Promise<UserProfile | null>;

  followUserProfile(
    userProfileId: string,
    friendUserProfileId: string
  ): Promise<UserProfile | null>;
}
