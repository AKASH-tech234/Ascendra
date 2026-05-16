import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { goalsRouter } from "./routes/goals";
import { approvalsRouter } from "./routes/approvals";
import { checkinsRouter } from "./routes/checkins";
import { authRouter } from "./routes/auth";
import { analyticsRouter } from "./routes/analytics";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/approvals", approvalsRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Backend is running (TypeScript)" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
