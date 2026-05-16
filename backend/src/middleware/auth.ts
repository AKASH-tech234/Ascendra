import type { NextFunction, Response } from "express";
import type { Request } from "express";
import { verifyToken } from "../utils/tokens";

export type AuthUser = {
  id: string;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
  } catch (error) {
    // Ignore invalid tokens for optional auth routes
  }

  return next();
}
