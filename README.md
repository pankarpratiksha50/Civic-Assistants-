# 🚧 Civic Assistants – AI-Powered Smart Road Pothole Detection & Reporting System

Civic Assistants is a smart city web application designed to help citizens report road potholes and help municipal authorities monitor and manage road damage efficiently. It uses GPS-based location tracking, AI-powered pothole detection, and an AI chatbot to improve road maintenance and public safety.

## 🌟 Features

### 👤 Citizen Module
- User Registration and Login
- Upload pothole images using a camera or file selection
- Capture GPS coordinates (Latitude and Longitude)
- Submit pothole reports
- View reported potholes on an interactive map
- Track complaint status

### 🤖 AI-Powered Features
- YOLO-based pothole detection from road images (optional model integration)
- AI-powered civic chatbot using RAG and LLM
- Retrieve relevant information from civic knowledge documents
- Optional OpenAI API integration for intelligent responses

### 🏢 Municipal Admin Dashboard
- View all submitted pothole reports
- Monitor total and pending complaints
- Update complaint status
- View pothole locations on the map
- Manage reported road damage

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| AI / Computer Vision | Python, FastAPI, YOLO |
| Generative AI | RAG, LLM, OpenAI API |
| Maps | Leaflet, OpenStreetMap |
| File Upload | Multer |
| API Communication | REST APIs |

## 🔄 How the System Works

1. A citizen captures or uploads a pothole image.
2. The application requests the user's GPS location.
3. The image is processed by the pothole detection service when configured.
4. The backend stores the report and its location in MongoDB.
5. Pothole reports are displayed on the interactive map.
6. Municipal authorities can monitor reports and update their status.
7. The RAG chatbot retrieves relevant civic information and can use an LLM to generate responses.

## 🚀 Future Enhancements

- Duplicate pothole report detection
- Pothole severity classification
- Area-wise pothole analytics
- Automatic complaint prioritization using Machine Learning
- Multilingual chatbot (English, Hindi, Marathi)
- Real-time notifications
- Cloud image storage using Cloudinary
- Mobile-responsive user interface

## 🎯 Project Objective

The main objective of Civic Assistants is to connect citizens and municipal authorities through an AI-powered platform that makes pothole reporting, location tracking, and road maintenance management easier and more efficient.

👩‍💻 Developed By

**Pratiksha Pankar**

GitHub: https://github.com/YOUR_USERNAME

---

⭐ If you find this project useful, consider giving it a star!
