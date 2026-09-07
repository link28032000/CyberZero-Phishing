<div align="center">

# 🕵️ CYBERZERO

### *A Cybersecurity Detective Simulation Game*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Backend](https://img.shields.io/badge/No%20Backend-Required-success?style=for-the-badge)

> **Don't just guess that an email is phishing. Find the evidence.**

</div>

---

## 📖 Overview

**CYBERZERO** is an interactive cybersecurity simulation game built with pure HTML, CSS, and JavaScript — no backend required.

You play as a **newly hired Cyber Detective**. Your mission: investigate suspicious emails inside a simulated Windows desktop, identify phishing attacks, and flag the evidence before reporting your findings to the Capybara Detective.

### Core Gameplay Loop

```
READ → INVESTIGATE → 🚩 FLAG → REPORT → 🕵️ CAPYBARA REVIEWS → LEARN
```

The game rewards **evidence-based investigation**, not guessing. You must find and flag the specific suspicious parts of each email — fake senders, false urgency, and mismatched links — before submitting your decision.

---

## 🖥️ Simulated Desktop

The entire game takes place inside a **simulated Windows desktop**. It does not look or feel like a normal webpage.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    CYBERZERO DESKTOP                         │
│                                                              │
│         📧                              🌐                   │
│        Gmail                          Browser                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  🪟 Start     📧 Gmail     🌐 Browser          🔊  🌐  09:42 │
└──────────────────────────────────────────────────────────────┘
```

The desktop contains **exactly two applications**:

| App | Purpose |
|-----|---------|
| 📧 **Gmail** | Investigate emails, place flags, report phishing |
| 🌐 **Browser** | Inspect suspicious links in simulated websites |

> No File Explorer, Settings, Calculator, Command Prompt, or other apps.

---

## 🚀 Getting Started

Open the game by launching:

```
index.html
```

No installation. No server. No dependencies.

---

## 📁 Project Structure

```
CYBERZERO/
│
├── index.html      ← Entry point
├── style.css       ← All styles & desktop UI
├── script.js       ← Game logic & data
└── README.md
```

---

## 🎮 Full Gameplay Flow

```
START GAME
    ↓
WINDOWS DESKTOP
    ↓
WELCOME SCREEN           ← Timer NOT running yet
    ↓
🕵️ CAPYBARA INTRODUCTION
    ↓
PHISHING GUIDE
    ↓
CAPYBARA DEMONSTRATION   ← Live example walkthrough
    ↓
"YOUR TURN, DETECTIVE"
    ↓
⏱ START 4-MINUTE TIMER
    ↓
OPEN GMAIL
    ↓
READ EMAIL → 🚩 FLAG EVIDENCE → INSPECT SENDER / URGENCY / LINKS
    ↓
OPEN BROWSER (if needed to investigate a link)
    ↓
RETURN TO GMAIL → REPORT EMAIL
    ↓
🕵️ CAPYBARA EXAMINES SUBMISSION
    ↓
EXPLAIN CORRECT / MISSED FLAGS → AWARD SCORE
    ↓
NEXT EMAIL  (×5 total)
    ↓
