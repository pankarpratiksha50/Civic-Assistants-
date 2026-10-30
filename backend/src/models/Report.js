import mongoose from "mongoose";
const reportSchema = new mongoose.Schema({
  title: { type: String, default: "Pothole reported" },
  description: { type: String, default: "" },
  imageUrl: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: { type: String, default: "Address not provided" },
  severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["Reported", "In Progress", "Resolved"], default: "Reported" },
  detection: {
    provider: { type: String, default: "manual" },
    label: { type: String, default: "Pothole report" },
    confidence: { type: Number, default: null },
    state: { type: String, default: "not_configured" }
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
reportSchema.index({ location: "2dsphere" });
export default mongoose.model("Report", reportSchema);
