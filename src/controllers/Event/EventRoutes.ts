import { InterestRepository } from "./../Interest/InterestRepository";
import { UserProfileRepository } from "./../UserProfile/UserProfileRepository";
import express from "express";
const router = express.Router();
import { AuthMiddleware } from "../../middlewares/auth";
import { PermissionMiddleware } from "../../middlewares/checkPermission";
import { EventValidation } from "./EventValidation";
import { EventRepository } from "./EventRepository";
import { EventController } from "./EventController";

const interesntValidation = new EventValidation();
const authMiddleware = new AuthMiddleware();
const permissionMiddleware = new PermissionMiddleware();

const eventRepository = new EventRepository();
const userProfileRepository = new UserProfileRepository();
const interestRepository = new InterestRepository();
const eventController = new EventController(
  eventRepository,
  userProfileRepository,
  interestRepository
);

router
  .route("/create")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.eventInputValidations,
    async (req, res) => {
      try {
        const { body, status } = await eventController.createEvent({
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
  .route("/update")
  .patch(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.eventInputValidations,
    async (req, res) => {
      try {
        const { body, status } = await eventController.updateEvent({
          body: req.body,
        });

        res.status(status).send(body);
      } catch (error: any) {
        console.error(error);
        res.status(500).send({ message: error.message });
      }
    }
  );

export default router;
