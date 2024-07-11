import { HttpRequest, HttpResponse } from "controllers/protocols";

export interface UserProfile {
  id: string;
  sqlUserId: string;
  name: string;
  username: string;
  password: string;
  email: string;
  type: string;
  document: string;
  acceptedTerms: boolean;
  roleId: string;
  following: string;
  followers: string;
}

export interface CreateUserProfileParams {
  name: string;
  email: string;
  phone: string;
}

export interface IUserProfileSearchParams {
  name?: string;
  email?: string;
  phone?: string;
  id?: string;
}

export interface IUserProfileController {
  createUserProfile(
    httpRequest: HttpRequest<CreateUserProfileParams>
  ): Promise<HttpResponse<UserProfile>>;

  getUserProfiles(
    params?: IUserProfileSearchParams
  ): Promise<HttpResponse<UserProfile[]>>;
}

export interface IUserProfileRepository {
  createUserProfile(params: CreateUserProfileParams): Promise<UserProfile>;
  getUserProfiles(params?: IUserProfileSearchParams): Promise<UserProfile[]>;
  findUserProfileById(id: string): Promise<UserProfile | null>;
  findUserProfileByEmail(email: string): Promise<UserProfile | null>;
}
