
# 📚 Offline Lecture Tracker Web App

A personal web application built using **React** (frontend) and **Python** (backend) to organize and play **locally stored lecture videos** with progress tracking.

## 🔹 Overview

This project is an offline version of my lecture tracking system. Instead of using online lecture links, this application reads locally stored video files and organizes them course-wise. It allows watching videos from a single interface while tracking lecture and course completion.

## ✨ Features

- Structured course and video management  
- Supports locally stored lecture videos  
- Lecture and course progress tracking  
- Clean and interactive UI  
- Easy to add new courses and videos  
- Auto-start backend and frontend using `.bat` file  

## 🗂️ Project Structure

```
project-root/
│
├── frontend/              
├── backend/              
│   └── courses/
│       ├── Course_1/
│       │   ├── video1.mp4
│       │   ├── video2.mp4
│       ├── Course_2/
│       │   ├── video1.mp4
│
├── start.bat             
└── README.md
```

## ▶️ How to Add Videos

1. Go to `backend/courses/`
2. Create a new course folder
3. Place video files inside the folder
4. Restart the application

## ▶️ How to Run

### Auto Start (Recommended)

```
start.bat
```

This batch file automatically starts both the backend server and the React frontend.

## 🛠 Tech Stack

- Frontend: React, HTML, CSS, JavaScript  
- Backend: Python  
- Video Playback: Local video streaming  

## ⚠️ Disclaimer

This project is built strictly for **personal educational use**.


---


