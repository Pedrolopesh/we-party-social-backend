import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

export class UserProfileValidation {
  async userInputValidations(req: Request, res: Response, next: NextFunction) {
    if (typeof req.body.acceptedTerms === "string") {
      return res.status(400).json({ errors: "Accepted terms must be boolean" });
    }

    if (typeof req.body.notificationActive === "string") {
      return res.status(400).json({ errors: "Accepted terms must be boolean" });
    }

    await check("email", "Email is required").isEmail().run(req);
    await check("password", "Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter")
      .matches(/[\W]/)
      .withMessage("Password must contain a special character")
      .run(req);
    await check("acceptedTerms", "acceptedTerms is required")
      .isBoolean()
      .withMessage("Accepted terms must be true or false")
      .equals("true")
      .toBoolean()
      .withMessage("You must accept the terms")
      .run(req);
    await check("notificationActive", "notificationActive is required")
      .isBoolean()
      .withMessage("Accepted terms must be true or false")
      .toBoolean()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}
