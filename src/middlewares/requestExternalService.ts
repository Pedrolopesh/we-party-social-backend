import {
  ICreateExternalUserParams,
  ILoginExternalUserParams,
  ILoginExternalUserResponse,
} from "types/User";
import axios from "axios";
import { ICreatedExternalUser } from "types/UserProfile";
import { HttpResponse } from "controllers/protocols";

export const requestCreateExternalUser = async (
  params: ICreateExternalUserParams
): Promise<ICreatedExternalUser> => {
  const { data, status } = await axios.post(
    "http://localhost:8000/api/users/create",
    params
  );

  console.log(data, status);

  const createdExternalUserResponse: ICreatedExternalUser = {
    ...data,
  };

  return createdExternalUserResponse;
};

export const requestLoginExternalUser = async (
  params: ILoginExternalUserParams
): Promise<ILoginExternalUserResponse> => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/users/login",
      params
    );

    const loginExternalUserResponse: any = {
      token: data?.auth?.token,
      tokenExpiresAt: data?.auth?.tokenExpiresAt,
      name: data?.name,
      username: data?.username,
      userProfileId: data?.mongoUserId,
    };

    return {
      status: 200,
      response: {
        token: data?.auth?.token,
        tokenExpiresAt: data?.auth?.tokenExpiresAt,
        name: data?.name,
        username: data?.username,
        userProfileId: data?.mongoUserId,
      },
    };
  } catch (error: any) {
    return {
      status: error.response.status,
      response: error?.response?.data,
    };
  }
};
