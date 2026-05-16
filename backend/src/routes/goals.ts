import { Router } from "express";
import { prisma } from "../db";

const router = Router();

// GET /api/goals
router.get("/", async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      include: { creator: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// POST /api/goals
router.post("/", async (req, res) => {
  try {
    const { title, description, categoryId, weight, startDate, dueDate, targetValue, uom, creatorId } = req.body;
    
    // In a real app with auth, creatorId would come from the verified token
    // For now we'll allow it from the body, or fallback to the first user
    let actualCreatorId = creatorId;
    if (!actualCreatorId) {
      const user = await prisma.user.findFirst();
      actualCreatorId = user?.id;
    }

    if (!actualCreatorId) {
      return res.status(400).json({ error: "No user exists to associate with the goal." });
    }

    const newGoal = await prisma.goal.create({
      data: {
        title,
        description,
        categoryId,
        weight: weight || 1,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        targetValue,
        uom,
        creatorId: actualCreatorId,
      },
    });

    res.status(201).json(newGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

export const goalsRouter = router;