🏆 FINAL RESULTS
```

---

## 🖼️ Application Windows

Each app behaves like a native Windows window:

```
┌──────────────────────────────────────────────┐
│ Gmail                              ─  □  X   │
├──────────────────────────────────────────────┤
│                                              │
│   [ Inbox ]                                  │
│   ─────────────────────────────────────      │
│   📧 BPI Security    URGENT: Your account…   │
│   📧 HR Department   September Benefits…     │
│                                              │
└──────────────────────────────────────────────┘
```

Supported window actions: **Open · Close · Minimize · Maximize · Restore · Switch · Focus**

The Gmail investigation **never resets** when switching to Browser and back.

---

## ⏱️ Investigation Timer

The 4-minute countdown starts **only** when the real investigation begins.

```
┌───────────────────────┐
│ EMAIL 2 / 5           │
│ SCORE: 175            │
│ TIME: 03:21           │
└───────────────────────┘
```

| Time Remaining | State |
|----------------|-------|
| 04:00 – 01:01  | 🟢 NORMAL |
| 01:00 – 00:31  | 🟡 WARNING |
| 00:30 – 00:01  | 🔴 CRITICAL |
| 00:00          | ⛔ TIME UP |

The timer does **not** run during the welcome screen, training, guide, or demonstration.

---

## 🚩 Flag-Based Investigation

This is the heart of the game. Activate **Flag Mode** and click suspicious parts of the email to place evidence flags.

### What to Flag

| Category | Example |
|----------|---------|
| `fake_sender` | `security@bpi-secure-login.example` |
| `false_urgency` | *"Your account will be suspended in 30 minutes"* |
| `suspicious_link` | Button says "Verify Account" → goes to `bpi-check.example` |
| `suspicious_attachment` | Unexpected `.zip` or `.exe` attached |
| `credential_request` | *"Enter your PIN to confirm"* |
| `suspicious_wording` | Unusual phrasing or grammatical errors |

### Evidence Panel

```
┌─────────────────────────────────────┐
│ INVESTIGATION EVIDENCE              │
├─────────────────────────────────────┤
│ 🚩 Suspicious sender                │
│ 🚩 False urgency                    │
│ 🚩 Suspicious link                  │
│                                     │
│ FLAGS: 3          [ REMOVE FLAG ]   │
└─────────────────────────────────────┘
```

Players can remove a flag if it was placed incorrectly.

---

## 📧 The Five-Email Mission

| # | Type | Evidence to Find |
|---|------|-----------------|
| 1 | 🎣 Phishing | Fake sender + urgency + suspicious link |
| 2 | ✅ Legitimate | Normal company email — don't flag it |
| 3 | 🎣 Phishing | Fake sender + password threat + suspicious link |
| 4 | ✅ Legitimate | Normal internal email — don't flag it |
| 5 | 🎣 Phishing | Fake sender + reward scam + suspicious link |

---

## 💡 Phishing Indicators Guide

The Capybara Detective teaches you the three key red flags:

### 🔴 Fake Sender Address

```
security@bpi-secure-login.example
```

The domain looks related to the bank, but it's not the real one.

### 🔴 False Urgency

```
URGENT! Your account will be permanently locked
within 30 minutes unless you verify it.
```

Attackers pressure victims into acting fast, without thinking.

### 🔴 Mismatched Link

```
Button text:  "Verify Your Account"
Destination:  https://bpi-account-security.example/login
```

The visible text looks safe — the actual destination doesn't.

---

## 📬 Example Emails

<details>
<summary><strong>📧 BPI Phishing Email (Email #1)</strong></summary>

```
From:    BPI Security <security@bpi-secure-login.example>
Subject: URGENT: Your account will be locked today

Dear Customer,

We detected unusual activity on your account.

You must verify your account within 30 minutes
or your online banking access will be suspended.

[ Verify Your Account ]  →  https://bpi-account-security.example/login

Thank you,
BPI Security Team
```

**Expected Flags:** `fake_sender` · `false_urgency` · `suspicious_link`

</details>

<details>
<summary><strong>📧 PayPal Phishing Email (Email #3)</strong></summary>

```
From:    PayPal Security <security@paypa1-security.example>
Subject: URGENT: Your PayPal account will be suspended

Dear Customer,

We detected unusual activity on your PayPal account.

Your account will be permanently limited within
24 hours unless you verify your information.

[ Restore My Account ]  →  https://paypal-account-check.example/login

Thank you,
PayPal Security Team
```

**Expected Flags:** `fake_sender` · `false_urgency` · `suspicious_link`

</details>

<details>
<summary><strong>📧 Legitimate Email (Email #2)</strong></summary>

```
From:    HR Department <hr@company.example>
Subject: September Employee Benefits Update

Dear Employee,

The September employee benefits information is now available.

Please review the information through the company's
normal internal resources.

Thank you,
HR Department
```

**Expected Action:** ✅ Mark as Legitimate — no flags needed.

</details>

---

## 🕵️ Capybara Review System

After every email submission, the Capybara Detective reviews your investigation:

```
╔════════════════════════════════════════════╗
║       🕵️ CAPYBARA DETECTIVE               ║
║           INVESTIGATION COMPLETE           ║
╠════════════════════════════════════════════╣
║  ✓ PHISHING CONFIRMED                      ║
║                                            ║
║  🚩 SENDER — CORRECT                       ║
║  The sender uses a suspicious domain and   ║
║  does not represent the legitimate bank.   ║
║                                            ║
║  🚩 URGENCY — CORRECT                      ║
║  The email threatens account suspension    ║
║  within a short deadline to force action.  ║
║                                            ║
║  🚩 LINK — CORRECT                         ║
║  The button destination uses an unrelated  ║
║  suspicious domain.                        ║
║                                            ║
║              SCORE: +175                   ║
║              [ NEXT EMAIL ]                ║
╚════════════════════════════════════════════╝
```

The Capybara also explains **wrong flags** and **missed evidence**:

```
⚠ INCORRECT FLAG
"Dear Customer" is not enough evidence to identify phishing.
Look for: suspicious senders · false urgency · suspicious links

