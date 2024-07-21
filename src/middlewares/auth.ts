import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { HttpResponse } from "../controllers/protocols";

// interface DecodedToken {
//   id: string;
// }

// Estendendo a interface Request do Express
// declare global {
//   namespace Express {
//     interface Request {
//       userId?: string;
//     }
//   }
// }
interface JwtPayload {
  iat: number; // Issued at
  exp: number; // Expiration time
}

export class AuthMiddleware {
  async validateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void> {
    try {
      const authHeader = req.headers.authorization;
      const authUserId = req.headers.userProfileId;
      const authConfig = process.env.SECRET_KEY || "";

      if (!authHeader || !authUserId) {
        return res
          .status(401)
          .send("No token or userId provided in request headers");
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

        const isTokenValid = (payload: JwtPayload): boolean => {
          const now = Math.floor(Date.now() / 1000); // tempo atual em segundos
          return now >= payload.iat && now <= payload.exp;
        };

        if (!isTokenValid(decoded)) {
          return res.status(401).send("Invalid token payload");
        }

        return next();
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  }
}
