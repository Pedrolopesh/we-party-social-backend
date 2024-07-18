import { ICreateUsersParams } from "types/User";
import axios from "axios";
import { UserProfile } from "types/UserProfile";

export const requestCreateExternalUser = async (
  params: ICreateUsersParams
): Promise<UserProfile> => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/users/create",
      params
    );

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating user profile");
  }
};
