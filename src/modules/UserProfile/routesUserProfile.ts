import express from "express";
const router = express.Router();

import { UserProfileValidation } from "./UserProfileValidation";
import { UserProfileRepository } from "./UserProfileRepository";
import { UserProfileController } from "./UserProfileController";
import { removeMassiveUsers } from "../../local-helprs/remove-massive";

import { AuthMiddleware } from "../../middlewares/auth";
import { InteresntValidation } from "../../modules/Interest/InterestValidation";
import { PermissionMiddleware } from "../../middlewares/checkPermission";
import { InterestRepository } from "../../modules/Interest/InterestRepository";
import { UserProfileService } from "./userProfileService";

const authMiddleware = new AuthMiddleware();
const interesntValidation = new InteresntValidation();
const permissionMiddleware = new PermissionMiddleware();

const userProfileValidation = new UserProfileValidation();
const userProfileRepository = new UserProfileRepository();
const interestRepository = new InterestRepository();

const userService = new UserProfileService(
  userProfileRepository,
  interestRepository
);

const userProfileController = new UserProfileController(userService);

router
  .route("/create")
  .post(
    userProfileValidation.userInputValidations,
    async (req, res) => await userProfileController.createUserProfile(req, res)
  );

router
  .route("/login")
  .post(
    async (req, res) => await userProfileController.loginUserProfile(req, res)
  );

router
  .route("/add/interest")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.addInterestInputValidations,
    async (req, res) =>
      await userProfileController.addInterestToUserProfile(req, res)
  );

router
  .route("/follow")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.followInputValidations,
    async (req, res) => await userProfileController.followUserProfile(req, res)
  );
// ============= PROTECTED ROUTES =============

router
  .route("/all")
  .get(
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    async (req, res) => {
      res.status(200).send(" testing ");
    }
  );

router
  .route("/delete/:id")
  .delete(
    async (req, res) => await userProfileController.deleteUserProfile(req, res)
  );

router.route("/delete/masive").get(async (req, res) => {
  console.log("delete/masive");
  const deletedMassive = await removeMassiveUsers();

  res.status(200).send(deletedMassive);
});

export default router;
