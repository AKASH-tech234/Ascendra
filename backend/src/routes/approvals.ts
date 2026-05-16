import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { writeAuditLog } from "../utils/audit";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, categoryId, requester, search } = req.query as {
      status?: string;
      categoryId?: string;
      requester?: string;
      search?: string;
    };

    const where: Prisma.ApprovalWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.goal = { categoryId };
    }

    if (requester) {
      where.requester = {
        OR: [
          { name: { contains: requester, mode: "insensitive" } },
          { email: { contains: requester, mode: "insensitive" } },
        ],
      };
    }

    if (search) {
      where.goal = {
        ...(where.goal || {}),
        title: { contains: search, mode: "insensitive" },
      };
    }

    const approvals = await prisma.approval.findMany({
      where,
      orderBy: { requestedAt: "desc" },
      include: {
        goal: true,
        requester: true,
      },
    });

    const payload = approvals.map((approval) => ({
      id: approval.id,
      goalId: approval.goalId,
      requesterId: approval.requesterId,
      managerId: approval.managerId,
      status: approval.status,
      requestedAt: approval.requestedAt,
      respondedAt: approval.respondedAt ?? undefined,
      comments: approval.comments ?? undefined,
      goalContext: approval.goal
        ? {
            title: approval.goal.title,
            categoryId: approval.goal.categoryId,
          }
        : undefined,
      requesterContext: approval.requester
        ? {
            name: approval.requester.name,
            email: approval.requester.email,
          }
        : undefined,
    }));

    return res.json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load approvals" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body as {
      status?: string;
      comments?: string;
    };

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(422).json({ error: "Unsupported status" });
    }

    if (status === "REJECTED" && !comments?.trim()) {
      return res
        .status(422)
        .json({ error: "Comments are required for rejection" });
    }

    const existing = await prisma.approval.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Approval not found" });
    }

    if (existing.status !== "PENDING") {
      return res.status(409).json({ error: "Approval already processed" });
    }

    const [updatedApproval] = await prisma.$transaction([
      prisma.approval.update({
        where: { id },
        data: {
          status,
          comments: comments?.trim() || null,
          respondedAt: new Date(),
        },
        include: {
          goal: true,
          requester: true,
        },
      }),
      prisma.goal.update({
        where: { id: existing.goalId },
        data: {
          status: status === "APPROVED" ? "APPROVED" : "REJECTED",
        },
      }),
    ]);

    if (req.user) {
      await writeAuditLog({
        actorId: req.user.id,
        action:
          status === "APPROVED" ? "approval.approved" : "approval.rejected",
        entityType: "approval",
        entityId: updatedApproval.id,
        metadata: {
          goalId: updatedApproval.goalId,
          requesterId: updatedApproval.requesterId,
        },
      });
    }

    return res.json({
      id: updatedApproval.id,
      goalId: updatedApproval.goalId,
      requesterId: updatedApproval.requesterId,
      managerId: updatedApproval.managerId,
      status: updatedApproval.status,
      requestedAt: updatedApproval.requestedAt,
      respondedAt: updatedApproval.respondedAt ?? undefined,
      comments: updatedApproval.comments ?? undefined,
      goalContext: updatedApproval.goal
        ? {
            title: updatedApproval.goal.title,
            categoryId: updatedApproval.goal.categoryId,
          }
        : undefined,
      requesterContext: updatedApproval.requester
        ? {
            name: updatedApproval.requester.name,
            email: updatedApproval.requester.email,
          }
        : undefined,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update approval" });
  }
});

export const approvalsRouter = router;
