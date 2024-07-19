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
    userId: string;
    token: string;
    tokenExpiresAt: string;
  };
}
