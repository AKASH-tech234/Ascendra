import { Router } from "express";
import { prisma } from "../db";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { writeAuditLog } from "../utils/audit";

const router = Router();

const allowedUoms = ["MIN_MAX", "TIMELINE", "ZERO"] as const;
const tolerance = 0.01;

const parseDate = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

async function getActiveGoalStats(userId: string, excludeId?: string) {
  const where = {
    creatorId: userId,
    status: { notIn: ["REJECTED", "COMPLETED"] },
    ...(excludeId ? { id: { not: excludeId } } : {}),
  };

  const [count, sum] = await Promise.all([
    prisma.goal.count({ where }),
    prisma.goal.aggregate({ where, _sum: { weight: true } }),
  ]);

  return { count, totalWeight: sum._sum.weight || 0 };
}

// GET /api/goals
router.get("/", async (_req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      include: { creator: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(goals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// GET /api/goals/:id
router.get("/:id", async (req, res) => {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: req.params.id },
      include: { creator: true },
    });
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    return res.json(goal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch goal" });
  }
});

// POST /api/goals
router.post("/", optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      weight,
      startDate,
      dueDate,
      targetValue,
      uom,
      creatorId,
    } = req.body as {
      title?: string;
      description?: string;
      categoryId?: string;
      weight?: number;
      startDate?: string;
      dueDate?: string;
      targetValue?: number;
      uom?: string;
      creatorId?: string;
    };

    if (
      !title ||
      !categoryId ||
      !startDate ||
      !dueDate ||
      !targetValue ||
      !uom
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!allowedUoms.includes(uom as (typeof allowedUoms)[number])) {
      return res.status(422).json({ error: "Unsupported unit of measure" });
    }

    const parsedWeight = toNumber(weight);
    if (parsedWeight === null || parsedWeight < 10 || parsedWeight > 100) {
      return res
        .status(422)
        .json({ error: "Weight must be between 10 and 100" });
    }

    const parsedTarget = toNumber(targetValue);
    if (parsedTarget === null || parsedTarget <= 0) {
      return res.status(422).json({ error: "Target value is invalid" });
    }

    const parsedStart = parseDate(startDate);
    const parsedDue = parseDate(dueDate);
    if (!parsedStart || !parsedDue || parsedDue <= parsedStart) {
      return res.status(422).json({ error: "Invalid start or due date" });
    }

    let actualCreatorId = req.user?.id || creatorId;
    if (!actualCreatorId) {
      const user = await prisma.user.findFirst();
      actualCreatorId = user?.id;
    }

    if (!actualCreatorId) {
      return res
        .status(400)
        .json({ error: "No user exists to associate with the goal" });
    }

    const { count, totalWeight } = await getActiveGoalStats(actualCreatorId);
    if (count >= 8) {
      return res.status(422).json({ error: "Maximum 8 goals per cycle" });
    }

    if (totalWeight + parsedWeight > 100 + tolerance) {
      return res
        .status(422)
        .json({ error: "Total goal weight cannot exceed 100%" });
    }

    const newGoal = await prisma.goal.create({
      data: {
        title,
        description,
        categoryId,
        weight: parsedWeight,
        startDate: parsedStart,
        dueDate: parsedDue,
        targetValue: parsedTarget,
        uom,
        creatorId: actualCreatorId,
      },
    });

    if (req.user) {
      await writeAuditLog({
        actorId: req.user.id,
        action: "goal.created",
        entityType: "goal",
        entityId: newGoal.id,
      });
    }

    return res.status(201).json(newGoal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create goal" });
  }
});

// PATCH /api/goals/:id
router.patch("/:id", optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const {
      title,
      description,
      categoryId,
      weight,
      startDate,
      dueDate,
      targetValue,
      uom,
    } = req.body as {
      title?: string;
      description?: string;
      categoryId?: string;
      weight?: number;
      startDate?: string;
      dueDate?: string;
      targetValue?: number;
      uom?: string;
    };

    const nextWeight = weight === undefined ? goal.weight : toNumber(weight);
    if (nextWeight === null || nextWeight < 10 || nextWeight > 100) {
      return res
        .status(422)
        .json({ error: "Weight must be between 10 and 100" });
    }

    if (uom && !allowedUoms.includes(uom as (typeof allowedUoms)[number])) {
      return res.status(422).json({ error: "Unsupported unit of measure" });
    }

    const parsedStart = startDate ? parseDate(startDate) : goal.startDate;
    const parsedDue = dueDate ? parseDate(dueDate) : goal.dueDate;
    if (!parsedStart || !parsedDue || parsedDue <= parsedStart) {
      return res.status(422).json({ error: "Invalid start or due date" });
    }

    const { totalWeight } = await getActiveGoalStats(goal.creatorId, goal.id);
    if (totalWeight + nextWeight > 100 + tolerance) {
      return res
        .status(422)
        .json({ error: "Total goal weight cannot exceed 100%" });
    }

    const updated = await prisma.goal.update({
      where: { id: goal.id },
      data: {
        title: title ?? goal.title,
        description: description ?? goal.description,
        categoryId: categoryId ?? goal.categoryId,
        weight: nextWeight,
        startDate: parsedStart,
        dueDate: parsedDue,
        targetValue: targetValue ?? goal.targetValue,
        uom: uom ?? goal.uom,
      },
    });

    if (req.user) {
      await writeAuditLog({
        actorId: req.user.id,
        action: "goal.updated",
        entityType: "goal",
        entityId: updated.id,
      });
    }

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update goal" });
  }
});

// PATCH /api/goals/:id/status
router.patch(
  "/:id/status",
  optionalAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { status } = req.body as { status?: string };
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const goal = await prisma.goal.findUnique({
        where: { id: req.params.id },
      });
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      if (status === "SUBMITTED") {
        const { count, totalWeight } = await getActiveGoalStats(goal.creatorId);
        if (count > 8) {
          return res.status(422).json({ error: "Maximum 8 goals per cycle" });
        }

        if (Math.abs(totalWeight - 100) > tolerance) {
          return res
            .status(422)
            .json({ error: "Total goal weight must equal 100%" });
        }
      }

      const updated = await prisma.goal.update({
        where: { id: goal.id },
        data: { status },
      });

      if (status === "SUBMITTED") {
        const existingApproval = await prisma.approval.findFirst({
          where: { goalId: goal.id, status: "PENDING" },
        });

        if (!existingApproval) {
          const manager = await prisma.user.findFirst({
            where: { role: { in: ["MANAGER", "ADMIN"] } },
            orderBy: { createdAt: "asc" },
          });

          await prisma.approval.create({
            data: {
              goalId: goal.id,
              requesterId: goal.creatorId,
              managerId: manager?.id || goal.creatorId,
            },
          });
        }
      }

      if (req.user) {
        await writeAuditLog({
          actorId: req.user.id,
          action: `goal.status.${status.toLowerCase()}`,
          entityType: "goal",
          entityId: goal.id,
        });
      }

      return res.json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update goal status" });
    }
  },
);

// DELETE /api/goals/:id
router.delete("/:id", optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    await prisma.goal.delete({ where: { id: goal.id } });

    if (req.user) {
      await writeAuditLog({
        actorId: req.user.id,
        action: "goal.deleted",
        entityType: "goal",
        entityId: goal.id,
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete goal" });
  }
});

export const goalsRouter = router;
