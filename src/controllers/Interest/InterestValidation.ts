import { Request, Response, NextFunction } from "express";
import { check, validationResult, query, param } from "express-validator";

export class InteresntValidation {
  async interestInputValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await check("name", "name is required").isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
  async interestIdParamValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

  async interestSearchParamsValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await query("name", "name must be a string").optional().isString().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  async addInterestInputValidations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await check("userProfileId", "userProfileId is required")
      .isString()
      .withMessage("id must be a string")
      .notEmpty()
      .withMessage("id is required")
      .isLength({ min: 24, max: 24 })
      .withMessage("id must be 24 characters long")
      .run(req);

    await check("interestId", "interestId is required")
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
}