🚩 MISSED EVIDENCE
You did not flag the suspicious sender.
→ security@bpi-secure-login.example
```

---

## 🏆 Scoring System

| Action | Points |
|--------|-------:|
| Correct phishing decision | +100 |
| Correct legitimate decision | +100 |
| Correct evidence flag | +25 |
| Incorrect decision | −50 |
| Incorrect evidence flag | −10 |

**Example:** Correct decision + 3 correct flags = **+175 points**

### Detective Ranks

| Rank | Label | Score % |
|------|-------|---------|
| **S** | 🏅 Cyber Detective | 95 – 100% |
| **A** | ⭐ Excellent | 85 – 94% |
| **B** | 👍 Good | 70 – 84% |
| **C** | 📚 Needs Training | 50 – 69% |
| **D** | ❌ Investigation Failed | Below 50% |

---

## 📊 Final Results Screen

```
╔════════════════════════════════════════╗
║             MISSION COMPLETE           ║
╠════════════════════════════════════════╣
║  Emails Investigated:      5 / 5       ║
║  Correct Decisions:        5 / 5       ║
║  Evidence Found:          11 / 12      ║
║                                        ║
║  Phishing Detected:        3           ║
║  Legitimate Identified:    2           ║
║                                        ║
║  Time Remaining:          01:24        ║
║  FINAL SCORE:              725         ║
║  RANK:                     A           ║
║                                        ║
║        EXCELLENT DETECTIVE!            ║
╚════════════════════════════════════════╝
```

---

## 🧱 Technical Reference

### Email Data Structure

```javascript
{
    id: 1,
    sender: {
        name: "BPI Security",
        address: "security@bpi-secure-login.example"
    },
    subject: "URGENT: Your account will be locked today",
    body: "...",
    links: [
        {
            text: "Verify Your Account",
            destination: "https://bpi-account-security.example/login",
            suspicious: true
        }
    ],
    phishing: true,
    evidence: ["fake_sender", "false_urgency", "suspicious_link"]
}
```

### Game State

```javascript
const gameState = {
    currentEmail: 0,
    totalEmails: 5,
    score: 0,
    correctDecisions: 0,
    phishingDetected: 0,
    legitimateDetected: 0,
    flagsPlaced: [],
    timeRemaining: 240,
    missionStarted: false
};
```

### Application State

```javascript
const apps = {
    gmail:   { open: false, minimized: false, maximized: false },
    browser: { open: false, minimized: false, maximized: false }
};
```

### Key Functions

```javascript
// Window management
openApp()  closeApp()  minimizeApp()  maximizeApp()  restoreApp()

// Game flow
startGame()  startTraining()  startMission()

// Timer
startTimer()  stopTimer()  updateTimer()

// Email investigation
openEmail()  inspectEmail()  inspectLink()  openSuspiciousSite()

// Flagging
activateFlagMode()  placeFlag()  removeFlag()

// Reporting
reportEmail()  submitReport()  markLegitimate()

// Scoring & results
checkEvidence()  calculateScore()  showCapybaraResult()
nextEmail()  finishMission()  showFinalResults()  playAgain()
```

---

## 📐 Design Principles

### The Only Rule That Matters

> **CYBERZERO is not a phishing quiz.**
> It is an interactive **cybersecurity detective investigation simulation.**
> The player must *find the evidence* — not just guess.

### Gameplay Rules

1. Players cannot immediately know the answer — they must investigate
2. Flags must be placed directly on suspicious evidence
3. A final decision (Phishing / Legitimate) must be submitted
4. The Capybara reviews every flag placed
5. The Capybara explains why each flag was correct or incorrect
6. Points are awarded based on investigation quality
7. Players cannot spam "Report as Phishing" — wrong flags cost points
8. Some emails are always legitimate
9. The Browser app is available to inspect suspicious link destinations
10. The timer only starts when the real investigation begins

---

## 🛡️ Safety & Privacy

All content in CYBERZERO is **fictional and simulated**:

- All email addresses use `.example` domains (per RFC 2606)
- All websites are simulated — no real banking, PayPal, or financial sites
- No real credentials, login systems, or backend connections
- No data is collected or transmitted

---

<div align="center">

*Built with HTML · CSS · JavaScript*

**🕵️ Good luck, Detective.**

</div>
