# Civic Assistants — AI-Powered Smart Road Monitoring

A full-stack MVP for reporting potholes, capturing GPS coordinates, managing municipal complaints, and answering civic questions with RAG + an LLM.

## Stack
- Frontend: React + Vite + React Router + Leaflet
- Backend: Node.js + Express + MongoDB + Mongoose + JWT
- Image uploads: Multer (local `uploads/` folder for development)
- AI detection: optional Python FastAPI + Ultralytics YOLO service
- RAG/LLM: OpenAI embeddings + chat completions, with keyword retrieval fallback

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas
- Python 3.10+ (optional, for YOLO service)
- OpenAI API key (optional; needed for LLM-powered answers)

## 1. Configure backend
```bash
cd backend
copy .env.example .env
npm install
```
Edit `.env` and set `MONGO_URI`, `JWT_SECRET`, and optionally `OPENAI_API_KEY`.
For PowerShell, `copy` works; on macOS/Linux use `cp .env.example .env`.

## 2. Start backend
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

On first start, a municipal admin is created from:
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Change the default password in `.env` before using outside local development.

## 3. Start frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL, normally `http://localhost:5173`.

## 4. Optional YOLO pothole detector
The project includes an optional Python detection service. It expects a compatible YOLO weights file (for example, a pothole-trained `best.pt` file). No trained weights are included.

```bash
cd ai-service
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
```
Set `YOLO_MODEL_PATH` to your weights file, then:
```bash
uvicorn app:app --reload --port 8000
```
Set `AI_SERVICE_URL=http://localhost:8000` in backend `.env`.
If the service or weights are unavailable, reports can still be submitted; detection will be marked `not_configured` and the citizen can provide a manual report.

## How GPS works
The browser requests permission through `navigator.geolocation`. The camera itself does not normally provide location. On a phone, use HTTPS in production (or localhost during development), allow location permission, and capture/upload the image while the phone is at the reported location. GPS accuracy depends on device, signal, and environment.

## RAG knowledge base
Starter civic knowledge documents are in `backend/knowledge/`. The API retrieves relevant document chunks and uses the configured LLM to answer. Add your city's official road-repair, complaint, and emergency-contact documents there. The starter content is illustrative; replace it with verified local municipal information.

## Demo workflow
1. Register a citizen account.
2. Go to Report Pothole, allow camera and location permissions, take/upload a photo, and submit.
3. Open Map to view reports.
4. Log in using the admin credentials configured in `.env` to view the municipal dashboard and update statuses.
5. Open Civic AI and ask a question about reporting/road repair.

## Important production tasks
- Use cloud image storage (Cloudinary/S3), not local uploads.
- Restrict CORS, add rate limiting, request validation, audit logs, and HTTPS.
- Add duplicate-report detection and human review before dispatching road crews.
- Use a pothole-trained model and evaluate precision/recall on local road images.
- Configure MongoDB Atlas network access and secure credentials.
- GPS is a reported device location, not proof that the image was captured at that exact point.
