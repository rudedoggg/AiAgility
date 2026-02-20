import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { authStorage } from "./storage";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice(7);

  try {
    if (!JWT_SECRET) {
      throw new Error("SUPABASE_JWT_SECRET is not configured");
    }
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const user = await authStorage.getUser(userId);
  if (!user?.isAdmin) return res.status(403).json({ message: "Forbidden" });
  next();
};
