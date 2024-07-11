import express from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { UserProfileRepository } from "../database/RepoUserProfile";
import { UserProfileController } from "../controllers/UserProfile";

const router = express.Router();
const authMiddleware = new AuthMiddleware();

// ============= PROTECTED ROUTES =============
router.route("/create").post(authMiddleware.validateToken, async (req, res) => {
  const mongoUserProfileRepository = new UserProfileRepository();

  const userProfileController = new UserProfileController(
    mongoUserProfileRepository
  );

  const { body, status } = await userProfileController.createUserProfile({
    body: req.body,
  });

  res.status(status).send(body);
});

router.route("/all").post(authMiddleware.validateToken, async (req, res) => {
  const mongoUserProfileRepository = new UserProfileRepository();

  const userProfileController = new UserProfileController(
    mongoUserProfileRepository
  );

  const { body, status } = await userProfileController.getUserProfiles();

  res.status(status).send(body);
});

export default router;
