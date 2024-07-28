import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

export class EventValidation {
  async eventInputValidations(req: Request, res: Response, next: NextFunction) {
    await check("nameEvent", "Event name is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("description", "Description is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("startDateTime", "Start date and time are required")
      .isISO8601()
      .toDate()
      .run(req);
    await check("zipCode", "Zip code is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("country", "Country is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("state", "State is required").isString().notEmpty().run(req);
    await check("city", "City is required").isString().notEmpty().run(req);
    await check("neighborhood", "Neighborhood is required")
      .isString()
      .notEmpty()
      .run(req);
    await check("streat", "Street is required").isString().notEmpty().run(req);
    await check("streatNumber", "Street number is required")
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
