import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { writeAuditLog } from "../utils/audit";

const router = Router();

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const calculateProgress = (
  uom: string,
  goal: {
    targetValue: number;
    startDate: Date;
    dueDate: Date;
  },
  currentValue: number | null,
) => {
  if (uom === "TIMELINE") {
    const start = goal.startDate.getTime();
    const end = goal.dueDate.getTime();
    if (end <= start) {
      return null;
    }
    const now = Date.now();
    return clamp(((now - start) / (end - start)) * 100, 0, 100);
  }

  if (currentValue === null) {
    return null;
  }

  if (uom === "ZERO") {
    if (goal.targetValue <= 0) {
      return currentValue <= 0 ? 100 : 0;
    }
    return clamp((1 - currentValue / goal.targetValue) * 100, 0, 100);
  }

  // Default to MIN_MAX style
  if (goal.targetValue <= 0) {
    return null;
  }
  return clamp((currentValue / goal.targetValue) * 100, 0, 100);
};

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { goalId } = req.query as { goalId?: string };
    const checkIns = await prisma.checkIn.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return res.json(checkIns);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch check-ins" });
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { goalId, status, currentValue, comments, blockers } = req.body as {
      goalId?: string;
      status?: string;
      currentValue?: number;
      comments?: string;
      blockers?: string;
    };

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!goalId || !status || !comments) {
      return res
        .status(400)
        .json({ error: "Goal, status, and comments are required" });
    }

    if (!["NOT_STARTED", "ON_TRACK", "AT_RISK", "COMPLETED"].includes(status)) {
      return res.status(422).json({ error: "Unsupported status" });
    }

    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    if (goal.status !== "APPROVED" && goal.status !== "SUBMITTED") {
      return res.status(422).json({ error: "Goal is not active" });
    }

    const now = new Date();
    if (now < goal.startDate || now > goal.dueDate) {
      return res.status(422).json({
        error: "Check-ins are only allowed during the goal timeline",
      });
    }

    const parsedCurrentValue = toNumber(currentValue ?? null);
    const progress = calculateProgress(goal.uom, goal, parsedCurrentValue);
    if (progress === null || Number.isNaN(progress)) {
      return res
        .status(422)
        .json({ error: "Unable to compute progress for this goal" });
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        goalId,
        userId: req.user.id,
        status,
        currentValue: parsedCurrentValue,
        progress: Number(progress.toFixed(2)),
        comments,
        blockers: blockers?.trim() || null,
      },
    });

    await prisma.goal.update({
      where: { id: goalId },
      data: { progress: Number(progress.toFixed(2)) },
    });

    await writeAuditLog({
      actorId: req.user.id,
      action: "checkin.created",
      entityType: "checkin",
      entityId: checkIn.id,
      metadata: {
        goalId,
        progress: Number(progress.toFixed(2)),
      },
    });

    return res.status(201).json(checkIn);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit check-in" });
  }
});

export const checkinsRouter = router;
