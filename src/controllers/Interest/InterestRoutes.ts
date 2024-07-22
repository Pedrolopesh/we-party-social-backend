import express from "express";
const router = express.Router();
import { InteresntValidation } from "./InterestValidation";
import { AuthMiddleware } from "../../middlewares/auth";
import { PermissionMiddleware } from "../../middlewares/checkPermission";
// import { UserProfileValidation } from "./UserProfileValidation";
// import { UserProfileRepository } from "../../database/RepoUserProfile";
// import { UserProfileController } from "./UserProfileController";
// import { removeMassiveUsers } from "../../local-helprs/remove-massive";
// import { PermissionMiddleware } from "../../middlewares/checkPermission";

const interesntValidation = new InteresntValidation();
const authMiddleware = new AuthMiddleware();
const permissionMiddleware = new PermissionMiddleware();

// const userProfileValidation = new UserProfileValidation();
// const userProfileRepository = new UserProfileRepository();

router
  .route("/create")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.interestInputValidations,
    async (req, res) => {
      try {
        // const userProfileController = new UserProfileController(
        //   userProfileRepository
        // );

        // const { body, status } = await userProfileController.createUserProfile({
        //   body: req.body,
        // });

        // res.status(status).send(body);
        res.status(200).send("request validated");
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Internal server error in create route" });
      }
    }
  );

router
  .route("/update")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.interestInputValidations,
    async (req, res) => {
      try {
        // const userProfileController = new UserProfileController(
        //   userProfileRepository
        // );

        // const { body, status } = await userProfileController.createUserProfile({
        //   body: req.body,
        // });

        // res.status(status).send(body);
        res.status(200).send("request validated");
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Internal server error in create route" });
      }
    }
  );

router
  .route("/search")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.interestInputValidations,
    async (req, res) => {
      try {
        // const userProfileController = new UserProfileController(
        //   userProfileRepository
        // );

        // const { body, status } = await userProfileController.createUserProfile({
        //   body: req.body,
        // });

        // res.status(status).send(body);
        res.status(200).send("request validated");
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Internal server error in create route" });
      }
    }
  );

router
  .route("/delete")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.interestInputValidations,
    async (req, res) => {
      try {
        // const userProfileController = new UserProfileController(
        //   userProfileRepository
        // );

        // const { body, status } = await userProfileController.createUserProfile({
        //   body: req.body,
        // });

        // res.status(status).send(body);
        res.status(200).send("request validated");
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Internal server error in create route" });
      }
    }
  );

export default router;
