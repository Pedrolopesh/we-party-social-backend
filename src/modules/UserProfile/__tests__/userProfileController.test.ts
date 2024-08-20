// __tests__/UserProfileController.test.ts
import { UserProfileController } from "../UserProfileController";
import { IUserProfileService } from "../UserProfile";
import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../utils/responseUtils";

// Mock das funções de responseUtils
jest.mock("../../utils/responseUtils", () => ({
  sendErrorResponse: jest.fn(),
  sendSuccessResponse: jest.fn(),
}));

describe("UserProfileController", () => {
  let userProfileController: UserProfileController;
  let userProfileService: IUserProfileService;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userProfileService = {
      createUserProfile: jest.fn(),
      loginUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      searchUserProfile: jest.fn(),
      deleteUserProfile: jest.fn(),
      addInterestToUserProfile: jest.fn(),
      followUserProfile: jest.fn(),
    } as IUserProfileService;

    userProfileController = new UserProfileController(userProfileService);

    req = {
      body: {},
    } as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user profile", async () => {
    const mockUserProfile = { id: "123", name: "Test User" };
    (userProfileService.createUserProfile as jest.Mock).mockResolvedValue(
      mockUserProfile
    );

    req.body = mockUserProfile;

    await userProfileController.createUserProfile(
      req as Request,
      res as Response
    );

    expect(userProfileService.createUserProfile).toHaveBeenCalledWith(
      mockUserProfile
    );
    expect(sendSuccessResponse).toHaveBeenCalledWith(res, mockUserProfile, 201);
  });

  it("should handle error when creating a user profile", async () => {
    const errorMessage = "Error creating user profile";
    (userProfileService.createUserProfile as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    req.body = { id: "123", name: "Test User" };

    await userProfileController.createUserProfile(
      req as Request,
      res as Response
    );

    expect(sendErrorResponse).toHaveBeenCalledWith(res, errorMessage, 500);
  });

  it("should login a user profile", async () => {
    const mockLoginResponse = { token: "12345" };
    (userProfileService.loginUserProfile as jest.Mock).mockResolvedValue(
      mockLoginResponse
    );

    req.body = { username: "testuser", password: "password" };

    await userProfileController.loginUserProfile(
      req as Request,
      res as Response
    );

    expect(userProfileService.loginUserProfile).toHaveBeenCalledWith(req.body);
    expect(sendSuccessResponse).toHaveBeenCalledWith(
      res,
      mockLoginResponse,
      200
    );
  });

  it("should handle error when logging in a user profile", async () => {
    const errorMessage = "Error logging in";
    (userProfileService.loginUserProfile as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    req.body = { username: "testuser", password: "password" };

    await userProfileController.loginUserProfile(
      req as Request,
      res as Response
    );

    expect(sendErrorResponse).toHaveBeenCalledWith(res, errorMessage, 500);
  });

  it("should update a user profile", async () => {
    const mockUpdateProfile = { id: "123", name: "Updated User" };
    (userProfileService.updateUserProfile as jest.Mock).mockResolvedValue(
      mockUpdateProfile
    );

    req.body = mockUpdateProfile;

    await userProfileController.updateUserProfile(
      req as Request,
      res as Response
    );

    expect(userProfileService.updateUserProfile).toHaveBeenCalledWith(
      mockUpdateProfile
    );
    expect(sendSuccessResponse).toHaveBeenCalledWith(
      res,
      mockUpdateProfile,
      200
    );
  });

  it("should handle error when updating a user profile", async () => {
    const errorMessage = "Error updating profile";
    (userProfileService.updateUserProfile as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    req.body = { id: "123", name: "Updated User" };

    await userProfileController.updateUserProfile(
      req as Request,
      res as Response
    );

    expect(sendErrorResponse).toHaveBeenCalledWith(res, errorMessage, 500);
  });
});
