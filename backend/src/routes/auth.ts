import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { signToken } from "../utils/tokens";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { writeAuditLog } from "../utils/audit";

const router = Router();

function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
function sendAuthError(res: Response, status: number, message: string) {
  return res.status(status).json({ error: message, message });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, role, password } = req.body as {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
    };

    if (!name || !email) {
      return sendAuthError(res, 400, "Name and email are required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendAuthError(res, 409, "Email already registered");
    }

    const normalizedRole = ["EMPLOYEE", "MANAGER", "ADMIN"].includes(role || "")
      ? (role as "EMPLOYEE" | "MANAGER" | "ADMIN")
      : "EMPLOYEE";

    const passwordHash = await bcrypt.hash(password || "changeme", 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: normalizedRole,
        passwordHash,
      },
    });

    const token = signToken({ userId: user.id, role: user.role });

    await writeAuditLog({
      actorId: user.id,
      action: "user.registered",
      entityType: "user",
      entityId: user.id,
    });

    return res.status(201).json({ user: toSafeUser(user), token });
  } catch (error) {
    console.error(error);
    return sendAuthError(res, 500, "Failed to register");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return sendAuthError(res, 400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendAuthError(res, 401, "Invalid credentials");
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return sendAuthError(res, 401, "Invalid credentials");
    }

    const token = signToken({ userId: user.id, role: user.role });

    await writeAuditLog({
      actorId: user.id,
      action: "auth.login",
      entityType: "user",
      entityId: user.id,
    });

    return res.status(200).json({ user: toSafeUser(user), token });
  } catch (error) {
    console.error(error);
    return sendAuthError(res, 500, "Failed to login");
  }
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return sendAuthError(res, 401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return sendAuthError(res, 404, "User not found");
    }

    return res.json(toSafeUser(user));
  } catch (error) {
    console.error(error);
    return sendAuthError(res, 500, "Failed to load user");
  }
});

router.post("/refresh", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return sendAuthError(res, 401, "Unauthorized");
  }

  const token = signToken({
    userId: req.user.id,
    role: req.user.role,
  });

  return res.json({ token });
});

export const authRouter = router;
