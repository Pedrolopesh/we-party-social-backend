import axios from "axios";
// import { IUserProfile } from "../modules/UserProfile/UserProfile";

export const removeMassiveUsers = async () => {
  try {
    const users: any = []

    const usersIds = users.map((user: any) => user.id);

    usersIds.forEach(async (id: string) => {
      await axios
        .delete(`http://localhost:8001/api/userprofile/delete/${id}`)
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
