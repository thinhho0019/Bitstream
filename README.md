<div align="center">
<p align="center">
  <h2>Bitstream</h2>
  <p align="center">
  <img src="https://img.shields.io/badge/Next.js-Framework-blue" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-green" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSql-Database-pink" alt="PostgreSql" />
  <img src="https://img.shields.io/badge/Redis-JobStore-red" alt="Redis" />
  <img src="https://img.shields.io/badge/RAG-Powered-yellow" alt="RAG" />
</p>
</p>
</div>BitStream is a real-time crypto analytics and alerting system that keeps users informed about Bitcoin market activity through automated email updates. The platform features:

📈 Live Bitcoin Index Monitoring: Continuously tracks key Bitcoin metrics such as price, volume, market trends, and technical indicators.

📧 Email Notifications: Sends timely updates and alerts to subscribed users when important thresholds are reached or anomalies are detected.

🤖 AI-Powered Crypto Chatbox: Users can interact with an intelligent chatbot to ask questions about cryptocurrencies, market trends, or trading strategies. The chatbox uses up-to-date financial data and machine learning to provide informed and relevant responses.

BitStream aims to empower traders, investors, and enthusiasts with fast, accurate, and personalized crypto intelligence—anytime, anywhere.
<hr/>

<h2>✨ Features</h2>

<ul>
  <li>
    <strong>🔐 Google Login & Email Verification:</strong>
    OAuth2 authentication with Google and secure email-based signup verification for new users.
  </li>
  <br/>
  <li>
    <strong>⏱️ Background Threshold Alerts with RedisJobStore:</strong>
    Uses RedisJobStore + APScheduler to periodically check whether Bitcoin price crosses a predefined threshold.
    Users are notified via email when important conditions are met.
  </li>
  <br/>
  <li>
    <strong>🧠 Automatic Real-Time Training:</strong>
    The system automatically fetches and trains on real-time data from Binance at scheduled intervals to improve the chatbot’s accuracy.
  </li>
  <br/>
  <li>
    <strong>💬 AI-Powered Chatbox (RAG + FAISS):</strong>
    The integrated chatbot uses Retrieval-Augmented Generation (RAG) and FAISS to retrieve and generate crypto-related responses.
    It ensures the conversation stays within allowed crypto-related topics.
  </li>
</ul>

<hr/>
<ul><h2>Scene Dashboard</h2></ul>
<img width="1892" height="892" alt="image" src="https://github.com/user-attachments/assets/4ada8a78-58d2-476a-97df-8a267136d454" />

<ul><h2>Scene ChatBox</h2></ul>
<img width="1677" height="894" alt="image" src="https://github.com/user-attachments/assets/e3896843-1fde-425a-b404-54f741381778" />

 
# 🛠️ Environment Variables Configuration

This project includes both a **Next.js frontend** and a **FastAPI backend**. The following environment variables are required for development and production setup.

---

## 🌐 Frontend (Next.js)

Create a `.env.local` file in the `frontend/` directory and add the following:

```env
# Base API URL to communicate with FastAPI backend
NEXT_PUBLIC_BASE_API_URL=http://127.0.0.1:8000/api

# Google OAuth2 credentials (used with NextAuth.js)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth configuration
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

```
## 🚀 Backend (FastApi)

Create a `.env` file in the `backend/` directory and add the following:

```
# PostgreSQL database URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dataops_db

# Google OAuth2 credentials for authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT security
ALGORITHM=HS256
SECRET_KEY=your-secret-key

# Email SMTP settings (for sending verification & alerts)
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Redis settings (used with APScheduler + JobStore)
HOST_REDIS=localhost
PORT_REDIS=6379
NUMBER_DB_REDIS=1

# Frontend dashboard redirect
DASHBOARD_URL=http://localhost:3000/dashboard

# Gemini API key (used in AI chatbot pipeline)
KEY_GEMINI=your-gemini-api-key

```
## 🚀 Farst Installer With Docker Compose

### Requiments:

- Docker + Docker Compose

### By step:

```bash
# 1. Clone project
git clone https://github.com/thinhho0019/bitstream.git
cd bitstream

# 2. Cmd compose docker
docker-compose up --build
