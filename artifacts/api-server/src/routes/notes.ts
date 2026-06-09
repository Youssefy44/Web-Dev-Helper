import { Router } from "express";
import { db, notesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateNoteBody, DeleteNoteParams } from "@workspace/api-zod";

const router = Router();

router.get("/notes", async (req, res) => {
  const notes = await db
    .select()
    .from(notesTable)
    .orderBy(notesTable.createdAt);
  res.json(
    notes.map((n) => ({
      id: n.id,
      content: n.content,
      createdAt: n.createdAt.toISOString(),
    }))
  );
});

router.post("/notes", async (req, res) => {
  const parseResult = CreateNoteBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [note] = await db
    .insert(notesTable)
    .values({ content: parseResult.data.content })
    .returning();

  res.status(201).json({
    id: note.id,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
  });
});

router.delete("/notes/:id", async (req, res) => {
  const parseResult = DeleteNoteParams.safeParse({ id: Number(req.params.id) });
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid note id" });
    return;
  }

  await db.delete(notesTable).where(eq(notesTable.id, parseResult.data.id));
  res.status(204).send();
});

export default router;
