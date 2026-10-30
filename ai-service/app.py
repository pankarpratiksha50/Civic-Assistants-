import os
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from ultralytics import YOLO

app = FastAPI(title="Civic Assistants Pothole Detection API")
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "best.pt")
model = None

@app.on_event("startup")
def load_model():
    global model
    if Path(MODEL_PATH).exists():
        model = YOLO(MODEL_PATH)

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="YOLO model weights not configured. Set YOLO_MODEL_PATH.")
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Unsupported image type")
    content = await file.read()
    tmp = Path("/tmp/civic-upload")
    tmp.write_bytes(content)
    results = model(str(tmp), verbose=False)
    detections = []
    for result in results:
        for box in result.boxes:
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            detections.append({"class_id": cls, "label": model.names.get(cls, str(cls)), "confidence": conf})
    potholes = [d for d in detections if "pothole" in d["label"].lower() or "hole" in d["label"].lower()]
    best = max(potholes, key=lambda x: x["confidence"]) if potholes else None
    return {"detected": best is not None, "confidence": best["confidence"] if best else None, "detections": detections}
