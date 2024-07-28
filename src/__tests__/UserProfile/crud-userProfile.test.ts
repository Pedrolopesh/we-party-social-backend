import axios from "axios";

describe("CRUD UserProfile", () => {
  it("should create a new user profile", async () => {
    const body = {
      name: "user unitary test",
      email: "user28@gmail.com",
      password: "Teste12345@",
      acceptedTerms: true,
      notificationActive: true,
    };

    try {
      const res = await axios.post(
        "http://localhost:8002/api/userprofile/create",
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
      email: "user10@gmail.com",
      password: "Teste12345@",
    };

    try {
      const res = await axios.post(
        "http://localhost:8002/api/userprofile/login",
        body
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

  // Adicione mais testes para os outros endpoints CRUD aqui...
});
