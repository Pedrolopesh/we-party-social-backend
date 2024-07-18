import { ICreateExternalUserParams } from "types/User";
import axios from "axios";
import { ICreatedExternalUser } from "types/UserProfile";

export const requestCreateExternalUser = async (
  params: ICreateExternalUserParams
): Promise<ICreatedExternalUser> => {
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
