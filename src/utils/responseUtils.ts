// src/utils/responseUtils.ts
import { Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  data: any,
  status: number = 200
) => {
  res.status(status).json({
    status,
    ...data,
  });
};

export const sendErrorResponse = (
  res: Response,
  error: string,
  status: number = 400
) => {
  res.status(status).json({
    status,
    error,
  });
};
