export interface ICreateExternalUserParams {
  name: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
  notificationActive: boolean;
  mongoUserId: string;
}

export interface ILoginExternalUserParams {
  email: string;
  password: string;
}

export interface ILoginExternalUserResponse {
  status: number;
  response: {
    token: string;
    tokenExpiresAt: string;
    name: string;
    username: string;
    userProfileId: string;
  };
}

export interface IUserProfileRoleResponse {
  status: number;
  response: {
    role: string;
  };
}
