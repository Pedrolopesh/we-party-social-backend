// __tests__/userProfileService.test.ts
import { UserProfileService } from "../userProfileService";
import { UserProfileRepository } from "../UserProfileRepository";

describe("UserProfileService", () => {
  let userProfileService: UserProfileService;
  let userProfileRepository: UserProfileRepository;

  beforeEach(() => {
    userProfileRepository = {
      findUserProfileById: jest.fn(),
      createUserProfile: jest.fn(),
    } as any;

    userProfileService = new UserProfileService(userProfileRepository);
  });

  it("should create a new user profile", async () => {
    const result = await userProfileService.createUserProfile({
      name: "user 1",
      email: "user21@gmail.com",
      password: "Teste12345@",
      acceptedTerms: true,
      notificationActive: true,
    });

    console.log({ result });

    // expect(result.status).toEqual(200);
    // expect(result.response).toHaveProperty("token");
    // expect(result.response).toHaveProperty("tokenExpiresAt");
    // expect(result.response).toHaveProperty("name");
    // expect(result.response).toHaveProperty("userProfileId");
  });

  it.skip("should return user profile for a valid user ID", async () => {
    const result = await userProfileService.loginUserProfile({
      email: "user10@gmail.com",
      password: "Teste12345@",
    });

    expect(result.status).toEqual(200);
    expect(result.response).toHaveProperty("token");
    expect(result.response).toHaveProperty("tokenExpiresAt");
    expect(result.response).toHaveProperty("name");
    expect(result.response).toHaveProperty("userProfileId");
  });

  // it('should throw an error if the user profile is not found', async () => {
  //   const userId = '123';
  //   (userProfileRepository.findUserProfileById as jest.Mock).mockResolvedValue(null);

  //   await expect(userProfileService.getUserProfile(userId)).rejects.toThrow('User profile not found');
  // });
});
