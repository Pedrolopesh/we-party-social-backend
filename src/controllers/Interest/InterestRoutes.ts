import { header } from "express-validator";
import { InterestRepository } from "./InterestRepository";
import express from "express";
const router = express.Router();
import { InteresntValidation } from "./InterestValidation";
import { AuthMiddleware } from "../../middlewares/auth";
import { PermissionMiddleware } from "../../middlewares/checkPermission";
import { InterestController } from "./InterestController";

const interesntValidation = new InteresntValidation();
const authMiddleware = new AuthMiddleware();
const permissionMiddleware = new PermissionMiddleware();

const interestRepository = new InterestRepository();
const interestController = new InterestController(interestRepository);

router
  .route("/create")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.interestInputValidations,
    async (req, res) => {
      try {
        const { body, status } = await interestController.createInterest({
          body: req.body,
        });

        res.status(status).send(body);
      } catch (error: any) {
        console.error(error);
        res.status(500).send({ message: error.message });
      }
    }
  );

router
  .route("/update/:id")
  .patch(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.interestInputValidations,
    async (req, res) => {
      try {
        const { body, status } = await interestController.updateInterest({
          body: {
            params: req.params,
            newInterest: req.body,
          },
        });

        res.status(status).send(body);
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
  .get(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.interestSearchInputValidations,
    async (req, res) => {
      try {
        console.log("req.params", req.query);

        const { body, status } = await interestController.serachInterest({
          body: req.query,
        });

        res.status(status).send(body);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Internal server error in create route" });
      }
    }
  );

router.route("/delete/:id").delete(
  authMiddleware.validateToken,
  permissionMiddleware.checkPermission.bind(permissionMiddleware),
  // interesntValidation.interestInputValidations,
  async (req, res) => {
    try {
      const { body, status } = await interestController.deleteInterest({
        body: req.params,
      });

      res.status(status).send(body);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Internal server error in create route" });
    }
  }
);

export default router;
