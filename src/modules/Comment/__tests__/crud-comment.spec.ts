import axios from "axios";

describe("CRUD Comment", () => {
  let token: string;
  let userProfileId: string;
  let interesIdTesting: string;
  const emailTesting = "user28@gmail.com";
  const port = "8081";
  const interesNameTesting = "Eletro Rits 3";
  const commentedEventTesting = "66a1529111bf26068696dffb";
  const commentedIdTesting = "66a7ca9441c93e0ca5986a1c";

  it("should return 200 OK for valid credentials", async () => {
    const body = {
      email: emailTesting,
      password: "Teste12345@",
    };

    try {
      const res = await axios.post(
        `http://localhost:${port}/api/userprofile/login`,
        body
      );

      token = res.data.data.response.token;
      userProfileId = res.data.data.response.userProfileId;

      expect(res.data.data.status).toBe(200);
      expect(res.data.data.response).toHaveProperty("token");
      expect(res.data.data.response).toHaveProperty("userProfileId");
    } catch (error: any) {
      console.log("Error logging in:", error);
      throw new Error("Error logging in");
    }
  });

  it.skip("should return 200 OK for valid flow: add new comment in event", async () => {
    const body = {
      commentText: "new comment test",
      userProfile: userProfileId,
      commentedEvent: commentedEventTesting,
    };

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .post(`http://localhost:${port}/api/comment/create`, body, {
        headers: authHeaders,
      })
      .then((res) => {
        console.log("res: ", res.data);

        expect(res.data.status).toBe(201);
        expect(res.data.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error commemt event:", error);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  it.skip("should return 200 OK for valid flow: update comment in event", async () => {
    const body = {
      id: commentedIdTesting,
      commentText: "update comment test",
    };

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .patch(`http://localhost:${port}/api/comment/update`, body, {
        headers: authHeaders,
      })
      .then((res) => {
        console.log("res: ", res.data);

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error commemt event:", error);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  it.skip("should return 200 OK for valid flow: delete comment in event", async () => {
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .delete(
        `http://localhost:${port}/api/comment/delete/${commentedIdTesting}`,
        {
          headers: authHeaders,
        }
      )
      .then((res) => {
        console.log("res: ", res.data);

        expect(res.data.status).toBe(200);
        expect(res.data.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error commemt event:", error);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  it("should return 200 OK for valid flow: search a user comments", async () => {
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .get(
        `http://localhost:${port}/api/comment/search?userProfile=${userProfileId}`,
        {
          headers: authHeaders,
        }
      )
      .then((res) => {
        console.log("res: ", res.data);

        expect(res.data.status).toBe(200);
      })
      .catch((error: any) => {
        console.log("Error commemt event:", error);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });
});
