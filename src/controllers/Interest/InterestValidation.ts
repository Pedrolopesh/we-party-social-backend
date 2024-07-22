import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

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
  async interestSearchInputValidations(
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
}
