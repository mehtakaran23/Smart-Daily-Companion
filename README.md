# 🌤 Smart Daily Companion

A modern **AI-powered daily companion web app** that combines **live weather**, **daily tasks**, **local time**, and an **intelligent assistant** — all in one clean, installable Progressive Web App (PWA).

---

## ✨ Features

- 🌍 **Live Weather**
  - Search any city worldwide
  - Temperature, humidity, cloud cover, wind & rain
  - Smart weather insights (hot, cold, pleasant, rainy)

- ⏰ **Local Time & Greeting**
  - Real-time clock based on searched city
  - Auto day/night theme switching
  - Context-aware greetings

- 📝 **Daily Tasks**
  - Add & delete tasks
  - Persistent storage using `localStorage`
  - Clean, minimal task UI

- 🤖 **AI Assistant (Gemini API)**
  - Context-aware answers using:
    - Current weather
    - Time of day
    - Your tasks
    - City information
  - Answers adapt to your question (not rule-based)
  - Lightweight and fast responses

- 📱 **Progressive Web App (PWA)**
  - Installable on desktop & mobile
  - App-like fullscreen experience
  - Offline-ready shell
  - Custom app icons & theme

---

## 🛠 Tech Stack

- **HTML5**
- **CSS3** (custom + responsive design)
- **JavaScript (Vanilla JS)**
- **WeatherAPI** (live weather data)
- **Google Gemini API** (AI assistant)
- **Vercel** (deployment & hosting)
- **Service Workers** (PWA support)

---

## 🚀 Live Demo

👉 **Deployed App:**  
https://smart-daily-companion-git-main-mehtakaran23s-projects.vercel.app

---

## 📦 Installation (Local)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smart-daily-companion.git
Open the project folder:

cd smart-daily-companion
Open index.html in a browser
(or use Live Server extension)

🔐 API Configuration
This project uses client-side APIs.

Weather API
Uses weatherapi.com

API key is embedded for demo purposes

Gemini AI API
Add your API key inside index.html:

<script>
  window.CONFIG = {
    GEMINI_API_KEY: "YOUR_GEMINI_API_KEY"
  };
</script>
🔒 Security Note:
For frontend-only projects, API keys are visible in the browser.
This project uses HTTP referrer restrictions for safety.

📱 PWA Installation
Desktop: Click the install icon in the browser address bar

Mobile: “Add to Home Screen”

The app will run like a native application.

📂 Project Structure
smart-daily-companion/
│
├── index.html
├── style.css
├── script.js
├── manifest.json
├── sw.js
├── icon-192.png
├── icon-512.png
└── README.md
🎯 Project Purpose
This project was built as a learning + portfolio project to explore:

Frontend architecture

API integration

AI-powered UX

PWA deployment

Real-world debugging & deployment issues

🌱 Future Improvements
Push notifications & reminders

Offline weather caching

Calendar integration

Backend proxy for secure AI usage

Multi-assistant modes

👤 Author
Karan Mehta

If you like this project, ⭐ star the repo and feel free to fork it!