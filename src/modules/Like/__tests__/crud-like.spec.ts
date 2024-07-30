import axios from "axios";

// npx jest src/modules/Like/__tests__/crud-like.spec.ts

describe("CRUD Like", () => {
  let token: string;
  let userProfileId: string;

  const emailTesting = "user28@gmail.com";
  const port = "8081";
  const interesNameTesting = "Eletro Rits 3";
  const eventIdTesting = "66a1529111bf26068696dffb";
  const commentIdTesting = "";

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

  it.skip("should return 200 OK for valid flow: like comment", async () => {
    const body = {
      userProfileId,
      likeType: "like",
      commentLikedId: "66a7e34a0ad0a0cc9429f280",
    };

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .post(`http://localhost:${port}/api/like/comment`, body, {
        headers: authHeaders,
      })
      .then((res) => {
        console.log("res: ", res.data);

        userProfileId = res.data.id;

        expect(res.status).toBe(201);
        expect(res.data.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error interest:", error.response.data);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  it.skip("should return 200 OK for valid flow: delete userProfile like in comment", async () => {
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .delete(
        `http://localhost:${port}/api/like/delete/comment/${commentIdTesting}`,
        {
          headers: authHeaders,
        }
      )
      .then((res) => {
        console.log("res: ", res.data);

        userProfileId = res.data.id;

        expect(res.status).toBe(201);
        expect(res.data.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error interest:", error);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  // === Event Like Methods Testing ===

  it.skip("should return 200 OK for valid flow: like event", async () => {
    const body = {
      userProfileId,
      likeType: "party",
      eventLikedId: "66a1529111bf26068696dffb",
    };

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .post(`http://localhost:${port}/api/like/event`, body, {
        headers: authHeaders,
      })
      .then((res) => {
        console.log("res: ", res.data);

        userProfileId = res.data.id;

        expect(res.status).toBe(201);
        expect(res.data.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error interest:", error.response.data);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  it.skip("should return 200 OK for valid flow: delete userProfile like in event", async () => {
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .delete(
        `http://localhost:${port}/api/like/delete/event/${eventIdTesting}`,
        {
          headers: authHeaders,
        }
      )
      .then((res) => {
        console.log("res: ", res.data);

        userProfileId = res.data.id;

        expect(res.status).toBe(200);
        expect(res.data.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error interest:", error);

        throw new Error("Error deleting event like");
      });
  });

  // === Event Like Methods Testing ===

  it.skip("should return 200 OK for valid flow: search userProfile like in event", async () => {
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .get(
        `http://localhost:${port}/api/like/search?userProfileId=${userProfileId}&eventId=${eventIdTesting}`,
        {
          headers: authHeaders,
        }
      )
      .then((res) => {
        console.log("res: ", res.data);

        userProfileId = res.data.id;

        expect(res.status).toBe(201);
        expect(res.data.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error interest:", error);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  // Adicione mais testes para os outros endpoints CRUD aqui...
});
