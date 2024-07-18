export interface ICreateUsersParams {
  name: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
  notificationActive: boolean;
  mongoUserId: string;
}
