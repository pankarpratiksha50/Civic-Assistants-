export async function detectPothole(imagePath) {
  const base = process.env.AI_SERVICE_URL;
  if (!base) return { provider: "none", state: "not_configured", label: "Manual report", confidence: null };
  try {
    const form = new FormData();
    const fs = await import("fs");
    const blob = new Blob([fs.readFileSync(imagePath)]);
    form.append("file", blob, "pothole.jpg");
    const response = await fetch(`${base}/detect`, { method: "POST", body: form });
    if (!response.ok) throw new Error("AI service returned an error");
    const data = await response.json();
    return { provider: "YOLO", state: "completed", label: data.detected ? "Pothole detected" : "No pothole detected", confidence: data.confidence ?? null };
  } catch (e) {
    console.warn("Detection unavailable:", e.message);
    return { provider: "YOLO", state: "unavailable", label: "Detection unavailable; manual review required", confidence: null };
  }
}
