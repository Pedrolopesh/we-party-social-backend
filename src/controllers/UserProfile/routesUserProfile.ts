import express from "express";
import { AuthMiddleware } from "../../middlewares/auth";
import { UserProfileValidation } from "./UserProfileValidation";
import { UserProfileRepository } from "../../database/RepoUserProfile";
import { UserProfileController } from "./UserProfileController";
import { removeMassiveUsers } from "../../local-helprs/remove-massive";
import { PermissionMiddleware } from "../../middlewares/checkPermission";

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const userProfileValidation = new UserProfileValidation();
const userProfileRepository = new UserProfileRepository();
const permissionMiddleware = new PermissionMiddleware();

router
  .route("/create")
  .post(userProfileValidation.userInputValidations, async (req, res) => {
    try {
      const userProfileController = new UserProfileController(
        userProfileRepository
      );

      const { body, status } = await userProfileController.createUserProfile({
        body: req.body,
      });

      res.status(status).send(body);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Internal server error in create route" });
    }
  });

router.route("/login").post(async (req, res) => {
  try {
    const userProfileController = new UserProfileController(
      userProfileRepository
    );

    const { body, status } = await userProfileController.loginUserProfile({
      body: req.body,
    });

    res.status(status).send(body);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Internal server error in login route` });
  }
});
// ============= PROTECTED ROUTES =============

router
  .route("/all")
  .get(
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    async (req, res) => {
      res.status(200).send(" testing ");
    }
  );

router.route("/all").get(async (req, res) => {
  const mongoUserProfileRepository = new UserProfileRepository();

  const userProfileController = new UserProfileController(
    mongoUserProfileRepository
  );

  const { body, status } = await userProfileController.getAllUserProfiles({
    body: req.params,
  });

  res.status(status).send(body);
});

router.route("/delete/:id").delete(async (req, res) => {
  const userProfileRepository = new UserProfileRepository();

  const userProfileController = new UserProfileController(
    userProfileRepository
  );

  const { body, status } = await userProfileController.deleteUserProfile({
    body: req.params,
  });

  res.status(status).send(body);
});

router.route("/delete/masive").get(async (req, res) => {
  console.log("delete/masive");
  const deletedMassive = await removeMassiveUsers();

  res.status(200).send(deletedMassive);
});

export default router;
