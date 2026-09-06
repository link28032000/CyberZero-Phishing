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
OPEN GMAIL  (Emails 1–3 are untimed)
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
⚡ AFTER EMAIL 3: CAPYBARA WARNS — 2-MIN CLOCK PER EMAIL FROM HERE
    ↓
EMAIL 4 (timed) → EMAIL 5 (timed)
    ↓
🏆 FINAL RESULTS
```

### Step-by-Step, in Plain English

1. **Welcome & briefing.** You land on the simulated desktop before the mission even starts — no clock, no pressure. Capybara Detective introduces itself and walks you through what a phishing email actually looks like: fake senders, false urgency, and mismatched links.
2. **Live demo.** Capybara personally investigates one phishing email and one legitimate email in front of you, placing flags and narrating exactly how many points each action is worth — so you know the stakes before you ever touch anything.
3. **"Your turn, Detective."** Gmail opens with 5 unread emails in the inbox. From here on, you're on your own.
4. **For each email:**
   - Open it from the inbox and read the sender, subject, and body carefully.
   - Turn on **🚩 Flag Evidence** mode, then click directly on anything you think is suspicious — the sender address, an urgent line, a button/link. Each click drops a flag into the Evidence panel; you can remove a flag if you change your mind.
   - If a link looks suspicious, you can open the **Browser** app to see exactly where it actually goes before deciding — switching between Gmail and Browser never resets your progress.
   - When you're confident, click **📋 Report Email** and choose **Report as Phishing** or **Mark as Legitimate**.
   - Capybara reviews your submission immediately: it confirms your verdict, praises correct flags, explains any incorrect flags, points out anything you missed, and shows a full line-by-line score breakdown for that email.
   - Click **Next Email** and repeat.
5. **Emails 1–3 are completely untimed** — investigate at your own pace.
6. **Right after Email 3's review**, Capybara warns you that the final two emails are timed. Each of Emails 4 and 5 gets its own 2-minute clock that only starts once you confirm you're ready.
7. **If a clock hits zero before you submit**, Capybara auto-submits whatever you currently have (see the Final Stretch section below) — it's scored exactly like a normal submission, so it's never a wasted email.
8. **After Email 5**, you reach the **Mission Complete** screen with your full stats, final score, and Detective Rank.

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

**Emails 1–3 are completely untimed.** Investigate at your own pace — no clock, no pressure. The HUD's TIME slot simply reads `UNTIMED`.

The real clock only appears for the **final two emails**. See the section below.

---

## ⚡ Final Stretch: Per-Email Hard Deadline (Emails 4 & 5)

Right after the player submits their report for **Email 3** and reviews Capybara's feedback, Capybara breaks in with a warning before Email 4 opens:

```
⚡ Two Left, Detective.
You've done well investigating without a clock — but I'm
turning up the heat for the final stretch.

Starting now, each of these last two emails gets its own
2-minute clock. The moment you confirm you're ready, it
starts counting down.

If that clock hits zero before you submit, I won't wait —
I'll go with whatever flags and decision you've got.
```

From that point on:

- The player confirms with **"I'm Ready →"**, which starts a **2-minute (02:00) countdown** for Email 4. The HUD's TIME slot relabels itself **"⚡ CLOCK"** and counts down.
- Email 5 restarts the same 2-minute clock automatically (with a quick toast reminder instead of the full briefing) the moment it begins.

| Time Remaining | State |
|----------------|-------|
| 02:00 – 00:46  | 🟢 NORMAL |
| 00:45 – 00:21  | 🟡 WARNING |
| 00:20 – 00:00  | 🔴 CRITICAL |

- **If the 2-minute clock reaches 00:00 before the player clicks "Report Email":** Capybara **auto-submits the report** using whatever the player currently has —
  - **Decision:** inferred as *Phishing* if the player has placed one or more evidence flags, or *Legitimate* if they've placed none.
  - **Flags:** whatever evidence flags are currently on the board are scored exactly as if the player had submitted them manually.
  - Scoring follows the normal rules, so an incomplete or wrong auto-submitted report still earns **partial credit** — it isn't a hard zero.
  - The Capybara review screen shows a **"⏰ TIME EXPIRED"** banner on any auto-submitted email so the player knows what happened.
- The final results screen shows a **"Final Stretch"** stat (e.g. `2 / 2 On Time`) reflecting how many of the last two emails were submitted before the clock ran out.

---

## 🚩 Flag-Based Investigation

This is the heart of the game. Activate **Flag Mode** and click suspicious parts of the email to place evidence flags.

### What to Flag

| Category | Example |
|----------|---------|
| `fake_sender` | `security@bpi-secure-login.xyz` |
| `false_urgency` | *"Your account will be suspended in 30 minutes"* |
| `suspicious_link` | Button says "Verify Account" → goes to `bpi-check.xyz` |
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

## 🔒 One Submission Per Email — But Investigate Freely

- **Submitting a report is final.** Once you click "Report Email" (or the final-stretch clock auto-submits for you), that email is locked — the Report and Flag Evidence buttons are disabled, and there's no way to resubmit or change the verdict.
- **You can still open and re-read any email** — the current one you're investigating, or any past one you've already reported — at any time from the inbox list.
  - Reopening your **current, still-in-progress** email resumes exactly where you left off: every flag you've placed is still there.
  - Reopening a **past, already-reported** email shows it in **read-only review mode**: your submitted flags are shown highlighted in the body and listed in the evidence panel, with a banner confirming what you reported and that the case is closed.
- **Closing or minimizing the Gmail or Browser app windows never loses progress.** Your flags, your current email, and your investigation state all live in memory regardless of which windows are open — close Gmail, reopen it, and you're right back where you were.

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
security@bpi-secure-login.xyz
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
Destination:  https://bpi-account-security.io/login
```

