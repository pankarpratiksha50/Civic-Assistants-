import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Report from "../models/Report.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { detectPothole } from "../services/detector.js";
const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
}});
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload a JPG, PNG or WEBP image (max 8 MB)." });
    const latitude = Number(req.body.latitude), longitude = Number(req.body.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude)>90 || Math.abs(longitude)>180)
      return res.status(400).json({ message: "A valid GPS latitude and longitude are required." });
    const detection = await detectPothole(req.file.path);
    const report = await Report.create({
      title: req.body.title || "Pothole reported",
      description: req.body.description || "",
      imageUrl: `/uploads/${req.file.filename}`,
      location: { type: "Point", coordinates: [longitude, latitude] },
      address: req.body.address || "Address not provided",
      severity: ["low","medium","high"].includes(req.body.severity) ? req.body.severity : "medium",
      detection, reportedBy: req.user._id
    });
    res.status(201).json({ report });
  } catch (e) { res.status(500).json({ message: "Could not create report." }); }
});
router.get("/", protect, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { reportedBy: req.user._id };
  const reports = await Report.find(filter).populate("reportedBy", "name email").sort({ createdAt: -1 });
  res.json({ reports });
});
router.get("/map/public", async (_req, res) => {
  const reports = await Report.find({ status: { $ne: "Resolved" } }).select("title location address status severity imageUrl createdAt detection");
  res.json({ reports });
});
router.get("/admin/stats", protect, adminOnly, async (_req, res) => {
  const [total, reported, progress, resolved] = await Promise.all([
    Report.countDocuments(), Report.countDocuments({status:"Reported"}),
    Report.countDocuments({status:"In Progress"}), Report.countDocuments({status:"Resolved"})
  ]);
  res.json({ total, reported, progress, resolved });
});
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  const allowed = ["Reported", "In Progress", "Resolved"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status." });
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!report) return res.status(404).json({ message: "Report not found." });
  res.json({ report });
});
export default router;
