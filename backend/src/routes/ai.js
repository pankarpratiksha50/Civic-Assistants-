import { Router } from "express";
import { answerWithRag } from "../services/rag.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.post("/chat", protect, async (req, res) => {
  const question = String(req.body.question || "").trim();
  if (!question || question.length > 1000) return res.status(400).json({ message: "Enter a question up to 1000 characters." });
  try { res.json(await answerWithRag(question)); }
  catch (e) { console.error(e); res.status(500).json({ message: "Civic AI is temporarily unavailable." }); }
});
export default router;
