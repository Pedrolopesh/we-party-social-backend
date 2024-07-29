import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

export class CommentValidation {
  async createCommentInputValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await check("commentText", "commentText is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("userProfileId", "User profile ID is required")
      .isString()
      .notEmpty()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}
