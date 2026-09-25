<div align="center">

# 🕵️‍♂️ CYBERZERØ (CyberZero)

### _A Web based Simulation Game for Enchancing Cyber Threat Awareness and Knowledge_

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: Unlicense](https://img.shields.io/badge/License-Unlicense-blue.svg?style=for-the-badge)](https://unlicense.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen?style=for-the-badge)](#-tech-stack)
[![GitHub Pages Ready](https://img.shields.io/badge/GitHub_Pages-Ready-success?style=for-the-badge&logo=github)](https://pages.github.com/)

<p align="center">
  <strong>"Don't just guess that something is a cyber threat. Find the evidence."</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-the-story--defenders">Story & Defenders</a> •
  <a href="#-the-four-chapters">Chapters</a> •
  <a href="#-simulated-desktop-environment">Desktop OS</a> •
  <a href="#-scoring--ranking-system">Scoring System</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

</div>

---

## 📖 Overview

**CYBERZERØ** is an immersive, story-driven cybersecurity training game built entirely in **pure Vanilla HTML5, CSS3, and modern JavaScript**. Running directly in any web browser without frameworks, build tools, or backend servers, the game drops players into a fully functional **simulated cyber workstation OS**.

Rather than memorizing abstract rules or clicking through traditional multiple-choice quizzes, players step into the shoes of high school cyber defenders guided by **AI Mentor ZERO**. Players must actively investigate suspicious emails, inspect malicious file extensions, quarantine malware payloads, foil social engineering attacks, and execute incident response procedures during a live ransomware extortion crisis.

### 🎯 Key Highlights

- 🖥️ **Simulated Desktop Environment**: Window multitasking (drag, minimize, maximize, snap), live taskbar, notification center, system tray, real-time clock, and sound effects.
- 🔍 **Evidence-Based Investigation Engine**: Click and place flags directly on suspicious email elements, inspect hidden links, verify domain certificates, and inspect binary file extensions.
- 🤖 **Dynamic AI Mentor Feedback**: Detective ZERO analyzes every action, breaking down correct discoveries, explaining missed clues, and penalizing wild guesses.
- 📱 **Multi-Vector Threat Defense**: Covers the four primary pillars of modern cybersecurity: **Phishing**, **Malware**, **Social Engineering (Vishing/Smishing)**, and **Ransomware Incident Response**.
- ⚡ **Zero Installation & Setup**: 100% client-side. Double-click `index.html` or host effortlessly on GitHub Pages.

---

## 👥 The Story & Defenders

Four senior high school students collaborate on an important multimedia graduation project. As real-world threat actors target their accounts, devices, and shared network drives, they partner with **CyberZerØ**, an advanced cybersecurity AI agent, to defend their systems.

```
       ┌────────────────────────────────────────────────────────┐
       │                 🤖 CYBERZERØ (ZERO)                    │
       │           AI Cyber Guide & Detective Mentor            │
       └──────────────────────────┬─────────────────────────────┘
                                  │
    ┌──────────────┬──────────────┴──────────────┬──────────────┐
    ▼              ▼                             ▼              ▼
  📧 ACE        📁 NISHREN                   📱 PHILLIP     🚨 JONALD
Chapter 1:     Chapter 2:                   Chapter 3:     Chapter 4:
Phishing       Malware & Trojans            Social Eng.    Ransomware
Defender       Hunter                       Defender       Responder
```

| Defender    | Focus Area            | Mission Threat                                                                            |
| ----------- | --------------------- | ----------------------------------------------------------------------------------------- |
| **Ace**     | 📧 Phishing Detection | Defend school & banking accounts against urgent credential harvesting attacks.            |
| **Nishren** | 📁 Malware Analysis   | Neutralize disguised software payloads and Trojan droppers hiding in downloads.           |
| **Phillip** | 📱 Social Engineering | Expose impersonators, fraudulent SMS alerts (smishing), and urgent voice calls (vishing). |
| **Jonald**  | 🚨 Incident Response  | Respond to a `.locky` ransomware outbreak, isolate drives, and restore cloud backups.     |

---

## 🎮 The Four Chapters

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ CHAPTER 1: PHISHING INVESTIGATION (ACE)                                         │
│ Investigate 5 realistic emails. Flag fake sender domains, false urgency, and    │
│ mismatched hyperlinks. Conclude with Capybara/Zero's line-by-line verdict.     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CHAPTER 2: MALWARE HUNTING & EXTENSION DEFENSE (NISHREN)                        │
│ Open File Explorer & ShieldAV Anti-Virus. Spot double extensions (.pdf.exe),    │
│ analyze SHA-256 hashes, scan suspicious binaries, and quarantine threats.      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CHAPTER 3: SOCIAL ENGINEERING LAB (PHILLIP)                                     │
│ Access Phone Link. Filter out SMS smishing scams, identify urgent IT support    │
│ vishing calls, and protect one-time PINs (OTPs) and account credentials.       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CHAPTER 4: RANSOMWARE INCIDENT CONSOLE (JONALD)                                 │
│ A high-stakes emergency! Isolate infected storage nodes, terminate malicious   │
│ processes in Task Manager, and restore encrypted files from clean backups.     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1️⃣ Chapter 1: Phishing Investigation

- **Mission**: Examine 5 workplace and personal emails.
- **Mechanic**: Toggle **🚩 Flag Evidence** mode. Click directly on:
  - 📛 **Fake Sender Addresses** (e.g., `bpi.security.verification@gmail.com` using a free email provider instead of the bank's official domain).
  - ⏳ **False Urgency** (e.g., threatening permanent suspension within 30 minutes).
  - 🔗 **Mismatched Links** (e.g., button label says "Verify Account", but leads to an external spoofed domain).
- **Verification**: Switch to the **Browser** app to inspect suspicious landing pages without resetting your email progress.
- **Reporting**: Choose **Report as Phishing** or **Mark as Legitimate**.

### 2️⃣ Chapter 2: Malware Hunting

- **Mission**: Audit downloaded files in the **Folder** (File Explorer) app.
- **Mechanic**:
  - Expose double extensions (e.g., `bonus_payroll_sept.pdf.exe`).
  - Identify script droppers (`.vbs`) and rogue screensavers (`.scr`).
  - Send suspicious files to **ShieldAV Anti-Virus** for automated signature and heuristic scanning.
  - Quarantine verified malware threats while avoiding false positives on clean files.

### 3️⃣ Chapter 3: Social Engineering & Smishing

- **Mission**: Investigate mobile communications in the **Phone Link** app.
- **Mechanic**:
  - Analyze SMS messages (smishing) offering fake deliveries, prizes, or urgent security alerts.
  - Identify phone impersonation attempts (vishing) targeting student credentials.
  - Apply the **Zero-Trust Rule**: Never transmit OTPs or sensitive info over unverified channels.

### 4️⃣ Chapter 4: Ransomware Incident Response

- **Mission**: Combat a live crypto-ransomware outbreak threatening the team's project database.
- **Mechanic**:
  - **Network Isolation**: Cut infected storage volumes off from the local network to stop lateral spread.
  - **Process Neutralization**: Use the system console and Task Manager to locate and kill malicious dropper processes.
  - **Vault Restoration**: Verify SHA-256 backup integrity and restore encrypted volumes to 100% operational health without paying the extortion fee.

---

## 🖥️ Simulated Desktop Environment

CYBERZERØ features a comprehensive operating system interface built from scratch in CSS and JavaScript:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [📁 Folder]   [📧 Email]   [🌐 Browser]   [🛡️ ShieldAV]   [📱 Phone Link]│
│                                                                        │
│   ┌───────────────────────────┐     ┌────────────────────────────┐    │
│   │ 📧 Email (Gmail)    ─ □ ✕ │     │ 🛡️ ShieldAV Scanner  ─ □ ✕ │    │
│   ├───────────────────────────┤     ├────────────────────────────┤    │
│   │ Inbox (5)                 │     │ Real-Time Shield: ACTIVE   │    │
│   │ 🚩 Flags Placed: 3        │     │ Threat: Trojan.Dropper.EXE │    │
│   │ [ REPORT SUSPICIOUS ]     │     │ [ 🛡️ QUARANTINE PAYLOAD ]   │    │
│   └───────────────────────────┘     └────────────────────────────┘    │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ 🪟 Start  |  📧 Email   🌐 Browser   📁 Files   🛡️ AV   |  🔊 🌐  10:24 AM │
└────────────────────────────────────────────────────────────────────────┘
```

### Desktop Applications Suite

| App Icon | Application             | Role in Investigation                                                           |
| :------: | ----------------------- | ------------------------------------------------------------------------------- |
|    📧    | **Email Client**        | Inspect headers, read messages, flag suspicious evidence, and report phishing.  |
|    🌐    | **Cyber-Net Browser**   | Inspect destination URLs, search web intelligence, and check website security.  |
|    📁    | **File Explorer**       | Browse file paths, inspect actual file extensions, and check file properties.   |
|    🛡️    | **ShieldAV Anti-Virus** | Run on-demand file scans, review threat detections, and isolate infected files. |
|    📱    | **Phone Link**          | Review mobile SMS messages, incoming voice alerts, and smishing attacks.        |
|    📄    | **Document Viewer**     | Inspect internal company memos, syllabi, and text documentation.                |
|    🖼️    | **Image Viewer**        | Examine visual assets and screenshots for digital evidence.                     |
|    🎬    | **Video Player**        | Play in-game briefing videos and multimedia team updates.                       |
|    ⚙️    | **Wi-Fi & Network**     | Toggle network adapters to isolate endpoints during active network threats.     |
|    📒    | **Sticky Notes**        | Draggable, real-time cheat sheet explaining scoring mechanics and tips.         |

---

## 🏆 Scoring & Ranking System

CYBERZERØ utilizes a dual-source scoring calculation: points are awarded for **accurate verdicts** AND **evidence discovery**.

```
TOTAL EMAIL SCORE = Decision Points + Correct Evidence Points - Penalties
```

### Scoring Matrix

| Action                                 |  Points   | Description                                                       |
| -------------------------------------- | :-------: | ----------------------------------------------------------------- |
| **Phishing Verdict (Backed by Clues)** |  `+100`   | Correctly identified phishing with at least 1 valid flag placed.  |
| **Phishing Verdict (Blind Guess)**     |   `+0`    | Called phishing correctly, but found 0 actual evidence flags.     |
| **Legitimate Verdict**                 |   `+50`   | Correctly verified clean email (no flags required).               |
| **Correct Evidence Flag**              |   `+25`   | Pinned an actual phishing indicator (fake sender, urgency, etc.). |
| **Incorrect Verdict**                  |   `-50`   | Called a legitimate email phishing, or fell for a phishing scam.  |
| **Incorrect Evidence Flag**            |   `-10`   | Flagged safe or normal email text as suspicious.                  |
| **Missed Clue Penalty**                |   `-25`   | Overlooked a real phishing indicator present in the email.        |
| **Malware Neutralized**                |  `+100`   | Successfully identified and quarantined a malicious binary.       |
| **False Positive Quarantine**          |   `-25`   | Quarantined a safe, legitimate user file.                         |
| **Contradiction Rule**                 | `0 total` | Placing flags but submitting as "Legitimate" voids the report.    |

### Detective Ranks

| Rank Badge | Rank Title                        | Score Bracket | Rating Description                                                |
| :--------: | --------------------------------- | :-----------: | ----------------------------------------------------------------- |
|   **S**    | 🏅 **Master Cyber Detective**     | `95% – 100%`  | Flawless investigation. All clues spotted with zero false alarms. |
|   **A**    | ⭐ **Senior Cyber Investigator**  |  `85% – 94%`  | High-accuracy detection with minimal oversights.                  |
|   **B**    | 👍 **Cyber Defense Agent**        |  `70% – 84%`  | Solid performance; caught major threats but missed subtle signs.  |
|   **C**    | 📚 **Junior Analyst in Training** |  `50% – 69%`  | Inconsistent evidence gathering; needs additional review.         |
|   **D**    | ⚠️ **Investigation Compromised**  |    `< 50%`    | Critical threats missed or false alarms triggered.                |

---

## 🚀 Getting Started

Because CYBERZERØ is built entirely with standard web technologies, there are **no build steps, Node packages, or servers required**.

### Option A: Run Locally (Instant)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/CyberZero-Phishing.git
   cd CyberZero-Phishing
   ```

2. **Open the game**:
   - Simply double-click `index.html` in your file explorer, **OR**
   - Right-click `index.html` and choose **Open with > Chrome / Firefox / Edge / Safari**.

3. _(Optional)_ **Run via local development server**:

   ```bash
   # Using Python 3:
   python -m http.server 8080

   # Or using Node npx:
   npx serve .
   ```

   Navigate to `http://localhost:8080` in your web browser.

---

### Option B: Deploy to GitHub Pages (Free Hosting in 1 Minute)

1. Fork or push this repository to your GitHub account.
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**.
5. Your game will be live at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```

---

## 📁 Project Structure

```
CyberZero-Phishing/
│
├── index.html               # Main entry point & desktop OS DOM hierarchy
├── style.css                # Desktop OS styling, windows, animations & themes
├── script.js                # Core game engine, data models, state & chapter logic
├── LICENSE                  # Unlicense (Public Domain dedication)
├── README.md                # Project documentation & GitHub overview
│
└── assets/                  # Visual and audio assets
    ├── Cover.png            # Main menu & introduction background
    ├── 01Cover.png          # Story transition wallpaper
    ├── win10_wallpaper.jpg  # Desktop OS high-resolution wallpaper
    ├── CyberZerØ.png        # AI Mentor ZERO avatar
    ├── Ace.png / Ace1.png   # Ace character illustrations
    ├── Nishren.png          # Nishren character illustrations
    ├── Phillip.png          # Phillip character illustrations
    ├── Jonald.png           # Jonald character illustrations
    ├── icons/
    │   ├── apps/            # SVG icons for Mail, Browser, Folder, Anti-Virus, etc.
    │   └── folder icons/    # System explorer file type icons
    ├── sounds/              # Audio effects (clicks, alerts, success, victory cues)
    └── video/               # Cutscenes and interactive media briefings
```

---

## 🛡️ Educational Value & Safe Simulation Design

CYBERZERØ was developed to reinforce practical digital literacy and defensive cybersecurity habits:

- 🔒 **100% Safe & Offline-Ready**: All email addresses use RFC 2606 reserved domains (`.example`, `.test`, or simulated domains). No real banking portals or credentials are ever accessed.
- 🎯 **Critical Thinking Over Rote Memorization**: Teaches users _how_ attackers engineer urgency, spoof headers, and hide executable extensions inside routine office files.
- 🏢 **Applicable to Security Awareness Programs**: Ideal for high school classrooms, university labs, corporate phishing awareness training, and cybersecurity bootcamps.

---

## 🤝 Contributing

Contributions, feedback, and new chapter ideas are warmly welcome!

1. Fork the Project (`https://github.com/your-username/CyberZero-Phishing/fork`)
2. Create your Feature Branch (`git checkout -b feature/NewChapter`)
3. Commit your Changes (`git commit -m 'Add new social engineering scenario'`)
4. Push to the Branch (`git push origin feature/NewChapter`)
5. Open a Pull Request

---

## 📜 License

This project is released into the public domain under the **[The Unlicense](LICENSE)**. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software for educational or commercial purposes.

---

<div align="center">

**Developed with ❤️ for aspiring Cyber Detectives everywhere.**  
_Stay vigilant. Check the sender. Inspect the link. Trust the evidence._

</div>
