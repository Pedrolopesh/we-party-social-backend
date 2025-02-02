import axios from "axios";

describe("CRUD Interest", () => {
  let token: string;
  let userProfileId: string;
  let interesIdTesting: string;
  const emailTesting = "user1@gmail.com";
  const port = "8081";
  const interesNameTesting = "Rap";

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

      token = res.data.response.token;
      userProfileId = res.data.response.userProfileId;

      expect(res.data.status).toBe(200);
      expect(res.data.response).toHaveProperty("token");
      expect(res.data.response).toHaveProperty("userProfileId");
    } catch (error: any) {
      console.log("Error logging in:", error);
      throw new Error("Error logging in");
    }
  });

  it.skip("should return 200 OK for valid flow: add new interest", async () => {
    const body = {
      name: interesNameTesting,
      createdBy: userProfileId,
    };

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .post(`http://localhost:${port}/api/interest/create`, body, {
        headers: authHeaders,
      })
      .then((res) => {
        userProfileId = res.data.id;

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error interest:", error);
        throw new Error("Error creating interest");
      });
  });

  it.skip("should return 200 OK for valid flow: search interes", async () => {
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userprofileid: `${userProfileId}`,
    };

    await axios
      .get(`http://localhost:${port}/api/interest/search`, {
        headers: authHeaders,
      })
      .then((res) => {
        console.log("res: ", res.data);

        userProfileId = res.data.id;

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id");
      })
      .catch((error: any) => {
        console.log("Error interest:", error);
        // console.log("Error interest:", error.response.data);
        throw new Error("Error creating interest");
      });
  });

  // Adicione mais testes para os outros endpoints CRUD aqui...
});
