import express from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { UserProfileValidation } from "../controllers/UserProfileValidation";
import { UserProfileRepository } from "../database/RepoUserProfile";
import { UserProfileController } from "../controllers/UserProfileController";
import { removeMassiveUsers } from "../local-helprs/remove-massive";

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const userProfileValidation = new UserProfileValidation();

router
  .route("/create")
  .post(userProfileValidation.userInputValidations, async (req, res) => {
    const mongoUserProfileRepository = new UserProfileRepository();

    const userProfileController = new UserProfileController(
      mongoUserProfileRepository
    );

    const { body, status } = await userProfileController.createUserProfile({
      body: req.body,
    });

    res.status(status).send(body);
  });

router.route("/login").post(async (req, res) => {
  try {
    const mongoUserProfileRepository = new UserProfileRepository();

    const userProfileController = new UserProfileController(
      mongoUserProfileRepository
    );

    const { body, status } = await userProfileController.loginUserProfile({
      body: req.body,
    });

    res.status(status).send(body);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});
// ============= PROTECTED ROUTES =============

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
