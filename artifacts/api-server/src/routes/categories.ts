import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const rows = await db.select().from(categoriesTable);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list categories");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
