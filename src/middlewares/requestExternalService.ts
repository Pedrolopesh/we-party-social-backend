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

    const loginExternalUserResponse = {
      ...data,
    };

    return {
      status: 200,
      response: loginExternalUserResponse,
    };
  } catch (error: any) {
    return {
      status: error.response.status,
      response: error?.response?.data,
    };
  }
};
