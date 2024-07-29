import express from "express";
const router = express.Router();

import { AuthMiddleware } from "../../middlewares/auth";
import { PermissionMiddleware } from "../../middlewares/checkPermission";
import { CommentValidation } from "./CommentValidations";
import { CommentRepository } from "./CommentRepository";
import { CommentService } from "./CommentService";
import { CommentController } from "./CommentController";
import { UserProfileRepository } from "../UserProfile/UserProfileRepository";
import { EventRepository } from "../Event/EventRepository";

const authMiddleware = new AuthMiddleware();
const permissionMiddleware = new PermissionMiddleware();

const commentValidation = new CommentValidation();

const commentRepository = new CommentRepository();
const userProfileRepository = new UserProfileRepository();
const eventRepository = new EventRepository();

const commentService = new CommentService(
  commentRepository,
  userProfileRepository,
  eventRepository
);
const commentController = new CommentController(commentService);

router
  .route("/create")
  .post(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    commentValidation.createCommentInputValidations,
    async (req, res) => await commentController.createComment(req, res)
  );

router
  .route("/update")
  .patch(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    commentValidation.createCommentInputValidations,
    async (req, res) => await commentController.updateComment(req, res)
  );

router
  .route("/search")
  .get(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    async (req, res) => await commentController.searchComment(req, res)
  );

router
  .route("/delete/:id")
  .delete(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    async (req, res) => await commentController.deleteComment(req, res)
  );

router
  .route("/like")
  .delete(
    authMiddleware.validateToken,
    permissionMiddleware.checkPermission.bind(permissionMiddleware),
    commentValidation.createCommentInputValidations,
    async (req, res) => await commentController.likeComment(req, res)
  );

export default router;
