import axios from "axios";
import { MongoClient } from "../database/mongo";
import { IUserProfile } from "../controllers/UserProfile/UserProfile";

export const removeMassiveUsers = async () => {
  try {
    const users = await axios.get("http://localhost:8002/api/userprofile/all");
    console.log("users ?????", users);

    const usersIds = users.data.map((user: IUserProfile) => user.id);

    usersIds.forEach(async (id: string) => {
      await axios
        .delete(`http://localhost:8002/api/userprofile/delete/${id}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};
