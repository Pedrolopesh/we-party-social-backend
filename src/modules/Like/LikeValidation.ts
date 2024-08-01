import { NextFunction, Request, Response } from "express";
import { check, param, query, validationResult } from "express-validator";

export class LikeValidation {
  async likeEventInputValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await check("likeType", "likeType is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("userProfileId", "User profile ID is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("eventLikedId", "Event ID is required")
      .isString()
      .notEmpty()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  async likeCommentInputValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await check("likeType", "likeType is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("userProfileId", "User profile ID is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("commentLikedId", "Comment ID is required")
      .isString()
      .notEmpty()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  async deleteLikeValidations(req: Request, res: Response, next: NextFunction) {
    await param("id")
      .isString()
      .withMessage("id must be a string")
      .notEmpty()
      .withMessage("id is required")
      .isLength({ min: 24, max: 24 })
      .withMessage("id must be 24 characters long")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  async deleteEventLikeValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await param("eventLikedId")
      .isString()
      .withMessage("eventLikedId must be a string")
      .notEmpty()
      .withMessage("eventLikedId is required")
      .isLength({ min: 24, max: 24 })
      .withMessage("eventLikedId must be 24 characters long")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  async deleteCommentLikeValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await param("commentLikedId")
      .isString()
      .withMessage("commentLikedId must be a string")
      .notEmpty()
      .withMessage("commentLikedId is required")
      .isLength({ min: 24, max: 24 })
      .withMessage("commentLikedId must be 24 characters long")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  async likeSearchParamsValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await query("userProfile", "User profile ID must be valid")
      .optional()
      .isString()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}
