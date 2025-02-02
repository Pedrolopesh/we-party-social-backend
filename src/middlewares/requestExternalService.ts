import {
  ICreateExternalUserParams,
  ILoginExternalUserParams,
  ILoginExternalUserResponse,
  IUserProfileRoleResponse,
} from "types/User";
import axios from "axios";
import { ICreatedExternalUser } from "../modules/UserProfile/UserProfile";

const port = process.env.EXTERNAL_SERVICE_PORT || 8080;

export const requestCreateExternalUser = async (
  params: ICreateExternalUserParams
): Promise<ICreatedExternalUser> => {
  try {
    const { data } = await axios.post(
      `http://localhost:${port}/api/users/create`,
      params
    );

    const createdExternalUserResponse: ICreatedExternalUser = {
      ...data,
    };

    return createdExternalUserResponse;
  } catch (err: any) {
    throw new Error(err?.response?.data || "Error creating external user");
  }
};

export const requestLoginExternalUser = async (
  params: ILoginExternalUserParams
): Promise<ILoginExternalUserResponse> => {
  try {
    const { data } = await axios.post(
      `http://localhost:${port}/api/users/login`,
      params
    );
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
      status: error?.response?.status,
      response: error?.response?.data,
    };
  }
};

export const requestCheckUserProfileRole = async (
  email: string,
  token: string
): Promise<IUserProfileRoleResponse> => {
  try {
    const { data } = await axios.post(
      `http://localhost:${port}/api/roles/check`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      status: 200,
      response: {
        role: data?.role,
      },
    };
  } catch (error: any) {
    return {
      status: error.response.status,
      response: error?.response?.data,
    };
  }
};
