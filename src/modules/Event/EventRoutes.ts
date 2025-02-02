import express from "express";
import { EventService } from "./EventService";
import { InterestRepository } from "./../Interest/InterestRepository";
import { UserProfileRepository } from "./../UserProfile/UserProfileRepository";
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

const eventService = new EventService(
  eventRepository,
  userProfileRepository,
  interestRepository
);

const eventController = new EventController(eventService);

const router = express.Router();

router
  .route("/create")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.eventInputValidations,
    async (req, res) => await eventController.createEvent(req, res)
  );

router
  .route("/update")
  .patch(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    interesntValidation.eventInputValidations,
    async (req, res) => await eventController.updateEvent(req, res)
  );

export default router;
