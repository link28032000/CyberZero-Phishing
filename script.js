/* ═══════════════════════════════════════════════════════════
   CYBERZERO — script.js
   Full game engine: state, data, systems, UI
═══════════════════════════════════════════════════════════ */

'use strict';

// ═══════════════════════════════════════════════════════════
// GAME DATA
// ═══════════════════════════════════════════════════════════

const EMAILS = [
  {
    id: 1,
    sender: { name: 'BPI Security', address: 'security@bpi-secure-login.xyz' },
    subject: 'URGENT: Your BPI account will be locked today',
    time: '8:04 AM',
    preview: 'We detected unusual activity on your account...',
    phishing: true,
    evidence: ['fake_sender', 'false_urgency', 'suspicious_link'],
    body: [
      { type: 'p', text: 'Dear Customer,' },
      { type: 'p', text: 'We detected unusual activity on your BPI online banking account. To protect your account, access has been temporarily restricted.' },
      {
        type: 'p-flag',
        flagId: 'urgency',
        flagType: 'false_urgency',
        text: 'You must verify your account within 30 minutes or your online banking access will be permanently suspended.',
        label: 'FALSE URGENCY'
      },
      { type: 'p', text: 'Please click the button below to verify your identity and restore full account access.' },
      {
        type: 'link',
        flagId: 'link1',
        flagType: 'suspicious_link',
        text: 'Verify My BPI Account',
        destination: 'https://bpi-account-security.io/login',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Thank you for banking with BPI.' },
      { type: 'p', text: 'Regards,\nBPI Security Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nThe domain <code>bpi-secure-login.xyz</code> is not a legitimate BPI domain. Real BPI emails come from <code>@bpi.com.ph</code>. Attackers register similar-sounding domains to trick victims.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender address was <code>security@bpi-secure-login.xyz</code>. This is not a real BPI domain. Always check the actual email address, not just the display name.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nThe "30 minutes" deadline is a classic social engineering pressure tactic. Attackers create panic to prevent careful thinking.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe email threatened account suspension within 30 minutes. This extreme time pressure is a hallmark of phishing — it forces the victim to act without thinking.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe button links to <code>bpi-account-security.io</code>, not BPI\'s real website. The domain sounds official but is completely unrelated to BPI.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Verify" button leads to <code>bpi-account-security.io</code>. Always hover over or inspect links before clicking — the destination reveals the deception.'
      }
    }
  },
  {
    id: 2,
    sender: { name: 'HR Department', address: 'hr@company.com.ph' },
    subject: 'September Employee Benefits Update',
    time: '9:15 AM',
    preview: 'The September employee benefits information is now available...',
    phishing: false,
    evidence: [],
    body: [
      { type: 'p', text: 'Dear Employee,' },
      { type: 'p', text: 'We hope you are doing well. The September employee benefits information is now available for your review.' },
      { type: 'p', text: 'This month\'s update includes details about the health plan renewal, updated leave policies, and the company wellness program.' },
      { type: 'p', text: 'Please review the information through the company\'s normal internal HR portal, accessible through your standard work credentials.' },
      { type: 'p', text: 'If you have any questions, feel free to reach out to the HR team directly at hr@company.com.ph.' },
      { type: 'p', text: 'Thank you,\nHR Department\nCompany Inc.' }
    ],
    capybaraAnalysis: {}
  },
  {
    id: 3,
    sender: { name: 'PayPal Security', address: 'security@paypa1-security.io' },
    subject: 'URGENT: Your PayPal account will be suspended',
    time: '10:22 AM',
    preview: 'We detected unusual activity on your PayPal account...',
    phishing: true,
    evidence: ['fake_sender', 'false_urgency', 'suspicious_link'],
    body: [
      { type: 'p', text: 'Dear Customer,' },
      { type: 'p', text: 'We detected unusual activity on your PayPal account. For your security, certain features have been restricted.' },
      {
        type: 'p-flag',
        flagId: 'urgency',
        flagType: 'false_urgency',
        text: 'Your account will be permanently limited within 24 hours unless you verify your identity and confirm your billing information.',
        label: 'FALSE URGENCY'
      },
      { type: 'p', text: 'Failure to complete verification will result in permanent account closure and loss of any pending balance.' },
      {
        type: 'link',
        flagId: 'link1',
        flagType: 'suspicious_link',
        text: 'Restore My Account',
        destination: 'https://paypal-account-check.xyz/login',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Thank you for using PayPal.' },
      { type: 'p', text: 'Regards,\nPayPal Security Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nNotice the domain: <code>paypa1-security.io</code> uses the number "1" instead of the letter "l" in "PayPal". This is called a typosquat domain — a common attacker trick.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender was <code>security@paypa1-security.io</code>. Look closely — "paypa<strong>1</strong>" uses the digit 1, not the letter l. This subtle swap is a typosquat phishing technique.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nThe "24 hours" deadline and threat of permanent closure is engineered to create panic. Legitimate companies give adequate time and never threaten instant loss.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe email threatened permanent account closure within 24 hours. This is a pressure tactic to prevent you from verifying the email\'s legitimacy before acting.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe link destination <code>paypal-account-check.xyz</code> is not owned by PayPal. The real PayPal uses <code>paypal.com</code>.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Restore My Account" button leads to <code>paypal-account-check.xyz</code>. Always check actual link destinations — not the button label text.'
      }
    }
  },
  {
    id: 4,
    sender: { name: 'IT Department', address: 'it@company.com.ph' },
    subject: 'Scheduled System Maintenance — Sunday 11 PM',
    time: '11:05 AM',
    preview: 'Please be advised of scheduled maintenance this Sunday...',
    phishing: false,
    evidence: [],
    body: [
      { type: 'p', text: 'Dear Team,' },
      { type: 'p', text: 'Please be advised that the IT Department will be conducting scheduled system maintenance this Sunday, September 8, from 11:00 PM to 2:00 AM.' },
      { type: 'p', text: 'During this window, the following services will be temporarily unavailable:' },
      { type: 'p', text: '• Employee portal\n• Internal file sharing\n• Company email (intermittent)' },
      { type: 'p', text: 'No action is required from your side. Your data is safe and no credentials need to be updated.' },
      { type: 'p', text: 'We apologize for any inconvenience. For urgent matters during the maintenance window, please contact the on-call IT team at it-oncall@company.com.ph.' },
      { type: 'p', text: 'Thank you for your understanding.\nIT Department' }
    ],
    capybaraAnalysis: {}
  },
  {
    id: 5,
    sender: { name: 'GCash Rewards', address: 'noreply@gcash-rewards.xyz' },
    subject: '🎉 Congratulations! You\'ve won a GCash reward!',
    time: '12:33 PM',
    preview: 'You have been selected as a special GCash customer reward winner...',
    phishing: true,
    evidence: ['fake_sender', 'false_urgency', 'suspicious_link'],
    body: [
      { type: 'p', text: 'Dear Valued GCash Customer,' },
      { type: 'p', text: '🎉 Congratulations! You have been randomly selected as this month\'s special GCash loyalty reward winner!' },
      { type: 'p', text: 'Your prize: ₱5,000 GCash credits, ready to be claimed to your registered GCash wallet.' },
      {
        type: 'p-flag',
        flagId: 'urgency',
        flagType: 'false_urgency',
        text: 'IMPORTANT: This reward will expire in 2 hours. You must claim it immediately or it will be forfeited and transferred to another user.',
        label: 'FALSE URGENCY'
      },
      { type: 'p', text: 'To claim your reward, simply verify your GCash account by clicking the button below.' },
      {
        type: 'link',
        flagId: 'link1',
        flagType: 'suspicious_link',
        text: 'Claim My ₱5,000 Reward',
        destination: 'https://gcash-claim-rewards.io/verify',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Do not share this link. It is unique to your account.' },
      { type: 'p', text: 'Regards,\nGCash Rewards Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nThe domain <code>gcash-rewards.xyz</code> is not GCash\'s official domain. GCash communications come from <code>@gcash.com</code>. Reward scams always use unofficial domains.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender domain was <code>gcash-rewards.xyz</code>. This is not an official GCash domain. Reward scams often create plausible-looking domains to fool recipients.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nA "2-hour expiry" on a supposed reward is a classic scam pressure tactic. Legitimate rewards do not expire within hours and do not threaten immediate forfeiture.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe 2-hour countdown before the reward "expires" is a pressure tactic. Scammers use short deadlines to stop you from pausing and thinking critically.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe claim link goes to <code>gcash-claim-rewards.io</code> — not GCash\'s real website. This is a fake site designed to steal your login credentials.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Claim My Reward" button leads to <code>gcash-claim-rewards.io</code>. The real GCash website is <code>gcash.com</code>. Always verify destinations before clicking.'
      }
    }
  }
];

// Fake websites for the browser
const FAKE_SITES = {
  'https://bpi-account-security.io/login': `
    <div class="fakesite">
      <div class="fakesite-header">
        <div class="fakesite-logo">BPI Online</div>
        <small style="font-size:12px;opacity:0.8">Online Banking</small>
      </div>
      <div class="fakesite-body">
        <div class="fakesite-warn">This is a simulated phishing page. Do NOT enter real credentials on suspicious websites.</div>
        <h2>Sign In to Your Account</h2>
        <p>Enter your online banking credentials to verify your account.</p>
        <div class="fakesite-field"><label>Username / Card Number</label><input type="text" placeholder="Enter username" /></div>
        <div class="fakesite-field"><label>Password</label><input type="password" placeholder="Enter password" /></div>
        <button class="fakesite-submit" onclick="alert('🚩 This is a phishing page! Real credentials would be stolen here.')">Log In</button>
        <p style="font-size:11px;color:#888;margin-top:16px;text-align:center;">bpi-account-security.io — NOT the real BPI website</p>
      </div>
    </div>`,
  'https://paypal-account-check.xyz/login': `
    <div class="fakesite">
      <div class="fakesite-header" style="background:linear-gradient(90deg,#003087,#009cde);">
        <div class="fakesite-logo">PayPal</div>
        <small style="font-size:12px;opacity:0.8">Account Recovery</small>
      </div>
      <div class="fakesite-body">
        <div class="fakesite-warn">This is a simulated phishing page. Do NOT enter real credentials on suspicious websites.</div>
        <h2>Account Verification Required</h2>
        <p>Your account has been flagged. Please log in to restore access.</p>
        <div class="fakesite-field"><label>Email or Phone</label><input type="text" placeholder="Enter email or phone" /></div>
        <div class="fakesite-field"><label>Password</label><input type="password" placeholder="Enter password" /></div>
        <button class="fakesite-submit" style="background:linear-gradient(90deg,#003087,#009cde);" onclick="alert('🚩 This is a phishing page! Real credentials would be stolen here.')">Log In</button>
        <p style="font-size:11px;color:#888;margin-top:16px;text-align:center;">paypal-account-check.xyz — NOT the real PayPal website</p>
      </div>
    </div>`,
  'https://gcash-claim-rewards.io/verify': `
    <div class="fakesite">
      <div class="fakesite-header" style="background:linear-gradient(90deg,#0f5d2e,#17a34a);">
        <div class="fakesite-logo">GCash</div>
        <small style="font-size:12px;opacity:0.8">Rewards Portal</small>
      </div>
      <div class="fakesite-body">
        <div class="fakesite-warn">This is a simulated phishing page. Do NOT enter real credentials on suspicious websites.</div>
        <h2>🎉 Claim Your ₱5,000 Reward</h2>
        <p>Verify your GCash account to receive your reward instantly.</p>
        <div class="fakesite-field"><label>GCash Mobile Number</label><input type="text" placeholder="+63 9XX XXX XXXX" /></div>
        <div class="fakesite-field"><label>MPIN</label><input type="password" placeholder="Enter your 4-digit MPIN" /></div>
        <button class="fakesite-submit" style="background:linear-gradient(90deg,#0f5d2e,#17a34a);" onclick="alert('🚩 This is a phishing page! Real credentials would be stolen here.')">Claim Reward</button>
        <p style="font-size:11px;color:#888;margin-top:16px;text-align:center;">gcash-claim-rewards.io — NOT the real GCash website</p>
      </div>
    </div>`
};

// Training slides content — only the demo-ready slide remains (others moved to VN intro)
const TRAINING_SLIDES = [
  {
    title: 'Ready for the Demo? 🎬',
    content: `<p>Before your mission begins, I'll walk you through a real example.</p>
    <p style="margin-top:12px;">I'll show you exactly how to spot all three red flags in a phishing email — and how a legitimate email clears itself.</p>
    <p style="margin-top:20px;font-size:13px;color:#90caf9;">⏱ No pressure here — this demo and your first 3 real emails are untimed. The clock only shows up for the final 2 emails, and I'll warn you before it starts.</p>`
  }
];

// ═══════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════

const gameState = {
  phase: 'welcome',         // welcome | training | demo | mission | results
  currentEmail: 0,          // index into EMAILS
  score: 0,
  correctDecisions: 0,
  phishingDetected: 0,
  legitimateDetected: 0,
  evidenceFoundTotal: 0,
  // Emails 1–3 are untimed. This only counts down during the final-stretch
  // per-email deadline (Emails 4 & 5) — see FINAL_STRETCH_EMAIL_INDICES.
  timeRemaining: 0,
  missionStarted: false,
  timerInterval: null,
  trainingSlide: 0,
  demoStep: 0,
  flagModeActive: false,
  currentEmailFlags: [],    // { id, type, text, label }
  emailResults: [],         // per-email result records
  pendingLinkUrl: null,
  pendingLinkFlagId: null,
  pendingLinkFlagType: null,
  finalStretchWarned: false, // has the "2 minutes each" briefing been shown yet
  // When set, the player is reviewing an already-submitted email (read-only).
  // null means they're looking at the live, still-in-progress current email.
  reviewingEmailIdx: null,
};

// Emails 4 & 5 (0-indexed: 3, 4) are the only timed emails. Each gets its
// own strict 2-minute countdown, starting only once Email 3 is submitted.
const FINAL_STRETCH_EMAIL_INDICES = [3, 4];
const EMAIL_TIMER_DURATION = 120; // 2 minutes

const appState = {
  gmail: { open: false, minimized: false, maximized: false },
  browser: { open: false, minimized: false, maximized: false }
};

// ═══════════════════════════════════════════════════════════
// WINDOW MANAGEMENT
// ═══════════════════════════════════════════════════════════

function openApp(appName) {
  const win = document.getElementById(`win-${appName}`);
  const state = appState[appName];

  if (state.open && !state.minimized) {
    focusWindow(appName);
    return;
  }

  state.open = true;
  state.minimized = false;
  win.classList.remove('hidden', 'minimized');
  focusWindow(appName);
  updateTaskbar();

  if (appName === 'gmail' && gameState.missionStarted && !gameState.timerInterval) {
    // don't restart timer
  }
}

function closeApp(appName) {
  const win = document.getElementById(`win-${appName}`);
  appState[appName].open = false;
  appState[appName].minimized = false;
  appState[appName].maximized = false;
  win.classList.add('hidden');
  win.classList.remove('maximized', 'focused');
  updateTaskbar();
}

function minimizeApp(appName) {
  const win = document.getElementById(`win-${appName}`);
  appState[appName].minimized = true;
  win.classList.add('minimized');
  win.classList.remove('focused');
  updateTaskbar();
}

function toggleMaximize(appName) {
  const win = document.getElementById(`win-${appName}`);
  const state = appState[appName];
  if (state.maximized) {
    state.maximized = false;
    win.classList.remove('maximized');
  } else {
    state.maximized = true;
    win.classList.add('maximized');
  }
}

function focusWindow(appName) {
  document.querySelectorAll('.app-window').forEach(w => w.classList.remove('focused'));
  const win = document.getElementById(`win-${appName}`);
  win.classList.add('focused');
  updateTaskbar();
}

function taskbarClick(appName) {
  const state = appState[appName];
  if (!state.open) {
    openApp(appName);
  } else if (state.minimized) {
    minimizeApp_restore(appName);
  } else {
    const win = document.getElementById(`win-${appName}`);
    if (win.classList.contains('focused')) {
      minimizeApp(appName);
    } else {
      focusWindow(appName);
    }
  }
}

function minimizeApp_restore(appName) {
  const win = document.getElementById(`win-${appName}`);
  appState[appName].minimized = false;
  win.classList.remove('minimized');
  focusWindow(appName);
  updateTaskbar();
}

function updateTaskbar() {
  ['gmail', 'browser'].forEach(appName => {
    const btn = document.getElementById(`taskbar-${appName}`);
    const state = appState[appName];
    const win = document.getElementById(`win-${appName}`);

    btn.classList.remove('open', 'active', 'minimized');
    if (state.open) {
      btn.classList.add('open');
      if (state.minimized) {
        btn.classList.add('minimized');
      } else if (win.classList.contains('focused')) {
        btn.classList.add('active');
      }
    }
  });
}

// ── Window Dragging ──
(function setupDragging() {
  let dragging = false, startX, startY, origLeft, origTop, target;

  document.addEventListener('mousedown', e => {
    const titlebar = e.target.closest('.win-titlebar');
    if (!titlebar) return;
    const win = titlebar.closest('.app-window');
    if (!win || win.classList.contains('maximized')) return;

    dragging = true;
    target = win;
    startX = e.clientX;
    startY = e.clientY;
    origLeft = win.offsetLeft;
    origTop = win.offsetTop;

    const appName = win.dataset.app;
    focusWindow(appName);
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    target.style.left = Math.max(0, origLeft + dx) + 'px';
    target.style.top = Math.max(0, origTop + dy) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
})();

// ── Click to focus ──
document.querySelectorAll('.app-window').forEach(win => {
  win.addEventListener('mousedown', () => {
    const appName = win.dataset.app;
    focusWindow(appName);
  });
});

// ═══════════════════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════════════════

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('taskbar-time').textContent = `${h}:${m}`;
  const d = now;
  document.getElementById('taskbar-date').textContent =
    `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
}
updateClock();
setInterval(updateClock, 10000);

// ═══════════════════════════════════════════════════════════
// OVERLAY SYSTEM
// ═══════════════════════════════════════════════════════════

function showOverlay(id) {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('overlay-backdrop').classList.add('active');
}

function closeOverlay(id) {
  document.getElementById(id).classList.remove('active');
  const anyActive = document.querySelectorAll('.overlay.active').length > 0;
  if (!anyActive) document.getElementById('overlay-backdrop').classList.remove('active');
}

function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  document.getElementById('overlay-backdrop').classList.remove('active');
}

// ═══════════════════════════════════════════════════════════
// VISUAL NOVEL INTRO ENGINE
// ═══════════════════════════════════════════════════════════

const VN_DIALOGUE = [
  {
    speaker: 'SYSTEM',
    text: 'CYBERZERO SECURITY DIVISION — AGENT ORIENTATION — YEAR 2026',
    speed: 40
  },
  {
    speaker: 'DIRECTOR ZERO',
    text: "Welcome, Agent. I've been expecting you. I'm Director Zero — head of CyberZero's Threat Intelligence Division.",
    speed: 30
  },
  {
    speaker: 'DIRECTOR ZERO',
    text: "You've been selected because of your potential. But potential means nothing without the right training.",
    speed: 30
  },
  {
    speaker: 'DIRECTOR ZERO',
    text: "Your first mission: 5 suspicious emails are sitting in our monitored inbox. We believe they contain phishing attacks.",
    speed: 30
  },
  {
    speaker: 'DIRECTOR ZERO',
    text: "Read each email carefully. Flag every red flag you find — fake senders, false urgency, suspicious links. Then give your verdict.",
    speed: 30
  },
  {
    speaker: 'DIRECTOR ZERO',
    text: "The city's digital safety depends on agents like you. Take your time through training and your first 3 emails — the real clock only starts once you hit the final 2.",
    speed: 30
  },
  {
    speaker: 'DIRECTOR ZERO',
    text: "Alright, Agent. Let me show you exactly what to look for — and how to tell a safe email from a dangerous one. Follow closely.",
    speed: 30
  }
];

const vnState = {
  lineIndex: 0,
  charIndex: 0,
  typing: false,
  typingTimer: null,
  done: false
};

function vnInit() {
  vnSpawnParticles();
  vnState.lineIndex = 0;
  vnState.done = false;
  vnState.typing = false;
  if (vnState.typingTimer) clearTimeout(vnState.typingTimer);
  vnPlayLine(0);
}

function vnSpawnParticles() {
  const container = document.getElementById('vn-particles');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'vn-particle';
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${5 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

function vnPlayLine(index) {
  const line = VN_DIALOGUE[index];
  if (!line) return;

  const textEl    = document.getElementById('vn-text');
  const cursorEl  = document.getElementById('vn-cursor');
  const speakerEl = document.getElementById('vn-speaker-name');
  const hintEl    = document.getElementById('vn-advance-hint');
  const indEl     = document.getElementById('vn-line-indicator');
  const charEl    = document.getElementById('vn-character');

  speakerEl.textContent = line.speaker;
  indEl.textContent = `${index + 1} / ${VN_DIALOGUE.length}`;
  hintEl.classList.remove('visible');
  cursorEl.classList.remove('visible');
  textEl.textContent = '';
  if (charEl) charEl.classList.add('vn-speaking');

  // Update the speaker display element too
  document.getElementById('vn-speaker-name').textContent = line.speaker;

  if (vnState.typingTimer) clearTimeout(vnState.typingTimer);
  vnState.typing = true;
  vnState.charIndex = 0;

  function typeNextChar() {
    if (vnState.charIndex < line.text.length) {
      textEl.textContent += line.text[vnState.charIndex];
      vnState.charIndex++;
      vnState.typingTimer = setTimeout(typeNextChar, line.speed);
    } else {
      vnState.typing = false;
      if (charEl) charEl.classList.remove('vn-speaking');
      cursorEl.classList.add('visible');
      hintEl.classList.add('visible');
      const hint = hintEl.querySelector('span:first-child');
      hint.textContent = (index === VN_DIALOGUE.length - 1) ? 'Watch the Demo →' : 'Click to continue';
      if (index === VN_DIALOGUE.length - 1) vnState.done = true;
    }
  }
  typeNextChar();
}

function vnAdvance() {
  const line = VN_DIALOGUE[vnState.lineIndex];
  if (vnState.typing) {
    // Skip typewriter — show full line immediately
    if (vnState.typingTimer) clearTimeout(vnState.typingTimer);
    vnState.typing = false;
    const textEl   = document.getElementById('vn-text');
    const cursorEl = document.getElementById('vn-cursor');
    const hintEl   = document.getElementById('vn-advance-hint');
    const charEl   = document.getElementById('vn-character');
    textEl.textContent = line.text;
    if (charEl) charEl.classList.remove('vn-speaking');
    cursorEl.classList.add('visible');
    hintEl.classList.add('visible');
    const hint = hintEl.querySelector('span:first-child');
    hint.textContent = (vnState.lineIndex === VN_DIALOGUE.length - 1) ? 'Watch the Demo →' : 'Click to continue';
    if (vnState.lineIndex === VN_DIALOGUE.length - 1) vnState.done = true;
    return;
  }
  // Advance to next line or go straight to demo
  if (vnState.done || vnState.lineIndex >= VN_DIALOGUE.length - 1) {
    vnFinish();
  } else {
    vnState.lineIndex++;
    vnPlayLine(vnState.lineIndex);
  }
}

function vnSkip() {
  if (vnState.typingTimer) clearTimeout(vnState.typingTimer);
  vnFinish();
}

function vnFinish() {
  vnState.done = true;
  // Go straight to the interactive demo — no training slides
  startDemo();
}

// ═══════════════════════════════════════════════════════════
// GAME FLOW
// ═══════════════════════════════════════════════════════════

function startTraining() {
  gameState.phase = 'training';
  gameState.trainingSlide = 0;
  renderTrainingSlide();
  showOverlay('overlay-training');
}


function renderTrainingSlide() {
  const slide = TRAINING_SLIDES[gameState.trainingSlide];
  const bubble = document.getElementById('training-bubble');
  bubble.innerHTML = `<h3>${slide.title}</h3>${slide.content}`;

  // Dots
  const dotsEl = document.getElementById('training-dots');
  dotsEl.innerHTML = '';
  TRAINING_SLIDES.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'training-dot' + (i === gameState.trainingSlide ? ' active' : '');
    dot.onclick = () => { gameState.trainingSlide = i; renderTrainingSlide(); };
    dotsEl.appendChild(dot);
  });

  const prevBtn = document.getElementById('btn-training-prev');
  const nextBtn = document.getElementById('btn-training-next');
  prevBtn.style.visibility = gameState.trainingSlide === 0 ? 'hidden' : 'visible';

  if (gameState.trainingSlide === TRAINING_SLIDES.length - 1) {
    nextBtn.textContent = 'See the Demo →';
  } else {
    nextBtn.textContent = 'Next →';
  }
}

function trainingNext() {
  if (gameState.trainingSlide < TRAINING_SLIDES.length - 1) {
    gameState.trainingSlide++;
    renderTrainingSlide();
  } else {
    startDemo();
  }
}

function trainingPrev() {
  if (gameState.trainingSlide > 0) {
    gameState.trainingSlide--;
    renderTrainingSlide();
  }
}

// ═══════════════════════════════════════════════════════════
// DEMO FLOW — Animated Guided Walkthrough
// ═══════════════════════════════════════════════════════════

/*
  Demo steps:
  0 — Welcome & intro speech
  1 — "Read the email" (scroll email into view, Capy points)
  2 — Flag Sender  (cursor moves to sender, flag mode activates, flag placed)
  3 — Flag Urgency (cursor moves to urgency text, flag placed)
  4 — Inspect Link (cursor moves to link button, link destination revealed)
  5 — Flag Link    (flag placed on link)
  6 — Report       (cursor to Report button, report modal opens)
  7 — Review       (Capy explains the verdict) → mission starts
*/

const DEMO_SCRIPT = [
  {
    step: 0,
    speech: `<strong>Hey there, Detective! 🕵️</strong><br><br>I'm <strong>Detective Zero</strong>, your cybersecurity instructor.<br><br>I'll walk you through <em>two</em> real cases — one <span style="color:#ff6b6b">phishing</span> attack and one <span style="color:#69db7c">legitimate</span> email — so you know exactly what evidence to look for, and exactly how you'll be scored.<br><br>Click <strong>Let's Begin</strong> to start!`,
    btn: "Let's Begin →",
    action: null
  },
  {
    step: 1,
    speech: `📧 <strong>Case #1: Read It First</strong><br><br>Before flagging anything, I always <strong>read everything</strong> — the sender address, the subject line, and the full body.<br><br>Something already feels off here: the tone is aggressive and there's a hard deadline pushing me to act fast.<br><br>Can you spot it? Click <strong>Show Me</strong> to see the red flags.`,
    btn: "Show Me →",
    action: 'read'
  },
  {
    step: 2,
    speech: `🔴 <strong>Red Flag #1 — Fake Sender</strong><br><br>Look at that email address:<br><em>security@bpi-secure-login.xyz</em><br><br>Real BPI emails come from <em>@bpi.com.ph</em>. This domain is a <strong>lookalike</strong> — attackers register domains like this to impersonate banks.<br><br>Every red flag I correctly mark is worth <strong>+25 points</strong>. I'll activate Flag Mode and place this one now…`,
    btn: "Next Red Flag →",
    action: 'flag-sender'
  },
  {
    step: 3,
    speech: `⚡ <strong>Red Flag #2 — False Urgency</strong><br><br>"<em>30 minutes or suspended</em>" is a classic <strong>pressure tactic</strong> — attackers create panic so you act before you think.<br><br>Legitimate banks never issue 30-minute ultimatums. That's another <strong>+25 points</strong> for correctly flagging it. One red flag left…`,
    btn: "Reveal the Last Flag →",
    action: 'flag-urgency'
  },
  {
    step: 4,
    speech: `🔗 <strong>Red Flag #3 — Suspicious Link</strong><br><br>The button reads "Verify My BPI Account" — sounds official. But hover over it and the <strong>real destination</strong> is exposed, and it is NOT bpi.com.ph.<br><br><strong>That's all 3 red flags uncovered.</strong> No clock yet, though — you'll investigate your first 3 real emails at your own pace.`,
    btn: "Expose the Link →",
    action: 'inspect-link'
  },
  {
    step: 5,
    speech: `The link actually goes to:<br><em>bpi-account-security.io</em><br><br>That is <strong>NOT</strong> BPI's real website — it's a fake page built to steal login credentials the moment they're typed in.<br><br>+25 points for catching this too. Flagging it now…`,
    btn: "Now Report It →",
    action: 'flag-link'
  },
  {
    step: 6,
    speech: `✅ <strong>3 flags placed — 3 pieces of evidence!</strong><br><br>Now I'll click <strong>Report Email</strong> and submit my verdict as <strong>Phishing</strong>.<br><br>A correct final verdict is worth <strong>+100 points</strong> on its own, plus <strong>+25 per correct flag</strong> — so a clean case like this earns the full <strong>+175 points</strong>. Miss a flag and you simply earn less; place a <strong>wrong</strong> flag and it costs <strong>−10</strong>, while a <strong>wrong verdict</strong> costs <strong>−50</strong>. Evidence-based accuracy is what pays off.`,
    btn: "Submit Report →",
    action: 'report'
  },
  {
    step: 7,
    speech: `🛡️ <strong>Case #2: A LEGITIMATE Email</strong><br><br>Not every email is a threat! A good detective also has to recognize <em>safe</em> emails — flag everything and you'll lose points just as fast as missing a real attack.<br><br>Here's a routine HR email. Watch how I check its legitimacy signals…`,
    btn: "Show Legit Email →",
    action: 'show-legit'
  },
  {
    step: 8,
    speech: `🤔 <strong>What if I flag something by mistake?</strong><br><br>Say I get twitchy and flag this sender out of habit, even though nothing's actually wrong with it. Watch what happens…<br><br>A wrong flag costs <strong>−10 points</strong> — but only if it's still there when I report. Nothing is locked in until then.`,
    btn: "Flag It →",
    action: 'flag-mistake-legit'
  },
  {
    step: 9,
    speech: `🚩 <strong>Oops — flagged in error.</strong><br><br>Good thing I checked myself before reporting. To remove a flag, just click the <strong>same spot again</strong> — it toggles right off, no penalty, no harm done.<br><br>Watch me undo it now.`,
    btn: "Undo the Flag →",
    action: 'unflag-mistake-legit'
  },
  {
    step: 10,
    speech: `✅ <strong>How to verify a LEGITIMATE email:</strong><br><br>I check 5 things — watch the checklist appear as I go through each one.<br><br>✔ Domain matches company<br>✔ No fake urgency<br>✔ No suspicious links<br>✔ Routine content<br>✔ No credential requests<br><br>All clear — this is safe. Reporting it as <strong>Legitimate</strong> earns the same <strong>+100 points</strong> as catching a phishing attack. Placing flags on a safe email like this one would cost <strong>−10 points each</strong>, so when nothing's wrong, the smartest move is to leave it unflagged — and now you know exactly how to undo one if you slip up.`,
    btn: "Mark as Legitimate →",
    action: 'check-legit'
  },
  {
    step: 11,
    speech: `🏆 <strong>Training complete, Detective!</strong><br><br>You've learned the skills every cyber detective needs:<br><br>→ <strong>Spot phishing</strong> — fake senders, pressure tactics, bad links<br>→ <strong>Recognize legit</strong> — verified domain, no urgency, no suspicious links<br>→ <strong>Undo a mistake</strong> — click a flagged item again to remove it before you report<br><br><strong>Scoring recap:</strong> +100 for a correct verdict, +25 per correct flag, −50 for a wrong verdict, −10 per wrong flag.<br><br>Your first 3 emails are untimed — investigate freely. But the last 2 will each come with a strict 2-minute clock. Good luck!`,
    btn: "START MY MISSION →",
    action: 'done'
  }
];

let gdemoStep = 0;
let gdemoFlags = [];
let gdemoAutoTimer = null;

function startDemo() {
  gameState.phase = 'demo';
  gdemoStep = 0;
  gdemoFlags = [];

  // Reset all demo state
  resetDemoVisuals();
  showOverlay('overlay-demo');
  renderDemoStep(0);
}

function resetDemoVisuals() {
  // Cursor
  const cursor = document.getElementById('gdemo-cursor');
  cursor.className = 'gdemo-cursor';

  // Sender
  const sender = document.getElementById('gdemo-sender');
  if (sender) { sender.className = 'gdemo-meta-val'; }

  // Legit sender (used for the mistaken-flag / unflag demo)
  const legitSender = document.getElementById('gdemo-legit-sender');
  if (legitSender) { legitSender.className = 'gdemo-meta-val'; }

  // Urgency
  const urgency = document.getElementById('gdemo-urgency');
  if (urgency) { urgency.className = ''; }

  // Link
  const link = document.getElementById('gdemo-link');
  if (link) { link.classList.remove('gdemo-flagged'); }
  const linkDest = document.getElementById('gdemo-link-dest');
  if (linkDest) { linkDest.classList.add('hidden'); }

  // Flag btn
  const flagBtn = document.getElementById('gdemo-flag-btn');
  if (flagBtn) {
    flagBtn.classList.remove('active');
    flagBtn.disabled = false;
    flagBtn.style.opacity = '1';
  }

  // Report modal (phishing)
  const modal = document.getElementById('gdemo-report-modal');
  if (modal) { modal.classList.add('hidden'); }

  // Report modal (legitimate)
  const legitModal = document.getElementById('gdemo-legit-report-modal');
  if (legitModal) { legitModal.classList.add('hidden'); }

  // Show phishing email, hide legit email
  const phishingEmail = document.getElementById('gdemo-email');
  const legitEmail = document.getElementById('gdemo-legit-email');
  if (phishingEmail) {
    phishingEmail.classList.remove('hidden');
    phishingEmail.style.opacity = '';
    phishingEmail.style.transform = '';
  }
  if (legitEmail) {
    legitEmail.classList.add('hidden');
    legitEmail.style.opacity = '';
    legitEmail.style.transform = '';
  }

  // Reset legit checklist
  const checklist = document.getElementById('gdemo-legit-checklist');
  if (checklist) { checklist.classList.add('hidden'); }

  // Reset legit check icons
  ['gdemo-lcheck-1','gdemo-lcheck-2','gdemo-lcheck-3','gdemo-lcheck-4','gdemo-lcheck-5'].forEach(id => {
    const item = document.getElementById(id);
    if (item) {
      item.classList.remove('gdemo-lcheck-passed');
      const icon = item.querySelector('.gdemo-lcheck-icon');
      if (icon) icon.textContent = '⬜';
    }
  });

  // Reset legit banner
  const banner = document.getElementById('gdemo-legit-banner');
  if (banner) {
    banner.style.background = '';
    banner.style.borderColor = '';
    banner.innerHTML = '<span class="gdemo-legit-banner-icon">🛡️</span><span>Checking legitimacy signals…</span>';
  }

  // Evidence panel
  updateDemoEvidencePanel([]);

  // Steps
  document.querySelectorAll('.gdemo-step').forEach(s => s.className = 'gdemo-step');
}

function renderDemoStep(stepIdx) {
  const script = DEMO_SCRIPT[stepIdx];
  if (!script) return;

  // Update speech bubble with typewriter effect
  setDemoSpeech(script.speech);

  // Update proceed button
  document.getElementById('btn-demo-next').textContent = script.btn;

  // Update step tracker
  document.querySelectorAll('.gdemo-step').forEach((el, i) => {
    el.className = 'gdemo-step';
    if (i < stepIdx) el.classList.add('done');
    else if (i === stepIdx) el.classList.add('active');
  });
}

function setDemoSpeech(html) {
  const el = document.getElementById('gdemo-speech-text');
  el.style.opacity = '0';
  el.style.transform = 'translateY(4px)';
  el.style.transition = 'opacity 250ms, transform 250ms';
  setTimeout(() => {
    el.innerHTML = html;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 200);
}

function demoProceed() {
  const script = DEMO_SCRIPT[gdemoStep];
  if (!script) return;

  if (script.action) {
    executeDemoAction(script.action, () => {
      gdemoStep++;
      renderDemoStep(gdemoStep);
    });
  } else {
    gdemoStep++;
    renderDemoStep(gdemoStep);
  }
}

function executeDemoAction(action, callback) {
  // Disable proceed button during animation
  const btn = document.getElementById('btn-demo-next');
  btn.disabled = true;
  btn.style.opacity = '0.5';

  const re = () => {
    btn.disabled = false;
    btn.style.opacity = '1';
    callback();
  };

  if (action === 'read') {
    // Animate cursor scanning the email
    animateCursorTo('gdemo-email-hdr', () => {
      setTimeout(() => animateCursorTo('gdemo-urgency', () => {
        hideCursor();
        setTimeout(re, 300);
      }), 600);
    });

  } else if (action === 'flag-sender') {
    // 1. Activate flag mode
    const flagBtn = document.getElementById('gdemo-flag-btn');
    flagBtn.classList.add('active');

    // 2. Cursor to sender
    setTimeout(() => {
      animateCursorTo('gdemo-sender', () => {
        // 3. Click & flag
        setTimeout(() => {
          clickEffect(() => {
            const sender = document.getElementById('gdemo-sender');
            sender.classList.add('gdemo-flagged');
            gdemoFlags.push({ icon: '🚩', label: 'FAKE SENDER', text: 'security@bpi-secure-login.xyz' });
            updateDemoEvidencePanel(gdemoFlags);
            hideCursor();
            setTimeout(re, 500);
          });
        }, 400);
      });
    }, 300);

  } else if (action === 'flag-urgency') {
    animateCursorTo('gdemo-urgency', () => {
      setTimeout(() => {
        clickEffect(() => {
          const urgency = document.getElementById('gdemo-urgency');
          urgency.classList.add('gdemo-flagged');
          gdemoFlags.push({ icon: '🚩', label: 'FALSE URGENCY', text: 'Verify within 30 minutes or be suspended' });
          updateDemoEvidencePanel(gdemoFlags);
          hideCursor();
          setTimeout(re, 500);
        });
      }, 400);
    });

  } else if (action === 'inspect-link') {
    animateCursorTo('gdemo-link', () => {
      // Hover — reveal destination
      setTimeout(() => {
        document.getElementById('gdemo-link-dest').classList.remove('hidden');
        hideCursor();
        setTimeout(re, 600);
      }, 500);
    });

  } else if (action === 'flag-link') {
    animateCursorTo('gdemo-link', () => {
      setTimeout(() => {
        clickEffect(() => {
          const link = document.getElementById('gdemo-link');
          link.classList.add('gdemo-flagged');
          gdemoFlags.push({ icon: '🚩', label: 'SUSPICIOUS LINK', text: 'https://bpi-account-security.io/login' });
          updateDemoEvidencePanel(gdemoFlags);
          hideCursor();
          setTimeout(re, 500);
        });
      }, 400);
    });

  } else if (action === 'report') {
    // Deactivate flag mode
    document.getElementById('gdemo-flag-btn').classList.remove('active');

    animateCursorTo('gdemo-report-btn', () => {
      setTimeout(() => {
        clickEffect(() => {
          // Show report modal
          const modal = document.getElementById('gdemo-report-modal');
          const flagsEl = document.getElementById('gdemo-rm-flags');
          flagsEl.innerHTML = gdemoFlags.map(f =>
            `<div class="gdemo-rm-flag-item">${f.icon} <strong style="color:var(--accent-orange);margin-right:4px">${f.label}</strong> — ${f.text}</div>`
          ).join('');
          modal.classList.remove('hidden');
          hideCursor();

          // After modal appears, move cursor to the REPORT AS PHISHING button
          setTimeout(() => {
            animateCursorTo('gdemo-report-phishing', () => {
              setTimeout(() => {
                // Click animation on the report button
                const reportBtn = document.getElementById('gdemo-report-phishing');
                reportBtn.classList.add('gdemo-clicking');
                clickEffect(() => {
                  reportBtn.classList.remove('gdemo-clicking');
                  modal.classList.add('hidden');
                  hideCursor();
                  setTimeout(re, 400);
                });
              }, 500);
            });
          }, 800);
        });
      }, 400);
    });

  } else if (action === 'show-legit') {
    // Switch from phishing email to legitimate email
    const phishingEmail = document.getElementById('gdemo-email');
    const legitEmail = document.getElementById('gdemo-legit-email');
    const flagBtn = document.getElementById('gdemo-flag-btn');

    // Fade out phishing email
    phishingEmail.style.transition = 'opacity 400ms, transform 400ms';
    phishingEmail.style.opacity = '0';
    phishingEmail.style.transform = 'translateX(-20px)';

    setTimeout(() => {
      phishingEmail.classList.add('hidden');
      phishingEmail.style.opacity = '';
      phishingEmail.style.transform = '';

      // Disable flag mode for legit email
      flagBtn.classList.remove('active');
      flagBtn.disabled = true;
      flagBtn.style.opacity = '0.4';

      // Show legit email with fade-in
      legitEmail.classList.remove('hidden');
      legitEmail.style.opacity = '0';
      legitEmail.style.transform = 'translateX(20px)';
      legitEmail.style.transition = 'opacity 400ms, transform 400ms';

      setTimeout(() => {
        legitEmail.style.opacity = '1';
        legitEmail.style.transform = 'translateX(0)';

        // Animate banner
        const banner = document.getElementById('gdemo-legit-banner');
        if (banner) {
          banner.style.animation = 'pulse-green 1s ease';
          setTimeout(() => {
            banner.innerHTML = '<span class="gdemo-legit-banner-icon">🛡️</span><span><strong>Legitimacy check in progress…</strong> Analyzing sender, content, and links.</span>';
          }, 800);
        }

        setTimeout(re, 600);
      }, 50);
    }, 450);

  } else if (action === 'flag-mistake-legit') {
    // Re-enable flag mode (was disabled after switching to the legit email)
    const flagBtn = document.getElementById('gdemo-flag-btn');
    flagBtn.disabled = false;
    flagBtn.style.opacity = '1';
    flagBtn.classList.add('active');

    setTimeout(() => {
      animateCursorTo('gdemo-legit-sender', () => {
        setTimeout(() => {
          clickEffect(() => {
            const sender = document.getElementById('gdemo-legit-sender');
            sender.classList.add('gdemo-flagged');
            gdemoFlags.push({ icon: '🚩', label: 'SENDER (flagged in error)', text: 'hr@company.com.ph' });
            updateDemoEvidencePanel(gdemoFlags);
            hideCursor();
            setTimeout(re, 500);
          });
        }, 400);
      });
    }, 300);

  } else if (action === 'unflag-mistake-legit') {
    // Click the same flagged element again — toggles the flag off, just like real gameplay
    animateCursorTo('gdemo-legit-sender', () => {
      setTimeout(() => {
        clickEffect(() => {
          const sender = document.getElementById('gdemo-legit-sender');
          sender.classList.remove('gdemo-flagged');
          sender.classList.add('gdemo-highlight-pulse');
          setTimeout(() => sender.classList.remove('gdemo-highlight-pulse'), 700);

          gdemoFlags = gdemoFlags.filter(f => f.label !== 'SENDER (flagged in error)');
          updateDemoEvidencePanel(gdemoFlags);

          // Flag mode isn't needed again until the player's own emails, so switch it off
          const flagBtn = document.getElementById('gdemo-flag-btn');
          flagBtn.classList.remove('active');
          flagBtn.disabled = true;
          flagBtn.style.opacity = '0.4';

          hideCursor();
          setTimeout(re, 500);
        });
      }, 400);
    });

  } else if (action === 'check-legit') {
    // Reveal legitimacy checklist with staggered animations
    const checklist = document.getElementById('gdemo-legit-checklist');
    const banner = document.getElementById('gdemo-legit-banner');
    checklist.classList.remove('hidden');
    checklist.style.opacity = '0';
    checklist.style.transition = 'opacity 300ms';

    if (banner) {
      banner.innerHTML = '<span class="gdemo-legit-banner-icon">✅</span><span><strong>All checks passed!</strong> This email is LEGITIMATE.</span>';
      banner.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))';
      banner.style.borderColor = 'var(--accent-green)';
    }

    setTimeout(() => {
      checklist.style.opacity = '1';
    }, 100);

    // Stagger each checklist item to check off with green
    const checks = ['gdemo-lcheck-1','gdemo-lcheck-2','gdemo-lcheck-3','gdemo-lcheck-4','gdemo-lcheck-5'];
    checks.forEach((id, i) => {
      setTimeout(() => {
        const item = document.getElementById(id);
        if (item) {
          const icon = item.querySelector('.gdemo-lcheck-icon');
          if (icon) {
            icon.textContent = '✅';
            icon.style.animation = 'pop-in 300ms ease';
          }
          item.classList.add('gdemo-lcheck-passed');
        }
      }, 300 + i * 350);
    });

    // After all checks, move cursor to the legit report button
    setTimeout(() => {
      animateCursorTo('gdemo-report-btn', () => {
        setTimeout(() => {
          clickEffect(() => {
            const modal = document.getElementById('gdemo-legit-report-modal');
            modal.classList.remove('hidden');
            hideCursor();

            // Move cursor to "Mark as Legitimate" button
            setTimeout(() => {
              animateCursorTo('gdemo-report-legit', () => {
                setTimeout(() => {
                  const legitBtn = document.getElementById('gdemo-report-legit');
                  if (legitBtn) legitBtn.classList.add('gdemo-clicking');
                  clickEffect(() => {
                    if (legitBtn) legitBtn.classList.remove('gdemo-clicking');
                    modal.classList.add('hidden');
                    hideCursor();
                    setTimeout(re, 400);
                  });
                }, 500);
              });
            }, 800);
          });
        }, 400);
      });
    }, checks.length * 350 + 600);

  } else if (action === 'done') {
    startMission();
  }
}

function animateCursorTo(targetId, cb) {
  const cursor = document.getElementById('gdemo-cursor');
  const workspace = document.getElementById('gdemo-workspace') || document.querySelector('.gdemo-workspace');
  const target = document.getElementById(targetId);
  if (!target || !workspace) { if (cb) cb(); return; }

  const wsRect = workspace.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();

  const left = tRect.left - wsRect.left + tRect.width * 0.3;
  const top = tRect.top - wsRect.top + tRect.height * 0.4;

  cursor.classList.add('visible');
  cursor.style.left = left + 'px';
  cursor.style.top = top + 'px';

  setTimeout(() => {
    // pulse highlight target
    target.classList.add('gdemo-highlight-pulse');
    setTimeout(() => target.classList.remove('gdemo-highlight-pulse'), 700);
    if (cb) cb();
  }, 700);
}

function clickEffect(cb) {
  const cursor = document.getElementById('gdemo-cursor');
  cursor.textContent = '👇';
  cursor.style.transform = 'scale(0.85)';
  setTimeout(() => {
    cursor.style.transform = 'scale(1)';
    cursor.textContent = '👆';
    if (cb) cb();
  }, 200);
}

function hideCursor() {
  const cursor = document.getElementById('gdemo-cursor');
  cursor.classList.remove('visible');
}

function updateDemoEvidencePanel(flags) {
  const list = document.getElementById('gdemo-evidence-list');
  const badge = document.getElementById('gdemo-evidence-count');
  badge.textContent = `${flags.length} FLAG${flags.length !== 1 ? 'S' : ''}`;

  if (flags.length === 0) {
    list.innerHTML = '<div class="evidence-empty">No flags yet…</div>';
    return;
  }
  list.innerHTML = flags.map(f => `
    <div class="evidence-item" style="animation:slide-in-up 250ms ease">
      <span class="evidence-item-icon">${f.icon}</span>
      <span class="evidence-item-text">${f.text}</span>
      <span class="evidence-item-type">${f.label}</span>
    </div>`).join('');
}



// ═══════════════════════════════════════════════════════════
// MISSION
// ═══════════════════════════════════════════════════════════

function startMission() {
  gameState.phase = 'mission';
  gameState.missionStarted = true;
  gameState.currentEmail = 0;
  gameState.score = 0;
  gameState.correctDecisions = 0;
  gameState.phishingDetected = 0;
  gameState.legitimateDetected = 0;
  gameState.evidenceFoundTotal = 0;
  gameState.emailResults = [];
  gameState.finalStretchWarned = false;
  gameState.reviewingEmailIdx = null;

  hideAllOverlays();
  renderEmailList();
  updateHUD();

  document.getElementById('hud').classList.remove('hidden');
  openApp('gmail');

  // Emails 1–3 are untimed by design. The clock only appears once the
  // player reaches Email 4 — see nextEmail() / showFinalStretchWarning().
  renderUntimedHUD();
  showToast('🕵️ Mission started! Investigate your inbox — no clock yet.', 'success');
}

// ═══════════════════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════════════════

function startTimer() {
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

function updateTimer() {
  if (gameState.timeRemaining <= 0) {
    stopTimer();
    handleTimeUp();
    return;
  }
  gameState.timeRemaining--;
  renderTimer();
}

function renderTimer() {
  const t = gameState.timeRemaining;
  const m = Math.floor(t / 60).toString().padStart(2, '0');
  const s = (t % 60).toString().padStart(2, '0');
  const stateClass = t <= 20 ? 'timer-critical' : t <= 45 ? 'timer-warning' : 'timer-normal';
  const timeText = `${m}:${s}`;

  const el = document.getElementById('hud-timer');
  if (el) {
    el.textContent = timeText;
    el.className = `hud-value ${stateClass}`;
  }
}

// Shows the "no clock yet" state on the HUD, used for Emails 1–3.
function renderUntimedHUD() {
  const label = document.getElementById('hud-timer-label');
  const el = document.getElementById('hud-timer');
  if (label) label.textContent = 'TIME';
  if (el) {
    el.textContent = 'UNTIMED';
    el.className = 'hud-value timer-untimed';
  }
}

// Fires when a final-stretch email's 2-minute clock hits zero before the
// player submitted their own report. Whatever flags/decision they have
// standing right now gets submitted for them — partial credit possible.
function handleTimeUp() {
  showToast("⏰ Time's up on this one! Capybara is auto-submitting your report...", 'error');
  setTimeout(() => autoSubmitReport(), 1200);
}

function autoSubmitReport() {
  closeOverlay('overlay-report');
  const impliedIsPhishing = gameState.currentEmailFlags.length > 0;
  submitReport(impliedIsPhishing, true);
}

// ═══════════════════════════════════════════════════════════
// FINAL STRETCH (Emails 4 & 5 — the only timed emails)
// ═══════════════════════════════════════════════════════════

function isFinalStretchEmail(idx) {
  return FINAL_STRETCH_EMAIL_INDICES.includes(idx);
}

// Starts the 2-minute countdown for the current (final-stretch) email.
function startFinalStretchTimer() {
  stopTimer();
  gameState.timeRemaining = EMAIL_TIMER_DURATION;
  const label = document.getElementById('hud-timer-label');
  if (label) label.textContent = '⚡ CLOCK';
  renderTimer();
  startTimer();
}

// Shown once, right after Email 3's report is submitted and reviewed,
// before the player enters Email 4. Explains the new 2-minutes-each rule.
// Email 5 just gets a quick toast reminder instead of the full briefing.
function showFinalStretchWarning() {
  const bubble = document.getElementById('final-stretch-bubble');
  bubble.innerHTML = `
    <h3>⚡ Two Left, Detective.</h3>
    <p>You've done well investigating without a clock — but I'm turning up the heat for the final stretch.</p>
    <p style="margin-top:12px;">Starting now, <span class="highlight-red">each of these last two emails gets its own 2-minute clock</span>. The moment you confirm you're ready, it starts counting down.</p>
    <p style="margin-top:12px;">If that clock hits zero before you hit <strong>Report Email</strong>, I won't wait — I'll go with whatever flags and decision you've got on the board. Partial credit only, so don't leave evidence unflagged.</p>
    <p style="margin-top:16px;font-size:13px;color:#ff8a80;">⏱ Move fast, but move carefully. Ready?</p>`;
  showOverlay('overlay-final-stretch');
}

// Fired by the "I'm Ready →" button on the final-stretch interstitial.
function beginFinalStretchEmail() {
  closeOverlay('overlay-final-stretch');
  startFinalStretchTimer();
}

// ═══════════════════════════════════════════════════════════
// HUD
// ═══════════════════════════════════════════════════════════


function updateHUD() {
  document.getElementById('hud-email-count').textContent =
    `${gameState.currentEmail + 1} / ${EMAILS.length}`;
  document.getElementById('hud-score').textContent = gameState.score;
}

// ═══════════════════════════════════════════════════════════
// GMAIL — EMAIL LIST
// ═══════════════════════════════════════════════════════════

function renderEmailList() {
  const list = document.getElementById('email-list');
  list.innerHTML = '';

  EMAILS.forEach((email, idx) => {
    const result = gameState.emailResults.find(r => r.emailId === email.id);
    const isRead = idx < gameState.currentEmail;
    const isCurrent = idx === gameState.currentEmail;

    const item = document.createElement('div');
    item.className = `email-list-item ${isRead || result ? 'read' : 'unread'}`;
    item.id = `email-item-${email.id}`;

    // Avatar letter
    const initial = email.sender.name[0].toUpperCase();
    const avatarColors = ['#5c6bc0','#0288d1','#00897b','#7b1fa2','#c62828'];
    const avatarColor = avatarColors[idx % avatarColors.length];

    let badgeHtml = '';
    if (result) {
      const label = result.isPhishing ? '🚩 Phishing' : '✓ Legitimate';
      const cls = result.isPhishing ? 'phishing' : 'legit';
      badgeHtml = `<span class="email-done-badge ${cls}">${label}</span>`;
    } else if (isCurrent) {
      badgeHtml = `<div class="email-status-dot"></div>`;
    }

    item.innerHTML = `
      <div class="email-list-avatar" style="background:${avatarColor}">${initial}</div>
      <div class="email-list-content">
        <div class="email-list-sender">${email.sender.name}</div>
        <div class="email-list-subject">${email.subject}</div>
        <div class="email-list-preview">${email.preview}</div>
      </div>
      <div class="email-list-meta">
        <span class="email-list-time">${email.time}</span>
        ${badgeHtml}
      </div>`;

    // Only allow clicking current or already-done emails
    if (isCurrent || result) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => openEmail(idx));
    } else {
      item.style.opacity = '0.45';
      item.style.cursor = 'not-allowed';
    }

    list.appendChild(item);
  });
}

// ═══════════════════════════════════════════════════════════
// GMAIL — EMAIL DETAIL
// ═══════════════════════════════════════════════════════════

function openEmail(idx) {
  const email = EMAILS[idx];
  const result = gameState.emailResults.find(r => r.emailIdx === idx);

  if (idx === gameState.currentEmail && !result) {
    // The live, still-in-progress email — resume exactly where the player
    // left off. Flags are NOT reset here; they only ever reset in
    // nextEmail()/startMission() when a genuinely new email begins.
    gameState.reviewingEmailIdx = null;
  } else if (result) {
    // A past, already-reported email — read-only review. This never
    // touches gameState.currentEmail or currentEmailFlags, so the live
    // investigation (and the ability to submit only once) stays intact.
    gameState.reviewingEmailIdx = idx;
  } else {
    return; // not reachable from the UI, but guard just in case
  }

  // Switch view
  document.getElementById('email-list-view').classList.remove('active');
  document.getElementById('email-detail-view').classList.add('active');

  gameState.flagModeActive = false;
  document.getElementById('flag-mode-btn').classList.remove('active');
  document.querySelector('.gmail-body').classList.remove('flag-mode-active');

  renderEmailContent(email);

  const flagsToShow = result ? result.flagsSnapshot : gameState.currentEmailFlags;
  applyFlagVisuals(flagsToShow.map(f => f.type));
  renderEvidencePanel(flagsToShow, /* readOnly */ !!result);
  updateReportControls(result);
  updateHUD();
}

// Re-applies the "flagged" highlight to matching elements after a fresh
// render — needed because renderEmailContent() rebuilds the DOM from
// scratch every time an email is opened.
function applyFlagVisuals(flagTypes) {
  document.querySelectorAll('.flaggable').forEach(el => {
    if (flagTypes.includes(el.dataset.flagType)) {
      el.classList.add('flagged');
    } else {
      el.classList.remove('flagged');
    }
  });
}

// Shows/hides the toolbar controls depending on whether the player is
// looking at the live email (can flag + report) or reviewing a past,
// already-submitted one (read-only — reporting again is not allowed).
function updateReportControls(result) {
  const flagBtn = document.getElementById('flag-mode-btn');
  const reportBtn = document.getElementById('report-btn');
  const banner = document.getElementById('email-reported-banner');

  if (result) {
    flagBtn.disabled = true;
    flagBtn.style.opacity = '0.4';
    flagBtn.style.cursor = 'not-allowed';
    reportBtn.disabled = true;
    reportBtn.style.opacity = '0.4';
    reportBtn.style.cursor = 'not-allowed';
    reportBtn.textContent = '✓ Already Reported';

    if (banner) {
      const label = result.isPhishing === result.playerDecision
        ? (result.playerDecision ? '🚩 Reported as Phishing' : '✓ Marked Legitimate')
        : (result.playerDecision ? '🚩 Reported as Phishing (incorrect)' : '✓ Marked Legitimate (incorrect)');
      banner.textContent = `${label} — this investigation is closed. You're just reviewing it now.`;
      banner.classList.remove('hidden');
    }
  } else {
    flagBtn.disabled = false;
    flagBtn.style.opacity = '1';
    flagBtn.style.cursor = '';
    reportBtn.disabled = false;
    reportBtn.style.opacity = '1';
    reportBtn.style.cursor = '';
    reportBtn.textContent = '📋 Report Email';

    if (banner) banner.classList.add('hidden');
  }
}

function renderEmailContent(email) {
  const content = document.getElementById('email-content');
  content.innerHTML = '';

  // Header block
  const header = document.createElement('div');
  header.className = 'email-header-block';
  header.innerHTML = `
    <div class="email-subject-line">${email.subject}</div>
    <div class="email-meta-row">
      <span class="email-meta-label">FROM</span>
      <span class="email-meta-value">
        <span class="flaggable" data-flag-id="sender" data-flag-type="fake_sender" data-flag-label="FAKE SENDER"
          data-flag-text="${email.sender.address}"
          onclick="handleFlaggableClick(this)">${email.sender.name} &lt;${email.sender.address}&gt;</span>
      </span>
    </div>
    <div class="email-meta-row">
      <span class="email-meta-label">TO</span>
      <span class="email-meta-value" style="color:var(--text-muted)">me@company.com.ph</span>
    </div>
    <div class="email-meta-row">
      <span class="email-meta-label">DATE</span>
      <span class="email-meta-value" style="color:var(--text-muted)">${email.time}</span>
    </div>`;
  content.appendChild(header);

  // Body
  const body = document.createElement('div');
  body.className = 'email-body-text';

  email.body.forEach(part => {
    if (part.type === 'p') {
      const p = document.createElement('p');
      p.style.whiteSpace = 'pre-line';
      p.textContent = part.text;
      body.appendChild(p);

    } else if (part.type === 'p-flag') {
      const p = document.createElement('p');
      const span = document.createElement('span');
      span.className = 'flaggable';
      span.dataset.flagId = part.flagId;
      span.dataset.flagType = part.flagType;
      span.dataset.flagLabel = part.label;
      span.dataset.flagText = part.text;
      span.textContent = part.text;
      span.setAttribute('onclick', 'handleFlaggableClick(this)');
      p.appendChild(span);
      body.appendChild(p);

    } else if (part.type === 'link') {
      const wrap = document.createElement('div');
      wrap.className = 'email-link-wrap';
      const link = document.createElement('a');
      link.className = 'email-link flaggable';
      link.href = '#';
      link.dataset.flagId = part.flagId;
      link.dataset.flagType = part.flagType;
      link.dataset.flagLabel = part.label;
      link.dataset.flagText = part.destination;
      link.dataset.destination = part.destination;
      link.textContent = part.text;
      link.setAttribute('onclick', 'handleEmailLinkClick(event, this)');
      wrap.appendChild(link);
      body.appendChild(wrap);
    }
  });

  content.appendChild(body);
}

function handleFlaggableClick(el) {
  if (gameState.reviewingEmailIdx !== null) {
    showToast('📁 This case is closed — you already reported this email.', '');
    return;
  }
  // If already flagged, always allow unflagging (regardless of flag mode)
  if (el.classList.contains('flagged')) {
    removeFlag(el.dataset.flagType);
    return;
  }
  // Not flagged — require flag mode to be active
  if (!gameState.flagModeActive) {
    showToast('💡 Activate 🚩 Flag Evidence first, then click suspicious elements.', 'warning');
    return;
  }
  placeFlag(el);
}

function handleEmailLinkClick(event, el) {
  event.preventDefault();
  const destination = el.dataset.destination;
  if (destination) {
    showLinkPopup(el, destination);
  } else if (gameState.flagModeActive && gameState.reviewingEmailIdx === null) {
    placeFlag(el);
  }
}

function showLinkPopup(el, url) {
  gameState.pendingLinkUrl = url;
  gameState.pendingLinkFlagId = el.dataset.flagId;
  gameState.pendingLinkFlagType = el.dataset.flagType;

  const popup = document.getElementById('link-inspect-popup');
  popup.classList.remove('hidden');
  document.getElementById('lip-url').textContent = url;

  // Position near the link
  const rect = el.getBoundingClientRect();
  popup.style.top = (rect.bottom + 10) + 'px';
  popup.style.left = Math.min(rect.left, window.innerWidth - 420) + 'px';
}

function closeLinkPopup() {
  document.getElementById('link-inspect-popup').classList.add('hidden');
  gameState.pendingLinkUrl = null;
}

function flagFromPopup() {
  if (gameState.reviewingEmailIdx !== null) {
    closeLinkPopup();
    return;
  }
  const email = EMAILS[gameState.currentEmail];
  const el = document.querySelector(`[data-flag-id="${gameState.pendingLinkFlagId}"]`);
  if (el) {
    if (!gameState.flagModeActive) {
      // Auto-enable flag mode when flagging from popup
      gameState.flagModeActive = true;
    }
    placeFlag(el);
  }
  closeLinkPopup();
}

function openInBrowser() {
  const url = gameState.pendingLinkUrl;
  closeLinkPopup();
  openSuspiciousSite(url);
}

function openSuspiciousSite(url) {
  openApp('browser');
  navigateBrowser(url);
  focusWindow('browser');
}

// ═══════════════════════════════════════════════════════════
// FLAG SYSTEM
// ═══════════════════════════════════════════════════════════

function toggleFlagMode() {
  if (gameState.reviewingEmailIdx !== null) {
    showToast('📁 This case is closed — nothing left to flag here.', '');
    return;
  }
  gameState.flagModeActive = !gameState.flagModeActive;
  const btn = document.getElementById('flag-mode-btn');
  const body = document.querySelector('.gmail-body');

  if (gameState.flagModeActive) {
    btn.classList.add('active');
    body.classList.add('flag-mode-active');
    showToast('🚩 Flag Mode ON — click suspicious elements to flag them.', 'warning');
  } else {
    btn.classList.remove('active');
    body.classList.remove('flag-mode-active');
    showToast('Flag Mode OFF', '');
  }
}

function placeFlag(el) {
  const flagId   = el.dataset.flagId;
  const flagType = el.dataset.flagType;
  const flagLabel = el.dataset.flagLabel;
  const flagText  = el.dataset.flagText || el.textContent.trim();

  // Toggle — if already flagged, remove it
  if (el.classList.contains('flagged')) {
    removeFlag(flagType);
    return;
  }

  // Check if this type is already flagged on another element
  const existing = gameState.currentEmailFlags.find(f => f.type === flagType);
  if (existing) {
    showToast('⚠ This type of evidence is already flagged.', 'warning');
    return;
  }

  const flag = { id: flagId, type: flagType, label: flagLabel || flagType.replace('_', ' ').toUpperCase(), text: flagText };
  gameState.currentEmailFlags.push(flag);

  el.classList.add('flagged');
  renderEvidencePanel();
  showToast(`🚩 Flagged: ${flag.label}`, 'success');
}

function removeFlag(flagType) {
  const idx = gameState.currentEmailFlags.findIndex(f => f.type === flagType);
  if (idx === -1) return;
  const [removed] = gameState.currentEmailFlags.splice(idx, 1);

  // Remove visual flag from element in email body
  const el = document.querySelector(`[data-flag-type="${flagType}"]`);
  if (el) {
    el.classList.remove('flagged');
    // Brief unflag flash
    el.classList.add('unflagging');
    setTimeout(() => el.classList.remove('unflagging'), 400);
  }

  renderEvidencePanel();
  showToast(`🗑 Unflagged: ${removed.label}`, '');
}

function renderEvidencePanel(flagsOverride = null, readOnly = false) {
  const list = document.getElementById('evidence-list');
  const badge = document.getElementById('evidence-count-badge');
  const flags = flagsOverride || gameState.currentEmailFlags;

  badge.textContent = `${flags.length} FLAG${flags.length !== 1 ? 'S' : ''}`;

  if (flags.length === 0) {
    list.innerHTML = readOnly
      ? '<div class="evidence-empty">No flags were placed on this one.</div>'
      : '<div class="evidence-empty">No flags placed yet. Activate 🚩 Flag Evidence to begin.</div>';
    return;
  }

  list.innerHTML = '';
  flags.forEach(flag => {
    const item = document.createElement('div');
    item.className = 'evidence-item';
    const removeBtn = readOnly ? '' : `<button class="evidence-remove-btn" onclick="removeFlag('${flag.type}')" title="Remove flag">✕</button>`;
    item.innerHTML = `
      <span class="evidence-item-icon">🚩</span>
      <span class="evidence-item-text">${(flag.text || '').length > 60 ? flag.text.slice(0,60)+'…' : (flag.text || '')}</span>
      <span class="evidence-item-type">${flag.label}</span>
      ${removeBtn}`;
    list.appendChild(item);
  });
}

// ═══════════════════════════════════════════════════════════
// RETURN TO INBOX
// ═══════════════════════════════════════════════════════════

function returnToInbox() {
  document.getElementById('email-detail-view').classList.remove('active');
  document.getElementById('email-list-view').classList.add('active');
  gameState.flagModeActive = false;
  gameState.reviewingEmailIdx = null;
  document.getElementById('flag-mode-btn').classList.remove('active');
  document.querySelector('.gmail-body').classList.remove('flag-mode-active');
}

// ═══════════════════════════════════════════════════════════
// REPORT DIALOG
// ═══════════════════════════════════════════════════════════

function showReportDialog() {
  if (gameState.reviewingEmailIdx !== null) {
    showToast('📁 This case is already closed.', '');
    return;
  }
  const flags = gameState.currentEmailFlags;
  const summary = document.getElementById('report-evidence-summary');

  if (flags.length === 0) {
    summary.innerHTML = `<div class="evidence-empty" style="padding:0">No evidence flags placed yet.</div>
      <p class="report-evidence-count">You can still report, but your score will reflect missing evidence.</p>`;
  } else {
    const items = flags.map(f =>
      `<div class="res-item">🚩 <span>${f.label}</span><span style="color:var(--text-muted);margin-left:auto;font-size:11px">${f.text.slice(0,40)}${f.text.length > 40 ? '…' : ''}</span></div>`
    ).join('');
    summary.innerHTML = items +
      `<div class="report-evidence-count">${flags.length} evidence flag${flags.length > 1 ? 's' : ''} placed</div>
      <div class="report-legit-warning">⚠ Note: If you submit this as <strong>Legitimate</strong> while flags are placed, this report scores <strong>0 points</strong> — flagging evidence and then clearing the email is a contradiction, not a real verdict.</div>`;
  }

  showOverlay('overlay-report');
}

function submitReport(isPhishing, autoSubmitted = false) {
  // Guard: a report can only ever be filed once per email. This should
  // already be unreachable from the UI (the Report button is hidden/disabled
  // once an email has a result), but the check protects against any stray
  // call path — e.g. an in-flight auto-submit timer firing after the
  // player already submitted manually.
  if (gameState.emailResults.some(r => r.emailIdx === gameState.currentEmail)) {
    closeOverlay('overlay-report');
    return;
  }

  closeOverlay('overlay-report');
  stopTimer();

  const email = EMAILS[gameState.currentEmail];
  const flagsSnapshot = gameState.currentEmailFlags.slice(); // full flag objects, for read-only review later
  const playerFlags = gameState.currentEmailFlags.map(f => f.type);
  const expectedEvidence = email.evidence;

  const correctDecision = (isPhishing === email.phishing);
  let emailScore = 0;
  const scoreBreakdown = []; // [{ label, points }] — the exact math shown to the player

  // Evidence scoring (only matters for phishing emails) — computed BEFORE
  // decision points, since a phishing decision only earns credit when it's
  // backed by actual evidence.
  let correctFlags = [];
  let incorrectFlags = [];
  let missedEvidence = [];

  if (email.phishing) {
    playerFlags.forEach(pf => {
      if (expectedEvidence.includes(pf)) correctFlags.push(pf);
      else incorrectFlags.push(pf);
    });
    missedEvidence = expectedEvidence.filter(e => !playerFlags.includes(e));
  } else if (playerFlags.length > 0) {
    // Legitimate email — any flag is incorrect
    incorrectFlags = playerFlags.slice();
  }

  // Special case: the player placed one or more evidence flags — meaning
  // they found something suspicious — but then submitted the email as
  // Legitimate anyway. That's a contradiction: flagging evidence and then
  // clearing the email doesn't reflect a real investigation, so it scores
  // a flat 0 — no decision credit, no flag credit, no flag penalties.
  const flaggedButMarkedLegit = (playerFlags.length > 0 && !isPhishing);

  if (flaggedButMarkedLegit) {
    emailScore = 0;
    scoreBreakdown.push({
      label: `⚠ ${playerFlags.length} flag${playerFlags.length > 1 ? 's' : ''} placed, then reported as Legitimate`,
      points: 0,
      note: 'Flagging evidence and then clearing the email cancels out — no points either way.'
    });
  } else {
    // Flag points
    correctFlags.forEach(pf => {
      emailScore += 25;
      gameState.evidenceFoundTotal++;
      const flagObj = flagsSnapshot.find(f => f.type === pf);
      scoreBreakdown.push({ label: `✅ Correct flag — ${flagObj ? flagObj.label : pf.replace('_', ' ').toUpperCase()}`, points: 25 });
    });
    incorrectFlags.forEach(pf => {
      emailScore -= 10;
      const flagObj = flagsSnapshot.find(f => f.type === pf);
      scoreBreakdown.push({ label: `⚠️ Incorrect flag — ${flagObj ? flagObj.label : pf.replace('_', ' ').toUpperCase()}`, points: -10 });
    });

    // Decision scoring
    if (correctDecision) {
      gameState.correctDecisions++;
      if (isPhishing) gameState.phishingDetected++;
      else gameState.legitimateDetected++;

      if (email.phishing) {
        // Correctly calling out phishing only earns decision points if it's
        // backed by at least one correct evidence flag — a correct guess
        // with no evidence found earns no decision points.
        if (correctFlags.length > 0) {
          emailScore += 100;
          scoreBreakdown.push({ label: '✓ Decision — Phishing correctly identified, backed by evidence', points: 100 });
        } else {
          scoreBreakdown.push({ label: '✓ Decision — correct guess, but no evidence found', points: 0 });
        }
      } else {
        // Correctly identifying a legitimate email — no evidence is needed,
        // so it's worth less than a fully-evidenced phishing call.
        emailScore += 50;
        scoreBreakdown.push({ label: '✓ Decision — Legitimate correctly identified', points: 50 });
      }
    } else {
      emailScore -= 50;
      scoreBreakdown.push({ label: '✗ Decision — incorrect verdict', points: -50 });
    }
  }

  gameState.score = Math.max(0, gameState.score + emailScore);

  // Store result
  const result = {
    emailId: email.id,
    emailIdx: gameState.currentEmail,
    isPhishing: email.phishing,
    playerDecision: isPhishing,
    correctDecision,
    playerFlags,
    flagsSnapshot,
    correctFlags,
    incorrectFlags,
    missedEvidence,
    score: emailScore,
    scoreBreakdown,
    flaggedButMarkedLegit,
    autoSubmitted
  };
  gameState.emailResults.push(result);

  updateHUD();
  showCapybaraResult(result, email);
}

// ═══════════════════════════════════════════════════════════
// CAPYBARA REVIEW
// ═══════════════════════════════════════════════════════════

function showCapybaraResult(result, email) {
  const { correctDecision, isPhishing, playerDecision, correctFlags, incorrectFlags, missedEvidence, score, scoreBreakdown, flaggedButMarkedLegit, autoSubmitted } = result;

  // Verdict
  const verdictTitle = document.getElementById('review-verdict-title');
  const decisionRow = document.getElementById('review-decision-row');

  // Auto-submit notice — the 2-minute email clock ran out before the player reported
  const autoNoteId = 'review-autosubmit-note';
  let autoNote = document.getElementById(autoNoteId);
  if (autoSubmitted) {
    if (!autoNote) {
      autoNote = document.createElement('div');
      autoNote.id = autoNoteId;
      autoNote.style.cssText = 'margin-bottom:12px;padding:10px 14px;border-radius:8px;background:rgba(255,82,82,0.1);border:1px solid rgba(255,82,82,0.3);color:#ff8a80;font-size:13px;font-weight:600;';
      decisionRow.parentNode.insertBefore(autoNote, decisionRow);
    }
    autoNote.textContent = '⏰ TIME EXPIRED — I submitted this one for you, based on your flags so far.';
    autoNote.classList.remove('hidden');
  } else if (autoNote) {
    autoNote.classList.add('hidden');
  }

  if (flaggedButMarkedLegit) {
    // Special case: flags were placed (evidence of suspicion) but the email
    // was still reported as Legitimate. This overrides the usual
    // correct/incorrect wording since the submission is contradictory.
    verdictTitle.textContent = '⚠ CONTRADICTORY REPORT';
    verdictTitle.className = 'incorrect';
    decisionRow.className = 'review-decision-row incorrect';
    decisionRow.innerHTML = `⚠ You placed evidence flags but then reported this email as Legitimate. Flagging something as suspicious and then clearing it doesn't reflect a real verdict, so this submission earned <strong>0 points</strong> — no decision credit, no flag credit.`;
  } else if (isPhishing) {
    if (correctDecision) {
      verdictTitle.textContent = '✓ PHISHING CONFIRMED';
      verdictTitle.className = 'correct';
      decisionRow.className = 'review-decision-row correct';
      if (correctFlags.length > 0) {
        decisionRow.innerHTML = '✓ Correct decision — You correctly identified this as a phishing email.';
      } else {
        decisionRow.className = 'review-decision-row incorrect';
        decisionRow.innerHTML = '⚠ Correct guess, no evidence — You called this phishing, but didn\'t flag any of the actual evidence, so no decision points were awarded. A right answer needs proof.';
      }
    } else {
      verdictTitle.textContent = '✗ MISSED PHISHING';
      verdictTitle.className = 'incorrect';
      decisionRow.className = 'review-decision-row incorrect';
      decisionRow.innerHTML = '✗ Incorrect — This was a phishing email. You marked it as legitimate.';
    }
  } else {
    if (correctDecision) {
      verdictTitle.textContent = '✓ LEGITIMATE EMAIL';
      verdictTitle.className = 'correct';
      decisionRow.className = 'review-decision-row correct';
      decisionRow.innerHTML = '✓ Correct — You correctly identified this as a legitimate email.';
    } else {
      verdictTitle.textContent = '✗ FALSE POSITIVE';
      verdictTitle.className = 'incorrect';
      decisionRow.className = 'review-decision-row incorrect';
      decisionRow.innerHTML = '✗ Incorrect — This was a legitimate email. You reported it as phishing.';
    }
  }

  // Correct flags
  const flagsList = document.getElementById('review-flags-list');
  flagsList.innerHTML = '';

  if (!flaggedButMarkedLegit && isPhishing && correctFlags.length > 0) {
    correctFlags.forEach(f => {
      const analysis = email.capybaraAnalysis[f];
      if (!analysis) return;
      const item = document.createElement('div');
      item.className = 'review-flag-item correct';
      item.innerHTML = `
        <div class="review-flag-icon">✅</div>
        <div>
          <div class="review-flag-title">CORRECT FLAG</div>
          <div class="review-flag-desc">${formatAnalysisText(analysis.correct)}</div>
        </div>`;
      flagsList.appendChild(item);
    });
  }

  // Legitimate email — correct identification
  if (!flaggedButMarkedLegit && !isPhishing && correctDecision) {
    const item = document.createElement('div');
    item.className = 'review-flag-item correct';
    item.innerHTML = `
      <div class="review-flag-icon">✅</div>
      <div>
        <div class="review-flag-title">GOOD INVESTIGATION</div>
        <div class="review-flag-desc">There was no suspicious sender, false urgency, or mismatched link. You correctly avoided flagging normal business communication.</div>
      </div>`;
    flagsList.appendChild(item);
  }

  // Incorrect flags
  const incorrectEl = document.getElementById('review-incorrect-flags');
  incorrectEl.innerHTML = '';
  if (incorrectFlags.length > 0) {
    incorrectEl.classList.remove('hidden');
    incorrectFlags.forEach(f => {
      const item = document.createElement('div');
      item.className = 'review-flag-item incorrect';
      item.innerHTML = `
        <div class="review-flag-icon">⚠️</div>
        <div>
          <div class="review-flag-title">INCORRECT FLAG — ${f.replace('_', ' ').toUpperCase()}</div>
          <div class="review-flag-desc">${isPhishing
            ? 'This was not a recognised red flag for this email. Focus on fake sender addresses, false urgency, and suspicious links.'
            : 'This is a legitimate email. This element does not indicate phishing. Look for specific, concrete indicators, not general content.'
          }</div>
        </div>`;
      incorrectEl.appendChild(item);
    });
  } else {
    incorrectEl.classList.add('hidden');
  }

  // Missed evidence
  const missedEl = document.getElementById('review-missed');
  missedEl.innerHTML = '';
  if (missedEvidence.length > 0) {
    missedEl.classList.remove('hidden');
    missedEvidence.forEach(f => {
      const analysis = email.capybaraAnalysis[f];
      if (!analysis) return;
      const item = document.createElement('div');
      item.className = 'review-flag-item missed';
      item.innerHTML = `
        <div class="review-flag-icon">🚩</div>
        <div>
          <div class="review-flag-title">MISSED EVIDENCE</div>
          <div class="review-flag-desc">${formatAnalysisText(analysis.missed)}</div>
        </div>`;
      missedEl.appendChild(item);
    });
  } else {
    missedEl.classList.add('hidden');
  }

  // Score breakdown — shows the exact math behind the total, line by line,
  // for every flag placed plus the decision.
  const breakdownEl = document.getElementById('review-score-breakdown');
  breakdownEl.innerHTML = '';
  if (scoreBreakdown && scoreBreakdown.length > 0) {
    scoreBreakdown.forEach(row => {
      const line = document.createElement('div');
      line.className = 'score-breakdown-row' + (row.points > 0 ? ' positive' : row.points < 0 ? ' negative' : ' neutral');
      line.innerHTML = `
        <span class="score-breakdown-label">${row.label}</span>
        <span class="score-breakdown-points">${row.points > 0 ? '+' : ''}${row.points}</span>`;
      breakdownEl.appendChild(line);
      if (row.note) {
        const note = document.createElement('div');
        note.className = 'score-breakdown-note';
        note.textContent = row.note;
        breakdownEl.appendChild(note);
      }
    });
    const totalRow = document.createElement('div');
    totalRow.className = 'score-breakdown-row total';
    totalRow.innerHTML = `<span class="score-breakdown-label">TOTAL</span><span class="score-breakdown-points">${score >= 0 ? '+' : ''}${score}</span>`;
    breakdownEl.appendChild(totalRow);
  }

  // Score
  const scoreVal = document.getElementById('review-score-value');
  scoreVal.textContent = (score >= 0 ? '+' : '') + score;
  scoreVal.style.color = score > 0 ? 'var(--accent-green)' : score < 0 ? 'var(--accent-red)' : 'var(--accent-cyan)';

  // Next button label
  const nextBtn = document.getElementById('btn-next-email');
  const isLast = gameState.currentEmail >= EMAILS.length - 1;
  nextBtn.textContent = isLast ? '📊 VIEW FINAL RESULTS' : 'NEXT EMAIL →';

  showOverlay('overlay-review');
}

function formatAnalysisText(text) {
  return text.replace(/\n/g, '<br>');
}

// ═══════════════════════════════════════════════════════════
// NEXT EMAIL / FINISH
// ═══════════════════════════════════════════════════════════

function nextEmail() {
  closeOverlay('overlay-review');
  stopTimer();

  if (gameState.currentEmail >= EMAILS.length - 1) {
    finishMission();
    return;
  }

  gameState.currentEmail++;
  gameState.currentEmailFlags = [];
  gameState.flagModeActive = false;
  gameState.reviewingEmailIdx = null;

  renderEmailList();
  updateHUD();

  // Switch to list view if in detail view
  document.getElementById('email-detail-view').classList.remove('active');
  document.getElementById('email-list-view').classList.add('active');

  showToast(`📧 Email ${gameState.currentEmail + 1} of ${EMAILS.length} — investigate next.`, 'success');

  // Emails 1–3: no clock. Emails 4 & 5: Capybara starts a strict,
  // independent 2-minute deadline for each — this is the only timed part.
  if (isFinalStretchEmail(gameState.currentEmail)) {
    if (!gameState.finalStretchWarned) {
      gameState.finalStretchWarned = true;
      showFinalStretchWarning(); // starts the timer once the player clicks "I'm Ready"
    } else {
      showToast('⚡ Final email — your 2-minute clock just started!', 'error');
      startFinalStretchTimer();
    }
  } else {
    renderUntimedHUD();
  }
}

// ═══════════════════════════════════════════════════════════
// FINAL RESULTS
// ═══════════════════════════════════════════════════════════

function finishMission() {
  stopTimer();
  gameState.phase = 'results';

  const totalEvidence = EMAILS.reduce((sum, e) => sum + e.evidence.length, 0);

  // "Final Stretch" stat: how many of the two timed emails (4 & 5) were
  // submitted by the player before their clock ran out, vs. auto-submitted.
  const finalStretchResults = gameState.emailResults.filter(r => isFinalStretchEmail(r.emailIdx));
  const onTimeCount = finalStretchResults.filter(r => !r.autoSubmitted).length;
  const finalStretchText = finalStretchResults.length === 0
    ? '—'
    : `${onTimeCount} / ${finalStretchResults.length} On Time`;

  // Calculate rank — max achievable score must match the real scoring rules:
  // phishing emails are worth 100 decision points, legitimate emails only 50.
  const maxDecisionPoints = EMAILS.reduce((sum, e) => sum + (e.phishing ? 100 : 50), 0);
  const maxScore = maxDecisionPoints + totalEvidence * 25;
  const pct = gameState.score / maxScore;
  let rank, rankClass, rankLabel;
  if (pct >= 0.95) { rank = 'S'; rankClass = 'rank-s'; rankLabel = 'CYBER DETECTIVE'; }
  else if (pct >= 0.85) { rank = 'A'; rankClass = ''; rankLabel = 'EXCELLENT DETECTIVE'; }
  else if (pct >= 0.70) { rank = 'B'; rankClass = 'rank-b'; rankLabel = 'GOOD DETECTIVE'; }
  else if (pct >= 0.50) { rank = 'C'; rankClass = 'rank-c'; rankLabel = 'NEEDS MORE TRAINING'; }
  else { rank = 'D'; rankClass = 'rank-d'; rankLabel = 'INVESTIGATION FAILED'; }

  document.getElementById('res-emails').textContent = `${gameState.emailResults.length} / ${EMAILS.length}`;
  document.getElementById('res-decisions').textContent = `${gameState.correctDecisions} / ${EMAILS.length}`;
  document.getElementById('res-evidence').textContent = `${gameState.evidenceFoundTotal} / ${totalEvidence}`;
  document.getElementById('res-phishing').textContent = gameState.phishingDetected;
  document.getElementById('res-legit').textContent = gameState.legitimateDetected;
  document.getElementById('res-time').textContent = finalStretchText;
  document.getElementById('res-final-score').textContent = gameState.score;
  document.getElementById('results-rank').textContent = rank;
  document.getElementById('results-rank').className = `results-rank-circle ${rankClass}`;
  document.getElementById('results-rank-label').textContent = rankLabel;

  showOverlay('overlay-results');
}

// ═══════════════════════════════════════════════════════════
// PLAY AGAIN
// ═══════════════════════════════════════════════════════════

function playAgain() {
  // Reset state
  stopTimer();
  gameState.phase = 'welcome';
  gameState.currentEmail = 0;
  gameState.score = 0;
  gameState.correctDecisions = 0;
  gameState.phishingDetected = 0;
  gameState.legitimateDetected = 0;
  gameState.evidenceFoundTotal = 0;
  gameState.emailResults = [];
  gameState.currentEmailFlags = [];
  gameState.flagModeActive = false;
  gameState.timeRemaining = 0;
  gameState.missionStarted = false;
  gameState.finalStretchWarned = false;
  gameState.reviewingEmailIdx = null;
  gameState.trainingSlide = 0;
  gameState.demoStep = 0;
  gdemoStep = 0;
  gdemoFlags = [];

  // Close apps
  ['gmail', 'browser'].forEach(a => {
    appState[a].open = false;
    appState[a].minimized = false;
    appState[a].maximized = false;
    const w = document.getElementById(`win-${a}`);
    w.classList.add('hidden');
    w.classList.remove('maximized', 'focused', 'minimized');
  });
  updateTaskbar();

  document.getElementById('hud').classList.add('hidden');
  document.getElementById('hud-timer').textContent = '03:00';
  document.getElementById('hud-timer').className = 'hud-value timer-normal';

  // Reset email list view
  document.getElementById('email-detail-view').classList.remove('active');
  document.getElementById('email-list-view').classList.add('active');

  // Reset browser
  document.getElementById('browser-content').innerHTML = `
    <div class="browser-home">
      <div class="browser-home-logo">🌐 CyberBrowser</div>
      <p class="browser-home-sub">Enter a URL to begin browsing</p>
    </div>`;
  document.getElementById('browser-url-display').textContent = 'about:blank';
  document.getElementById('browser-security').textContent = '⚠️ Not Secure';
  document.getElementById('browser-security').className = 'browser-security-indicator';

  showOverlay('overlay-welcome');
  vnInit();
}

// ═══════════════════════════════════════════════════════════
// BROWSER
// ═══════════════════════════════════════════════════════════

let browserHistory = [];
let browserCurrentIdx = -1;

function navigateBrowser(url) {
  const urlDisplay = document.getElementById('browser-url-display');
  const content = document.getElementById('browser-content');
  const security = document.getElementById('browser-security');

  urlDisplay.textContent = url;
  browserHistory = browserHistory.slice(0, browserCurrentIdx + 1);
  browserHistory.push(url);
  browserCurrentIdx = browserHistory.length - 1;

  // Always show as not-secure for the game's simulated phishing sites
  security.textContent = '⚠️ Not Secure';
  security.className = 'browser-security-indicator';

  if (FAKE_SITES[url]) {
    content.innerHTML = FAKE_SITES[url];
  } else {
    content.innerHTML = `
      <div style="padding:40px;font-family:Arial;color:#333;text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">🚫</div>
        <h2 style="color:#333;">Site Not Found</h2>
        <p style="color:#666;margin-top:8px;">The address <strong>${url}</strong> could not be reached.</p>
      </div>`;
  }
}

function browserBack() {
  if (browserCurrentIdx > 0) {
    browserCurrentIdx--;
    const url = browserHistory[browserCurrentIdx];
    navigateBrowser(url);
  }
}

function browserRefresh() {
  if (browserCurrentIdx >= 0) {
    navigateBrowser(browserHistory[browserCurrentIdx]);
  }
}

function returnToGmail() {
  openApp('gmail');
  focusWindow('gmail');
}

// ═══════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════

let toastTimeout = null;

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ═══════════════════════════════════════════════════════════
// EVIDENCE SCORING HELPERS
// ═══════════════════════════════════════════════════════════

function checkEvidence(email, playerFlags) {
  const correct = playerFlags.filter(f => email.evidence.includes(f));
  const incorrect = playerFlags.filter(f => !email.evidence.includes(f));
  const missed = email.evidence.filter(e => !playerFlags.includes(e));
  return { correct, incorrect, missed };
}

function calculateScore(correctDecision, correct, incorrect, isPhishing = true, penaltyPerIncorrect = 10) {
  let s = 0;
  if (correctDecision) {
    if (isPhishing) {
      // Phishing decision only pays out if backed by at least one correct flag.
      s += correct.length > 0 ? 100 : 0;
    } else {
      s += 50;
    }
  } else {
    s -= 50;
  }
  s += correct.length * 25;
  s -= incorrect.length * penaltyPerIncorrect;
  return s;
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

// Show VN intro on load
window.addEventListener('DOMContentLoaded', () => {
  showOverlay('overlay-welcome');
  renderEmailList();
  vnInit();
});
