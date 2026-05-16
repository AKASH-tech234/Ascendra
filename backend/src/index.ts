import express, { Request, Response } from "express";
import cors from "cors";
import { goalsRouter } from "./routes/goals";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/goals", goalsRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Backend is running (TypeScript)" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
