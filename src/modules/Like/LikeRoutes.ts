import express from "express";
import { AuthMiddleware } from "../../middlewares/auth";
import { PermissionMiddleware } from "../../middlewares/checkPermission";
import { LikeValidation } from "./LikeValidation";
import { LikeController } from "./LinkeController";
import { LikeService } from "./LikeService";
import { UserProfileRepository } from "../UserProfile/UserProfileRepository";
import { LikeRepository } from "./LikeRepository";
import { EventRepository } from "../Event/EventRepository";
import { CommentRepository } from "../Comment/CommentRepository";
const router = express.Router();

const authMiddleware = new AuthMiddleware();
const permissionMiddleware = new PermissionMiddleware();

const likeValidation = new LikeValidation();

const likeRepository = new LikeRepository();
const userProfileRepository = new UserProfileRepository();
const eventRepository = new EventRepository();
const commentRepository = new CommentRepository();

const likeService = new LikeService(
  likeRepository,
  userProfileRepository,
  eventRepository,
  commentRepository
);

const likeController = new LikeController(likeService);

router
  .route("/event")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    likeValidation.likeEventInputValidations,
    async (req, res) => await likeController.likeEvent(req, res)
  );

router
  .route("/comment")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    likeValidation.likeCommentInputValidations,
    async (req, res) => await likeController.likeComment(req, res)
  );

router
  .route("/delete/event/:eventLikedId")
  .delete(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    likeValidation.deleteEventLikeValidations,
    async (req, res) => await likeController.deleteEventLike(req, res)
  );

router
  .route("/delete/comment/:commentLikedId")
  .delete(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    likeValidation.deleteLikeValidations,
    async (req, res) => await likeController.deleteCommentLike(req, res)
  );

router
  .route("/search")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    likeValidation.likeSearchParamsValidations,
    async (req, res) => await likeController.searchLike(req, res)
  );

export default router;
