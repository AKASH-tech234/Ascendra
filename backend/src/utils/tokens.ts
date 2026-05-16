import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Missing JWT_SECRET environment variable. Set JWT_SECRET in backend .env before starting the server.",
  );
}

const JWT_EXPIRES_IN =
  (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d";

export type TokenPayload = {
  userId: string;
  role: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
