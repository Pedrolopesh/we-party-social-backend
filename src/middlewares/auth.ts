import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../controllers/protocols";

interface DecodedToken {
  id: string;
}

// Estendendo a interface Request do Express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export class AuthMiddleware {
  async validateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void> {
    try {
      const authHeader = req.headers.authorization;
      const authConfig = process.env.SECRET_KEY || "";

      if (!authHeader) {
        return res.status(401).send("No token provided");
      }

      const parts = authHeader.split(" ");

      if (!(parts.length === 2)) {
        return res.status(401).send("Token error");
      }

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send("Token malformatted");
      }

      // Bearer

      jwt.verify(token, authConfig, (err: any, decoded: any) => {
        if (err) {
          return res.status(401).send("Token Invalid");
        }

        if (!decoded || !decoded.id) {
          return res.status(401).send("Invalid token payload");
        }

        req.userId = decoded.id;
        return next();
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  }
}
