# 🚀 Social Setu — Social Media Content Scheduler
**_Sprint 3 Comprehensive Project — Semester 3 (ITM Skills University)_**

> “Automating content scheduling and analytics for small Indian businesses.”

---

## 🧩 Project Overview

**Social Setu** is a **Firebase-powered Social Media Content Scheduler** designed specifically for **small businesses and startups in India**.

The platform helps users:
- Schedule and manage posts across platforms (Instagram, Facebook, LinkedIn, etc.)
- Predict best posting times using intelligent algorithms
- Capture and manage leads in real-time
- Analyze engagement, CLV, RFM, and NPS metrics

---

## 🎯 Problem Statement

> Small Indian businesses struggle to maintain consistent social media presence due to limited time, cost, and access to smart scheduling tools.

### 💡 Solution:
Build an **affordable**, **data-driven**, and **AI-assisted** scheduler that:
- Uses Firebase for real-time data storage
- Applies Data Structures & Algorithms for intelligent scheduling
- Provides affordable subscription plans (₹299–₹1,999)
- Helps users automate, analyze, and grow their digital presence

---

## 🧠 Tech Stack

| Layer | Technology Used |
|--------|-----------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Firebase Firestore, Firebase Auth, Firebase Analytics |
| Database | Firestore (NoSQL) |
| DSA Module | Priority Queue, Binary Search Insert, Histogram Timing, Topological Sort, Hashing |
| AI Integration | Gemini API (Content Generation, Hashtags, Analysis) |
| Hosting | Firebase Hosting (planned) |

---

## 🗃️ Firestore Database Structure

**Collections Used:**

1. `leads`
   - `name`, `email`, `phone`, `source`, `hashedEmail`, `status`, `createdAt`

2. `posts`
   - `userId`, `content`, `platforms[]`, `scheduleTime`, `status`, `engagement`, `createdAt`

3. `feedback`
   - `postId`, `sentiment`, `npsRating`, `timestamp`, `derivedScores`

---

## ⚙️ Data Structures & Algorithms Used

| Algorithm | Purpose | Time Complexity | Why Used |
|------------|----------|-----------------|-----------|
| **Priority Queue (Min Heap)** | Manage next post to publish | O(log n) | Ensures correct scheduling order |
| **Binary Search Insert** | Insert posts efficiently | O(n) | Keeps schedule sorted |
| **Histogram Timing Algorithm** | Find best posting times | O(n) | Data-driven insights for Indian users |
| **Topological Sort** | Order dependent tasks | O(V + E) | Approval and workflow control |
| **Conflict Detection** | Avoid overlapping posts | O(n log n) | Ensures brand consistency |
| **Hashing** | Prevent duplicate leads | O(1) | Saves space, improves CAC efficiency |

---

## 💼 Business Model

| Plan | Price | Target | Key Features |
|------|--------|---------|---------------|
| **Starter** | ₹299/month | Individuals | 10 posts, 3 accounts, analytics dashboard |
| **Professional** | ₹799/month | Small Teams | 50 posts, AI timing, approvals, 10 accounts |
| **Business** | ₹1,999/month | Agencies | Unlimited posts, reporting, custom branding |

**Why it fits India:**
- Localized timings (IST)
- Affordable vs global competitors (Buffer, Hootsuite)
- Accepts UPI, wallets, and net banking

---

## 📊 Analytics Metrics

| Metric | Description |
|---------|-------------|
| **CLV (Customer Lifetime Value)** | Tracks average revenue per customer |
| **RFM Analysis** | Recency, Frequency, Monetary segmentation |
| **NPS (Net Promoter Score)** | Tracks user satisfaction and loyalty |
| **Engagement Score** | (likes × 1) + (comments × 3) + (shares × 5) + (clicks × 2) |

---



## ✨ Future Enhancements

Cloud Scheduler integration for auto-posting

### Team collaboration dashboards

Multi-language (Hindi + English) content AI

Payment integration with Razorpay/Stripe

Mobile app (React Native)

🧑‍💻 Author

👤 Ashutosh Pankaj Rai
🎓 ITM Skills University – Semester 3
📘 Project: Social Setu (Social Media Content Scheduler)
📧 Raia40094@gmail.com.com

 

📜 License

This project is developed as part of academic coursework and may be extended under an open-source license in future versions.

⭐ If you liked this project or want to collaborate, feel free to fork and improve it!


---

Would you like me to now make a **second version** of this `README.md` (simplified + more visual) — the one you’ll actually show **during viva on GitHub**?  
It will include emojis, badges, and short punchlines (while this one is the official detailed version).
