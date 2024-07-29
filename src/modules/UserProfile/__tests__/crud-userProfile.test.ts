import axios from "axios";

describe.skip("CRUD UserProfile", () => {
  let token: string;
  let userProfileId: string;
  const emailTesting = "user28@gmail.com";
  const port = "8081";
  const interesIdTesting = "669eb2cd46a0047b33c5b2c6";

  it.skip("should create a new user profile", async () => {
    const body = {
      name: "user unitary test",
      email: emailTesting,
      password: "Teste12345@",
      acceptedTerms: true,
      notificationActive: true,
    };

    try {
      const res = await axios.post(
        `http://localhost:${port}/api/userprofile/create`,
        body
      );

      expect(res.data.status).toBe(201); // Supondo que 201 Created é o status esperado
      expect(res.data.data).toHaveProperty("id");
    } catch (error: any) {
      console.log("Error creating user profile:", error.response?.data);
      throw error;
    }
  });

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

      console.log("res: ", res.data);

      token = res.data.data.response.token;
      token = res.data.data.response.token;

      expect(res.data.data.status).toBe(200);
      expect(res.data.data.response).toHaveProperty("token");
      expect(res.data.data.response).toHaveProperty("userProfileId");
    } catch (error: any) {
      console.log("Error logging in:", error);
      throw error;
    }
  });

  it.skip("should return 200 OK for valid added interest", async () => {
    const body = {
      userProfileId: userProfileId, //Loged user
      interestId: interesIdTesting,
    };

    try {
      const authHeaders = {
        Authorization: `Bearer ${token}`,
        userProfileId: `${userProfileId}`,
      };

      const res = await axios.post(
        `http://localhost:${port}/api/userprofile/add/interest`,
        body,
        { headers: authHeaders }
      );

      console.log("res: ", res.data);
      expect(res.data.data.status).toBe(200);
      expect(res.data.data.response).toHaveProperty("token");
      expect(res.data.data.response).toHaveProperty("userProfileId");
    } catch (error: any) {
      console.log("Error logging in:", error.response?.data);
      throw error;
    }
  });

  it("should return 200 OK for valid flow: if the user can add interest", async () => {
    const body = {
      userProfileId: userProfileId,
      interestId: interesIdTesting,
    };

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      userProfileId: `${userProfileId}`,
    };

    try {
      const res = await axios.post(
        `http://localhost:${port}/api/userprofile/add/interest`,
        body,
        { headers: authHeaders }
      );

      console.log("res: ", res.data);

      userProfileId = res.data.data[0].id;

      expect(res.data.status).toBe(200);
      expect(res.data.data[0]).toHaveProperty("id");
    } catch (error: any) {
      console.log("Error searching user profile:", error);
      throw error;
    }
  });

  // Adicione mais testes para os outros endpoints CRUD aqui...
});
