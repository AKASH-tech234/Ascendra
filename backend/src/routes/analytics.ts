import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const healthColors = [
  "bg-success-500",
  "bg-warning-500",
  "bg-accent",
  "bg-primary-500",
];

router.get("/admin", requireAuth, async (_req: AuthenticatedRequest, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      userCount,
      usersWithGoals,
      goalsCount,
      submittedCount,
      avgProgress,
      newGoalsWeek,
      auditEvents,
      auditLogs,
      departmentHealth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { goals: { some: {} } } }),
      prisma.goal.count(),
      prisma.goal.count({ where: { status: "SUBMITTED" } }),
      prisma.goal.aggregate({ _avg: { progress: true } }),
      prisma.goal.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.auditLog.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { actor: true },
      }),
      prisma.goal.groupBy({
        by: ["categoryId"],
        _avg: { progress: true },
      }),
    ]);

    const adoptionTarget = userCount
      ? Math.round((usersWithGoals / userCount) * 100)
      : 0;

    const cycleCompletion = Math.round(avgProgress._avg.progress || 0);

    const formattedLogs = auditLogs.map((log) => ({
      action: log.action,
      user: log.actor?.name || "System",
      time: log.createdAt.toLocaleDateString(),
      type: log.entityType,
    }));

    const formattedDepartments = departmentHealth.map((dept, index) => ({
      label: dept.categoryId,
      value: Math.round(dept._avg.progress || 0),
      color: healthColors[index % healthColors.length],
    }));

    return res.json({
      metrics: {
        adoptionTarget,
        activeUsers: userCount,
        cycleCompletion,
        pendingTeams: submittedCount,
        totalGoals: goalsCount,
        newGoalsWeek,
        auditEvents,
      },
      departmentHealth: formattedDepartments,
      auditLogs: formattedLogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load analytics" });
  }
});

export const analyticsRouter = router;
