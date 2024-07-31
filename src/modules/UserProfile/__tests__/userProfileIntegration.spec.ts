import axios from "axios";

// Run the tests with the command:
// npx jest src/modules/UserProfile/__tests__/crud-userProfile.test.ts

const port = "8081";
const baseURL = `http://localhost:${port}/api/userprofile`;

const emailTesting = "user28@gmail.com";
const passwordTesting = "Teste12345@";
const interesIdTesting = "669eb2cd46a0047b33c5b2c6";

let token: string;
let userProfileId: string;

describe("CRUD UserProfile", () => {
  beforeAll(async () => {
    // Setup logic if needed
  });

  afterAll(async () => {
    // Teardown logic if needed
  });

  it.skip("should create a new user profile", async () => {
    const body = {
      name: "user unitary test",
      email: emailTesting,
      password: passwordTesting,
      acceptedTerms: true,
      notificationActive: true,
    };

    try {
      const res = await axios.post(`${baseURL}/create`, body);

      expect(res.status).toBe(201); // Supondo que 201 Created é o status esperado
      expect(res.data).toHaveProperty("id");
      userProfileId = res.data.id; // Salva o ID para uso posterior
    } catch (error: any) {
      console.error("Error creating user profile:", error.response?.data);
      throw error;
    }
  });

  it("should return 200 OK for valid credentials", async () => {
    const body = {
      email: emailTesting,
      password: passwordTesting,
    };

    try {
      const res = await axios.post(`${baseURL}/login`, body);

      token = res.data.response.token;
      userProfileId = res.data.response.userProfileId;

      expect(res.status).toBe(200);
      expect(res.data.response).toHaveProperty("token");
      expect(res.data.response).toHaveProperty("userProfileId");
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data);
      throw error;
    }
  });

  it.skip("should return 200 OK for valid added interest", async () => {
    const body = {
      userProfileId: userProfileId, // Logged user
      interestId: interesIdTesting,
    };

    try {
      const authHeaders = {
        Authorization: `Bearer ${token}`,
        userProfileId: `${userProfileId}`,
      };

      const res = await axios.post(`${baseURL}/add/interest`, body, {
        headers: authHeaders,
      });

      expect(res.status).toBe(200);
      expect(res.data.response).toHaveProperty("token");
      expect(res.data.response).toHaveProperty("userProfileId");
    } catch (error: any) {
      console.error("Error adding interest:", error.response?.data);
      throw error;
    }
  });

  it.skip("should return 200 OK for valid flow: if the user can add interest", async () => {
    const body = {
      userProfileId: userProfileId,
      interestId: interesIdTesting,
    };

    try {
      const authHeaders = {
        Authorization: `Bearer ${token}`,
        userProfileId: `${userProfileId}`,
      };

      const res = await axios.post(`${baseURL}/add/interest`, body, {
        headers: authHeaders,
      });

      userProfileId = res.data[0].id;

      expect(res.status).toBe(200);
      expect(res.data[0]).toHaveProperty("id");
    } catch (error: any) {
      console.error("Error in flow test:", error.response?.data);
      throw error;
    }
  });
});