The visible text looks safe — the actual destination doesn't.

---

## 📬 Example Emails

<details>
<summary><strong>📧 BPI Phishing Email (Email #1)</strong></summary>

```
From:    BPI Security <security@bpi-secure-login.xyz>
Subject: URGENT: Your account will be locked today

Dear Customer,

We detected unusual activity on your account.

You must verify your account within 30 minutes
or your online banking access will be suspended.

[ Verify Your Account ]  →  https://bpi-account-security.io/login

Thank you,
BPI Security Team
```

**Expected Flags:** `fake_sender` · `false_urgency` · `suspicious_link`

</details>

<details>
<summary><strong>📧 PayPal Phishing Email (Email #3)</strong></summary>

```
From:    PayPal Security <security@paypa1-security.io>
Subject: URGENT: Your PayPal account will be suspended

Dear Customer,

We detected unusual activity on your PayPal account.

Your account will be permanently limited within
24 hours unless you verify your information.

[ Restore My Account ]  →  https://paypal-account-check.xyz/login

Thank you,
PayPal Security Team
```

**Expected Flags:** `fake_sender` · `false_urgency` · `suspicious_link`

</details>

<details>
<summary><strong>📧 Legitimate Email (Email #2)</strong></summary>

```
From:    HR Department <hr@company.com.ph>
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
→ security@bpi-secure-login.xyz
```

---

## 🏆 Scoring System, Explained

> Detective Zero explains this point-by-point during the demo — after the phishing case, and again after the legitimate case — so players know exactly what's at stake before the clock starts.

Every email you report earns (or loses) points from **two independent sources**, added together:

1. **Decision points** — for correctly calling the email Phishing or Legitimate.
2. **Evidence points** — for each flag you placed, scored individually as correct or incorrect.

### 1. Decision points

| Situation | Points |
|---|---:|
| Phishing email, you say **Phishing**, backed by ≥1 correct flag | **+100** |
| Phishing email, you say **Phishing**, but with **zero** correct flags (a lucky guess) | **+0** |
| Legitimate email, you say **Legitimate** | **+50** |
| Any email, wrong verdict | **−50** |

**Why phishing calls are worth more:** a correct "Phishing" verdict only pays out if it's backed by real evidence — you have to have actually found and flagged something true, not just guessed right. A "Legitimate" verdict doesn't require finding anything (there's nothing to flag), so it's worth half as much.

### 2. Evidence (flag) points

Every flag you place is checked against that email's real evidence list:

| Flag result | Points |
|---|---:|
| ✅ Correct flag (matches real evidence on a phishing email) | **+25** |
| ⚠️ Incorrect flag (wrong spot on a phishing email, or **any** flag on a legitimate email) | **−10** |

Real evidence you never flagged isn't penalized directly — it just shows up as **"Missed Evidence"** in Capybara's review, so you learn what to look for next time.

### 3. The contradiction rule: flags + "Legitimate" = 0 points

If you place one or more flags and then submit the email as **Legitimate**, the whole report scores a flat **0** — no decision points, no flag points, no penalties either way. Flagging something as suspicious and then clearing the email doesn't reflect a real verdict, so Capybara throws the report out rather than scoring it. The Report dialog always warns you about this up front whenever you have flags placed.

### Worked example — one phishing email

You investigate "BPI Security" (a phishing email with 3 real pieces of evidence: fake sender, false urgency, suspicious link), correctly flag all 3, and report it as Phishing:

| Line item | Points |
|---|---:|
| ✅ Correct flag — Fake Sender | +25 |
| ✅ Correct flag — False Urgency | +25 |
| ✅ Correct flag — Suspicious Link | +25 |
| ✓ Decision — Phishing correctly identified, backed by evidence | +100 |
| **TOTAL** | **+175** |

This is exactly what the Capybara review screen shows you — line by line — for every single email.

### Running total across the whole mission

The mission has 5 emails: 3 phishing (each worth up to **+175**: 100 decision + 75 for its 3 flags) and 2 legitimate (each worth up to **+50**, no flags needed). A perfect run adds up like this:

| Email | Type | Best possible score |
|---|---|---:|
| 1 | 🎣 Phishing | +175 |
| 2 | ✅ Legitimate | +50 |
| 3 | 🎣 Phishing | +175 |
| 4 | ✅ Legitimate | +50 |
| 5 | 🎣 Phishing | +175 |
| | **Maximum possible** | **625** |

Your running total is floored at **0 after every email** — a bad start can never dig you into a hole you can't climb out of for the rest of the mission (though a single email's own score can still display as negative in Capybara's review, before that floor is applied to your total).

### Detective Rank

At the end, your final score is measured as a percentage of the 625-point maximum:

| Rank | Label | Score % | Roughly (of 625) |
|------|-------|---------|---:|
| **S** | 🏅 Cyber Detective | 95 – 100% | 594 – 625 |
| **A** | ⭐ Excellent | 85 – 94% | 532 – 593 |
| **B** | 👍 Good | 70 – 84% | 438 – 531 |
| **C** | 📚 Needs Training | 50 – 69% | 313 – 437 |
| **D** | ❌ Investigation Failed | Below 50% | 0 – 312 |

### 🧮 Score Breakdown on Every Review

Every Capybara review screen shows the line-by-line breakdown above for that specific email — one line per flag placed (✅ correct / ⚠️ incorrect) plus the decision line, ending in a **TOTAL** row. Nothing about the math is hidden from the player.

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
║  Evidence Found:           8 / 9       ║
║                                        ║
║  Phishing Detected:        3           ║
║  Legitimate Identified:    2           ║
║                                        ║
║  Final Stretch:          2 / 2 On Time ║
║  FINAL SCORE:              600         ║
║  RANK:                     S           ║
║                                        ║
║        CYBER DETECTIVE!                ║
╚════════════════════════════════════════╝
```

(This example: two phishing emails with all 3 flags found (+175 each), one phishing email with 2 of 3 flags found (+100 decision + 50 flags = +150), and both legitimate emails correctly identified (+50 each) — 175+175+150+50+50 = **600 / 625**, a 96% score and an **S** rank.)

The "Play Again" button is now labeled **🔄 GET READY FOR THE NEXT CHAPTER**, and the results card scrolls internally on short screens instead of clipping its content.

---

## 🧱 Technical Reference

### Email Data Structure

```javascript
{
    id: 1,
    sender: {
        name: "BPI Security",
        address: "security@bpi-secure-login.xyz"
    },
    subject: "URGENT: Your account will be locked today",
    body: "...",
    links: [
        {
            text: "Verify Your Account",
            destination: "https://bpi-account-security.io/login",
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
    timeRemaining: 0,        // 0 until Email 4's 2-minute clock starts
    missionStarted: false,
    finalStretchWarned: false
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
10. Emails 1–3 are untimed; the clock only appears for Emails 4 & 5, and Capybara explains it beforehand

---

## 🛡️ Safety & Privacy

All content in CYBERZERO is **fictional and simulated**:

- Phishing sender addresses and fake link destinations use realistic-looking but entirely fictional domains (e.g. `.xyz`, `.io`) chosen to resemble real attacker registration patterns — none of them are real, currently-targeted phishing sites. Legitimate/internal sender addresses use `company.com.ph` — a generic, invented placeholder domain in the same fictional style, not tied to any real organization
- Every "link" in the game is rendered from a hardcoded lookup table inside `script.js` — the simulated Browser never makes a real network request to any domain, phishing or otherwise
- All websites are simulated — no real banking, PayPal, or financial sites
- No real credentials, login systems, or backend connections
- No data is collected or transmitted

---

<div align="center">

*Built with HTML · CSS · JavaScript*

**🕵️ Good luck, Detective.**

</div>
