import express from "express";
const router = express.Router();

import { UserProfileValidation } from "./UserProfileValidation";
import { UserProfileRepository } from "./UserProfileRepository";
import { UserProfileController } from "./UserProfileController";
import { removeMassiveUsers } from "../../local-helprs/remove-massive";

import { AuthMiddleware } from "../../middlewares/auth";
import { InteresntValidation } from "../../controllers/Interest/InterestValidation";
import { PermissionMiddleware } from "../../middlewares/checkPermission";
import { InterestRepository } from "../../controllers/Interest/InterestRepository";

const authMiddleware = new AuthMiddleware();
const interesntValidation = new InteresntValidation();
const permissionMiddleware = new PermissionMiddleware();

const userProfileValidation = new UserProfileValidation();
const userProfileRepository = new UserProfileRepository();
const interestRepository = new InterestRepository();

const userProfileController = new UserProfileController(
  userProfileRepository,
  interestRepository
);

router
  .route("/create")
  .post(userProfileValidation.userInputValidations, async (req, res) => {
    try {
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
    const { body, status } = await userProfileController.loginUserProfile({
      body: req.body,
    });

    res.status(status).send(body);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Internal server error in login route` });
  }
});

router
  .route("/add/interest")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.addInterestInputValidations,
    async (req, res) => {
      try {
        const { body, status } =
          await userProfileController.addInterestToUserProfile({
            body: req.body,
          });

        res.status(status).send(body);
      } catch (error: any) {
        console.error(error);
        res.status(500).send({ message: error?.message });
      }
    }
  );

router
  .route("/follow")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.followInputValidations,
    async (req, res) => {
      try {
        const { body, status } = await userProfileController.followUserProfile({
          body: req.body,
        });

        res.status(status).send(body);
      } catch (error: any) {
        console.error(error);
        res.status(500).send({ message: error?.message });
      }
    }
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

router.route("/all").get(async (req, res) => {
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
