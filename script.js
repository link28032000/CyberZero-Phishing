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
    sender: { name: 'BPI Security', address: 'security@bpi-secure-login.example' },
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
        destination: 'https://bpi-account-security.example/login',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Thank you for banking with BPI.' },
      { type: 'p', text: 'Regards,\nBPI Security Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nThe domain <code>bpi-secure-login.example</code> is not a legitimate BPI domain. Real BPI emails come from <code>@bpi.com.ph</code>. Attackers register similar-sounding domains to trick victims.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender address was <code>security@bpi-secure-login.example</code>. This is not a real BPI domain. Always check the actual email address, not just the display name.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nThe "30 minutes" deadline is a classic social engineering pressure tactic. Attackers create panic to prevent careful thinking.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe email threatened account suspension within 30 minutes. This extreme time pressure is a hallmark of phishing — it forces the victim to act without thinking.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe button links to <code>bpi-account-security.example</code>, not BPI\'s real website. The domain sounds official but is completely unrelated to BPI.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Verify" button leads to <code>bpi-account-security.example</code>. Always hover over or inspect links before clicking — the destination reveals the deception.'
      }
    }
  },
  {
    id: 2,
    sender: { name: 'HR Department', address: 'hr@company.example' },
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
      { type: 'p', text: 'If you have any questions, feel free to reach out to the HR team directly at hr@company.example.' },
      { type: 'p', text: 'Thank you,\nHR Department\nCompany Inc.' }
    ],
    capybaraAnalysis: {}
  },
  {
    id: 3,
    sender: { name: 'PayPal Security', address: 'security@paypa1-security.example' },
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
        destination: 'https://paypal-account-check.example/login',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Thank you for using PayPal.' },
      { type: 'p', text: 'Regards,\nPayPal Security Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nNotice the domain: <code>paypa1-security.example</code> uses the number "1" instead of the letter "l" in "PayPal". This is called a typosquat domain — a common attacker trick.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender was <code>security@paypa1-security.example</code>. Look closely — "paypa<strong>1</strong>" uses the digit 1, not the letter l. This subtle swap is a typosquat phishing technique.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nThe "24 hours" deadline and threat of permanent closure is engineered to create panic. Legitimate companies give adequate time and never threaten instant loss.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe email threatened permanent account closure within 24 hours. This is a pressure tactic to prevent you from verifying the email\'s legitimacy before acting.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe link destination <code>paypal-account-check.example</code> is not owned by PayPal. The real PayPal uses <code>paypal.com</code>.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Restore My Account" button leads to <code>paypal-account-check.example</code>. Always check actual link destinations — not the button label text.'
      }
    }
  },
  {
    id: 4,
    sender: { name: 'IT Department', address: 'it@company.example' },
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
      { type: 'p', text: 'We apologize for any inconvenience. For urgent matters during the maintenance window, please contact the on-call IT team at it-oncall@company.example.' },
      { type: 'p', text: 'Thank you for your understanding.\nIT Department' }
    ],
    capybaraAnalysis: {}
  },
  {
    id: 5,
    sender: { name: 'GCash Rewards', address: 'noreply@gcash-rewards.example' },
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
        destination: 'https://gcash-claim-rewards.example/verify',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Do not share this link. It is unique to your account.' },
      { type: 'p', text: 'Regards,\nGCash Rewards Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nThe domain <code>gcash-rewards.example</code> is not GCash\'s official domain. GCash communications come from <code>@gcash.com</code>. Reward scams always use unofficial domains.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender domain was <code>gcash-rewards.example</code>. This is not an official GCash domain. Reward scams often create plausible-looking domains to fool recipients.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nA "2-hour expiry" on a supposed reward is a classic scam pressure tactic. Legitimate rewards do not expire within hours and do not threaten immediate forfeiture.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe 2-hour countdown before the reward "expires" is a pressure tactic. Scammers use short deadlines to stop you from pausing and thinking critically.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe claim link goes to <code>gcash-claim-rewards.example</code> — not GCash\'s real website. This is a fake site designed to steal your login credentials.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Claim My Reward" button leads to <code>gcash-claim-rewards.example</code>. The real GCash website is <code>gcash.com</code>. Always verify destinations before clicking.'
      }
    }
  }
];

// Perfect-run total: phishing emails are worth 100 (decision) + 25 per clue;
// legitimate emails are a flat 50 (no evidence to find). Used by the HUD
// and the final results screen so both stay in sync automatically.
const MAX_SCORE = EMAILS.reduce((sum, e) => sum + (e.phishing ? 100 + e.evidence.length * 25 : 50), 0);

// Emails already sent by the player — viewable in the Sent folder
const SENT_EMAILS = [
  {
    id: 101,
    to: 'hr@company.example',
    subject: 'Re: September Employee Benefits Update',
    time: '9:12 AM',
    preview: 'Thanks for the update — reviewed and confirmed on my end...',
    body: [
      { type: 'p', text: 'Hi HR Department,' },
      { type: 'p', text: 'Thanks for the update — I reviewed the September benefits information through the normal internal resources. No issues on my end.' },
      { type: 'p', text: 'Regards,\nCyber Detective' }
    ]
  },
  {
    id: 102,
    to: 'it-security@company.example',
    subject: 'Suspicious emails flagged this week',
    time: '10:47 AM',
    preview: 'Sharing a couple of phishing samples I caught for awareness...',
    body: [
      { type: 'p', text: 'Hi IT Security Team,' },
      { type: 'p', text: 'Sharing a couple of phishing samples I caught this week — fake sender domains, urgency pressure tactics, and mismatched links. Recommend circulating these for staff awareness training.' },
      { type: 'p', text: 'Regards,\nCyber Detective' }
    ]
  }
];

// Fake websites for the browser
const FAKE_SITES = {
  'https://bpi-account-security.example/login': `
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
        <p style="font-size:11px;color:#888;margin-top:16px;text-align:center;">bpi-account-security.example — NOT the real BPI website</p>
      </div>
    </div>`,
  'https://paypal-account-check.example/login': `
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
        <p style="font-size:11px;color:#888;margin-top:16px;text-align:center;">paypal-account-check.example — NOT the real PayPal website</p>
      </div>
    </div>`,
  'https://gcash-claim-rewards.example/verify': `
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
        <p style="font-size:11px;color:#888;margin-top:16px;text-align:center;">gcash-claim-rewards.example — NOT the real GCash website</p>
      </div>
    </div>`
};

// The browser's default "home" page — a mock Google search homepage
const BROWSER_HOME_HTML = `
  <div class="browser-home">
    <div class="google-logo"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></div>
    <div class="google-search-box">
      <span class="google-search-icon">🔍</span>
      <input type="text" id="browser-home-search" class="google-search-input" placeholder="Search Google or type a URL" autocomplete="off" spellcheck="false" onkeydown="handleHomeSearchKey(event)" />
    </div>
    <div class="google-search-actions">
      <button class="google-btn" onclick="submitHomeSearch()">Google Search</button>
    </div>
  </div>`;

// Training slides content — only the demo-ready slide remains (others moved to VN intro)
const TRAINING_SLIDES = [
  {
    title: 'Ready for the Demo? 🎬',
    content: `<p>Before your mission begins, I'll walk you through a real example.</p>
    <p style="margin-top:12px;">I'll show you exactly how to spot the three red flags in a phishing email.</p>
    <p style="margin-top:12px;">Watch closely — then it's your turn.</p>`
  }
];

// ═══════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════

const gameState = {
  phase: 'welcome',         // welcome | training | demo | mission | results | malware
  currentEmail: 0,          // index into EMAILS
  score: 0,
  correctDecisions: 0,
  phishingDetected: 0,
  legitimateDetected: 0,
  evidenceFoundTotal: 0,
  trainingSlide: 0,
  demoStep: 0,
  flagModeActive: false,
  currentEmailFlags: [],    // { id, type, text, label }
  emailResults: [],         // per-email result records
  pendingLinkUrl: null,
  pendingLinkFlagId: null,
  pendingLinkFlagType: null,
  currentFolder: 'inbox',   // inbox | sent | trash
  trashedSentIds: [],       // ids of SENT_EMAILS moved to Trash (only sent mail can be deleted)
  malwareQuarantined: 0,
  malwareFalsePositives: 0,
  selectedFolderFileId: null,
  activeScanFileId: null
};

const appState = {
  gmail: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  browser: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  folder: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  antivirus: { open: false, minimized: false, maximized: false, hasBeenPositioned: false }
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

  // First time this app is opened, center it on screen so it isn't
  // hidden behind the Detective's Notes sticky note in the bottom-right corner.
  if (!state.hasBeenPositioned) {
    centerWindow(appName);
    state.hasBeenPositioned = true;
  }
}

// Centers a window on the desktop, nudged left so the sticky note
// (which now lives in the bottom-right corner) never overlaps it.
function centerWindow(appName) {
  const win = document.getElementById(`win-${appName}`);
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  if (!win || !desktop) return;

  const w = win.offsetWidth || 800;
  const h = win.offsetHeight || 560;
  const viewportW = desktop.clientWidth;
  const viewportH = desktop.clientHeight - (taskbar ? taskbar.offsetHeight : 48);

  const STICKY_NOTE_CLEARANCE = 280; // sticky note sits ~24-256px from the right

  let left = Math.round((viewportW - w) / 2);
  let top = Math.round((viewportH - h) / 2);

  left = Math.min(left, Math.max(24, viewportW - STICKY_NOTE_CLEARANCE - w));
  top = Math.max(24, top);

  win.style.left = left + 'px';
  win.style.top = top + 'px';
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
  ['gmail', 'browser', 'folder', 'antivirus'].forEach(appName => {
    const btn = document.getElementById(`taskbar-${appName}`);
    if (!btn) return;
    const state = appState[appName];
    const win = document.getElementById(`win-${appName}`);

    btn.classList.remove('open', 'active', 'minimized');
    if (state.open) {
      btn.classList.add('open');
      if (state.minimized) {
        btn.classList.add('minimized');
      } else if (win && win.classList.contains('focused')) {
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
    text: "The city's digital safety depends on agents like you. Take your time, trust the evidence, and give your honest verdict.",
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
    label: 'Welcome',
    objective: 'Meet your instructor',
    speech: `<strong>Hey there, Detective! 🕵️</strong><br><br>I'm <strong>Detective Zero</strong>. I'll walk you through <strong>2 emails</strong> — one <span style="color:#ff6b6b">phishing</span>, one <span style="color:#69db7c">legitimate</span> — so you know what to look for.`,
    btn: "Let's Begin →",
    action: null
  },
  {
    step: 1,
    label: 'Read Phishing',
    objective: 'Read the email before judging it',
    speech: `📧 <strong>READ EVERYTHING FIRST</strong><br><br>Never judge by the subject alone. Check the <strong>sender</strong>, <strong>subject</strong>, and <strong>body</strong> first.<br><br>This one already feels rushed and aggressive — that's a clue.`,
    btn: 'Show Me the Red Flags →',
    action: 'read'
  },
  {
    step: 2,
    label: 'Flag Sender',
    objective: 'Flag the fake sender address',
    speech: `🔴 <strong>RED FLAG #1 — FAKE SENDER</strong><br><br><em>security@bpi-secure-login.example</em> isn't the real bank domain (<em>@bpi.com.ph</em>) — it's a lookalike built to fool you.<br><br>First, click 🚩 <strong>Flag Evidence</strong> to turn on flag mode, then flag it →`,
    btn: 'Flag It & Continue →',
    action: 'flag-sender'
  },
  {
    step: 3,
    label: 'Flag Urgency',
    objective: 'Flag the false urgency tactic',
    speech: `⚡ <strong>RED FLAG #2 — FALSE URGENCY</strong><br><br>"30 minutes or suspended" is pressure meant to stop you thinking. Real banks don't do 30-minute countdowns.<br><br>Flagging it →`,
    btn: 'Flag It & Continue →',
    action: 'flag-urgency'
  },
  {
    step: 4,
    label: 'Inspect Link',
    objective: 'Reveal the link\u2019s real destination',
    speech: `🔗 <strong>RED FLAG #3 — INSPECT BEFORE YOU CLICK</strong><br><br>"Verify My BPI Account" is just a label — it can say anything. Let's reveal where it actually goes →`,
    btn: 'Inspect the Link →',
    action: 'inspect-link'
  },
  {
    step: 5,
    label: 'Flag Link',
    objective: 'Flag the mismatched link',
    speech: `🕵️ <strong>CAUGHT IT.</strong><br><br>The real destination is <em>bpi-account-security.example</em> — a fake login page built to steal credentials.<br><br>Flagging it as evidence #3 →`,
    btn: 'Flag It & Continue →',
    action: 'flag-link'
  },
  {
    step: 6,
    label: 'Report Phishing',
    objective: 'Submit the verdict: Phishing',
    speech: `✅ <strong>3 FLAGS PLACED — EVIDENCE COMPLETE</strong><br><br>→ Fake sender<br>→ False urgency<br>→ Suspicious link<br><br>Time to report this as <strong>Phishing</strong>.`,
    btn: 'Submit Report →',
    action: 'report'
  },
  {
    step: 7,
    label: 'Legit Email',
    objective: 'Learn to recognize a safe email',
    speech: `🛡️ <strong>NOT EVERYTHING IS A THREAT</strong><br><br>Flagging every email is just as useless as flagging none. Here's a routine HR email — let's check it for safety signals instead →`,
    btn: 'Show Legit Email →',
    action: 'show-legit'
  },
  {
    step: 8,
    label: 'Report Legit',
    objective: 'Submit the verdict: Legitimate',
    speech: `✅ <strong>THE 5-POINT LEGITIMACY CHECK</strong><br><br>✔ Matching domain ✔ No urgency ✔ No shady links<br>✔ Routine content ✔ No credential requests<br><br>All clear — marking it <strong>Legitimate</strong>.`,
    btn: 'Mark as Legitimate →',
    action: 'check-legit'
  },
  {
    step: 9,
    label: 'Briefing',
    objective: 'Get ready for your real mission',
    speech: `🏆 <strong>TRAINING COMPLETE, DETECTIVE!</strong><br><br>🔎 <strong>Spot phishing</strong> — fake senders, pressure tactics, bad links<br>🛡️ <strong>Recognize legit</strong> — verified domain, no urgency<br><br><strong>Your mission:</strong> 5 real emails. Read, flag the evidence, and submit your verdict.`,
    btn: 'START MY MISSION →',
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

function skipDemo() {
  hideAllOverlays();
  startMission();
  showToast('⏭ Demo skipped — mission started!', 'success');
}

function resetDemoVisuals() {
  // Cursor
  const cursor = document.getElementById('gdemo-cursor');
  cursor.className = 'gdemo-cursor';

  // Sender
  const sender = document.getElementById('gdemo-sender');
  if (sender) { sender.className = 'gdemo-meta-val'; }

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
}

function renderDemoStep(stepIdx) {
  const script = DEMO_SCRIPT[stepIdx];
  if (!script) return;

  // Update speech bubble with typewriter effect, prefixed by a clear objective banner
  const objectiveHtml = `<div class="gdemo-objective"><span class="gdemo-objective-tag">STEP ${stepIdx + 1}/${DEMO_SCRIPT.length} · ${script.label}</span><span class="gdemo-objective-goal">🎯 ${script.objective}</span></div>`;
  setDemoSpeech(objectiveHtml + script.speech);

  // Update proceed button
  document.getElementById('btn-demo-next').textContent = script.btn;
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
    // 1. Cursor visibly clicks the Flag Evidence button to turn it on
    const flagBtn = document.getElementById('gdemo-flag-btn');
    animateCursorTo('gdemo-flag-btn', () => {
      setTimeout(() => {
        clickEffect(() => {
          flagBtn.classList.add('active');

          // 2. Cursor to sender
          setTimeout(() => {
            animateCursorTo('gdemo-sender', () => {
              // 3. Click & flag
              setTimeout(() => {
                clickEffect(() => {
                  const sender = document.getElementById('gdemo-sender');
                  sender.classList.add('gdemo-flagged');
                  gdemoFlags.push({ icon: '🚩', label: 'FAKE SENDER', text: 'security@bpi-secure-login.example' });
                  updateDemoEvidencePanel(gdemoFlags);
                  hideCursor();
                  setTimeout(re, 500);
                });
              }, 400);
            });
          }, 300);
        });
      }, 400);
    });

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
          gdemoFlags.push({ icon: '🚩', label: 'SUSPICIOUS LINK', text: 'https://bpi-account-security.example/login' });
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

  // Point precisely at the target with fingertip aligned, steady and fixed
  const left = tRect.left - wsRect.left + (tRect.width / 2) - 12;
  const top = tRect.top - wsRect.top + (tRect.height / 2);

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
  // Fixed steady pointer: only apply subtle scale tap without changing emoji between up and down
  cursor.style.transform = 'scale(0.85)';
  setTimeout(() => {
    cursor.style.transform = 'scale(1)';
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
  gameState.currentEmail = 0;
  gameState.score = 0;
  gameState.correctDecisions = 0;
  gameState.phishingDetected = 0;
  gameState.legitimateDetected = 0;
  gameState.evidenceFoundTotal = 0;
  gameState.emailResults = [];
  gameState.currentFolder = 'inbox';
  gameState.trashedSentIds = [];

  hideAllOverlays();
  renderEmailList();
  updateHUD();

  document.getElementById('hud').classList.remove('hidden');
  openApp('gmail');

  showToast('🕵️ Mission started! Investigate your inbox.', 'success');

  // Pop up the scoring sticky note beside the desktop once the demo is done
  setTimeout(showStickyNote, 700);
}

// ═══════════════════════════════════════════════════════════
// STICKY NOTE — Scoring Reminder
// ═══════════════════════════════════════════════════════════

function showStickyNote() {
  const note = document.getElementById('sticky-note');
  const icon = document.getElementById('icon-notes');
  if (!note) return;

  note.classList.remove('hidden');
  note.classList.remove('sticky-note-pop');
  // Force reflow so the pop-in animation replays every time it's shown
  void note.offsetWidth;
  note.classList.add('sticky-note-pop');

  if (icon) icon.classList.remove('hidden');
}

function closeStickyNote() {
  const note = document.getElementById('sticky-note');
  if (note) note.classList.add('hidden');
}

function toggleStickyNote() {
  const note = document.getElementById('sticky-note');
  if (!note) return;
  if (note.classList.contains('hidden')) {
    showStickyNote();
  } else {
    closeStickyNote();
  }
}

// Drag-to-move + click-to-rename for the sticky note
function initStickyNote() {
  const note = document.getElementById('sticky-note');
  const handles = [
    document.getElementById('sticky-note-drag-handle'),
    document.getElementById('sticky-note-drag-handle-2')
  ].filter(Boolean);
  if (!note || handles.length === 0) return;

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function startDrag(e) {
    const parent = note.offsetParent || document.getElementById('desktop');
    const parentRect = parent.getBoundingClientRect();
    const noteRect = note.getBoundingClientRect();

    // The note starts out anchored with only `bottom`/`right` in CSS (no
    // `top`), with its height auto-computed from its content. Before we
    // can drag it we need to switch it to `top`-anchored positioning —
    // but if we only clear `bottom` without also freezing `top`, the note
    // has neither anchor for an instant and snaps to its static in-flow
    // position (up near the desktop icons), which looks like it suddenly
    // jumped. Freeze top and left first so the switch is visually a
    // no-op. Height is intentionally left alone (no explicit height is
    // ever set) so the note always keeps its natural, default height.
    note.style.top = (noteRect.top - parentRect.top) + 'px';
    note.style.left = (noteRect.left - parentRect.left) + 'px';
    note.style.bottom = 'auto';

    dragging = true;
    offsetX = e.clientX - noteRect.left;
    offsetY = e.clientY - noteRect.top;
    note.classList.add('dragging');
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const parent = note.offsetParent || document.getElementById('desktop');
    const parentRect = parent.getBoundingClientRect();

    let left = e.clientX - parentRect.left - offsetX;
    let top = e.clientY - parentRect.top - offsetY;

    left = Math.max(0, Math.min(left, parentRect.width - note.offsetWidth));
    top = Math.max(0, Math.min(top, parentRect.height - note.offsetHeight));

    note.style.left = left + 'px';
    note.style.top = top + 'px';
  }

  function endDrag() {
    if (dragging) {
      dragging = false;
      note.classList.remove('dragging');
    }
  }

  handles.forEach(h => h.addEventListener('pointerdown', startDrag));
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
}

// ═══════════════════════════════════════════════════════════
// HUD
// ═══════════════════════════════════════════════════════════

function updateHUD() {
  const hudType = document.getElementById('hud-type-label');
  const hudCount = document.getElementById('hud-email-count');
  const hudScore = document.getElementById('hud-score');

  if (gameState.phase === 'malware') {
    if (hudType) hudType.textContent = 'MALWARE';
    if (hudCount) hudCount.textContent = `${gameState.malwareQuarantined} / ${TOTAL_MALWARE_COUNT}`;
  } else {
    if (hudType) hudType.textContent = 'EMAIL';
    const activeMissionIdx = EMAILS.findIndex(e => !gameState.emailResults.some(r => r.emailId === e.id));
    const currentNum = activeMissionIdx === -1 ? EMAILS.length : activeMissionIdx + 1;
    if (hudCount) hudCount.textContent = `${currentNum} / ${EMAILS.length}`;
  }
  if (hudScore) hudScore.textContent = `${gameState.score}`;
}

// ═══════════════════════════════════════════════════════════
// GMAIL — EMAIL LIST
// ═══════════════════════════════════════════════════════════

function switchGmailFolder(folder) {
  gameState.currentFolder = folder;

  document.querySelectorAll('.gmail-nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById(`nav-${folder}`);
  if (navEl) navEl.classList.add('active');

  const titles = { inbox: 'Inbox', sent: 'Sent', trash: 'Trash' };
  const titleEl = document.getElementById('gmail-toolbar-title');
  if (titleEl) titleEl.textContent = titles[folder] || 'Inbox';

  // Always land back on the list view when switching folders
  document.getElementById('sent-detail-view').classList.remove('active');
  document.getElementById('email-detail-view').classList.remove('active');
  document.getElementById('email-list-view').classList.add('active');

  renderEmailList();
}

function updateFolderCounts() {
  const sentBadge = document.getElementById('sent-count');
  const trashBadge = document.getElementById('trash-count');
  if (sentBadge) {
    const activeCount = SENT_EMAILS.filter(e => !gameState.trashedSentIds.includes(e.id)).length;
    sentBadge.textContent = activeCount;
  }
  if (trashBadge) {
    trashBadge.textContent = gameState.trashedSentIds.length;
  }
}

function renderEmailList() {
  const folder = gameState.currentFolder || 'inbox';
  updateFolderCounts();

  if (folder === 'sent') return renderSentOrTrashList(SENT_EMAILS.filter(e => !gameState.trashedSentIds.includes(e.id)), 'sent');
  if (folder === 'trash') return renderSentOrTrashList(SENT_EMAILS.filter(e => gameState.trashedSentIds.includes(e.id)), 'trash');

  const list = document.getElementById('email-list');
  list.innerHTML = '';

  const activeMissionIdx = EMAILS.findIndex(e => !gameState.emailResults.some(r => r.emailId === e.id));

  EMAILS.forEach((email, idx) => {
    const result = gameState.emailResults.find(r => r.emailId === email.id);
    const isCurrent = (activeMissionIdx !== -1 && idx === activeMissionIdx);
    const isRead = !!result;

    const item = document.createElement('div');
    item.className = `email-list-item ${isRead ? 'read' : 'unread'}`;
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
// GMAIL — SENT & TRASH
// ═══════════════════════════════════════════════════════════

function renderSentOrTrashList(items, folder) {
  const list = document.getElementById('email-list');
  list.innerHTML = '';

  if (items.length === 0) {
    list.innerHTML = `<div class="email-empty-state">${folder === 'trash' ? '🗑 Trash is empty' : '📤 No sent mail'}</div>`;
    return;
  }

  items.forEach((email, idx) => {
    const initial = 'D'; // Detective — the player is the sender
    const avatarColors = ['#5c6bc0', '#00897b'];
    const avatarColor = avatarColors[idx % avatarColors.length];

    const item = document.createElement('div');
    item.className = 'email-list-item read';

    let actionBtn = '';
    if (folder === 'sent') {
      actionBtn = `<button class="email-action-btn email-delete-btn" title="Delete" onclick="event.stopPropagation(); deleteSentEmail(${email.id})">🗑</button>`;
    } else {
      actionBtn = `<button class="email-action-btn email-restore-btn" title="Restore" onclick="event.stopPropagation(); restoreSentEmail(${email.id})">↩ Restore</button>`;
    }

    item.innerHTML = `
      <div class="email-list-avatar" style="background:${avatarColor}">${initial}</div>
      <div class="email-list-content">
        <div class="email-list-sender">To: ${email.to}</div>
        <div class="email-list-subject">${email.subject}</div>
        <div class="email-list-preview">${email.preview}</div>
      </div>
      <div class="email-list-meta">
        <span class="email-list-time">${email.time}</span>
        ${actionBtn}
      </div>`;

    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openSentOrTrashEmail(email.id, folder));

    list.appendChild(item);
  });
}

function openSentOrTrashEmail(id, folder) {
  const email = SENT_EMAILS.find(e => e.id === id);
  if (!email) return;

  // Switch view: list -> reading pane (same visual treatment as Inbox)
  document.getElementById('email-list-view').classList.remove('active');
  document.getElementById('sent-detail-view').classList.add('active');

  const backBtn = document.getElementById('sent-detail-back-btn');
  backBtn.textContent = folder === 'trash' ? '← Back to Trash' : '← Back to Sent';

  const content = document.getElementById('sent-detail-content');
  content.innerHTML = '';

  // Header block — mirrors the Inbox email-header-block markup
  const header = document.createElement('div');
  header.className = 'email-header-block';
  header.innerHTML = `
    <div class="email-subject-line">${email.subject}</div>
    <div class="email-meta-row">
      <span class="email-meta-label">FROM</span>
      <span class="email-meta-value">Cyber Detective (You)</span>
    </div>
    <div class="email-meta-row">
      <span class="email-meta-label">TO</span>
      <span class="email-meta-value" style="color:var(--text-muted)">${email.to}</span>
    </div>
    <div class="email-meta-row">
      <span class="email-meta-label">DATE</span>
      <span class="email-meta-value" style="color:var(--text-muted)">${email.time}</span>
    </div>`;
  content.appendChild(header);

  // Body — mirrors the Inbox email-body-text markup
  const body = document.createElement('div');
  body.className = 'email-body-text';
  email.body.forEach(part => {
    const p = document.createElement('p');
    p.style.whiteSpace = 'pre-line';
    p.textContent = part.text;
    body.appendChild(p);
  });
  content.appendChild(body);

  // Action button — Delete for Sent, Restore for Trash
  const actionBtn = document.getElementById('sent-detail-action-btn');
  if (folder === 'sent') {
    actionBtn.textContent = '🗑 Delete';
    actionBtn.className = 'report-btn sent-detail-action-btn-delete';
    actionBtn.onclick = () => { deleteSentEmail(email.id); closeSentDetailView(); };
  } else {
    actionBtn.textContent = '↩ Restore to Sent';
    actionBtn.className = 'report-btn sent-detail-action-btn-restore';
    actionBtn.onclick = () => { restoreSentEmail(email.id); closeSentDetailView(); };
  }
}

function closeSentDetailView() {
  document.getElementById('sent-detail-view').classList.remove('active');
  document.getElementById('email-list-view').classList.add('active');
  renderEmailList();
}

function deleteSentEmail(id) {
  if (!gameState.trashedSentIds.includes(id)) {
    gameState.trashedSentIds.push(id);
  }
  showToast('🗑 Moved to Trash', 'success');
  renderEmailList();
}

function restoreSentEmail(id) {
  gameState.trashedSentIds = gameState.trashedSentIds.filter(x => x !== id);
  showToast('↩ Restored to Sent', 'success');
  renderEmailList();
}

// ═══════════════════════════════════════════════════════════
// GMAIL — EMAIL DETAIL
// ═══════════════════════════════════════════════════════════

function openEmail(idx) {
  const email = EMAILS[idx];
  gameState.currentEmail = idx;
  const existingResult = gameState.emailResults.find(r => r.emailId === email.id);

  if (existingResult) {
    gameState.currentEmailFlags = existingResult.savedFlags ? [...existingResult.savedFlags] : [];
  } else {
    gameState.currentEmailFlags = [];
  }
  gameState.flagModeActive = false;

  // Switch view
  document.getElementById('email-list-view').classList.remove('active');
  document.getElementById('email-detail-view').classList.add('active');

  const flagModeBtn = document.getElementById('flag-mode-btn');
  const reportBtn = document.getElementById('report-btn');

  flagModeBtn.classList.remove('active');
  document.querySelector('.gmail-body').classList.remove('flag-mode-active');

  if (existingResult) {
    reportBtn.disabled = true;
    reportBtn.textContent = '✓ Reported';
    reportBtn.classList.add('reported');
    reportBtn.title = 'You have already submitted a report for this email.';

    flagModeBtn.disabled = true;
    flagModeBtn.title = 'Investigation concluded — report already submitted.';
  } else {
    reportBtn.disabled = false;
    reportBtn.textContent = '📋 Report';
    reportBtn.classList.remove('reported');
    reportBtn.title = '';

    flagModeBtn.disabled = false;
    flagModeBtn.title = '';
  }

  renderEmailContent(email);
  renderEvidencePanel();
  updateHUD();
}

function renderEmailContent(email) {
  const content = document.getElementById('email-content');
  content.innerHTML = '';

  const existingResult = gameState.emailResults.find(r => r.emailId === email.id);
  if (existingResult) {
    const verdictText = existingResult.playerDecision ? '🚩 Reported as Phishing' : '✓ Marked as Legitimate';
    const verdictClass = existingResult.playerDecision ? 'phishing' : 'legit';
    const banner = document.createElement('div');
    banner.className = `case-closed-banner ${verdictClass}`;
    banner.innerHTML = `🔒 <strong>CASE CLOSED</strong> — ${verdictText} (${existingResult.score >= 0 ? '+' : ''}${existingResult.score} pts). You can review this email, but reports can only be submitted once.`;
    content.appendChild(banner);
  }

  // Header block
  const isSenderFlagged = gameState.currentEmailFlags.some(f => f.type === 'fake_sender');
  const header = document.createElement('div');
  header.className = 'email-header-block';
  header.innerHTML = `
    <div class="email-subject-line">${email.subject}</div>
    <div class="email-meta-row">
      <span class="email-meta-label">FROM</span>
      <span class="email-meta-value">
        <span class="flaggable${isSenderFlagged ? ' flagged' : ''}" data-flag-id="sender" data-flag-type="fake_sender" data-flag-label="FAKE SENDER"
          data-flag-text="${email.sender.address}"
          onclick="handleFlaggableClick(this)">${email.sender.name} &lt;${email.sender.address}&gt;</span>
      </span>
    </div>
    <div class="email-meta-row">
      <span class="email-meta-label">TO</span>
      <span class="email-meta-value" style="color:var(--text-muted)">me@company.example</span>
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
      const isFlagged = gameState.currentEmailFlags.some(f => f.type === part.flagType);
      span.className = `flaggable${isFlagged ? ' flagged' : ''}`;
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
      const isFlagged = gameState.currentEmailFlags.some(f => f.type === part.flagType);
      link.className = `email-link flaggable${isFlagged ? ' flagged' : ''}`;
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
  const currentEmailObj = EMAILS[gameState.currentEmail];
  if (currentEmailObj && gameState.emailResults.some(r => r.emailId === currentEmailObj.id)) {
    showToast('🔒 This email has already been reported. Case is closed.', 'warning');
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
  } else if (gameState.flagModeActive) {
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
  const email = EMAILS[gameState.currentEmail];
  if (email && gameState.emailResults.some(r => r.emailId === email.id)) {
    showToast('🔒 This email has already been reported. Case is closed.', 'warning');
    closeLinkPopup();
    return;
  }
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
  const currentEmailObj = EMAILS[gameState.currentEmail];
  if (currentEmailObj && gameState.emailResults.some(r => r.emailId === currentEmailObj.id)) {
    showToast('🔒 This email has already been reported. Case is closed.', 'warning');
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
  const currentEmailObj = EMAILS[gameState.currentEmail];
  if (currentEmailObj && gameState.emailResults.some(r => r.emailId === currentEmailObj.id)) {
    showToast('🔒 This email has already been reported. Case is closed.', 'warning');
    return;
  }

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
  const currentEmailObj = EMAILS[gameState.currentEmail];
  if (currentEmailObj && gameState.emailResults.some(r => r.emailId === currentEmailObj.id)) {
    return;
  }

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

function renderEvidencePanel() {
  const list = document.getElementById('evidence-list');
  const badge = document.getElementById('evidence-count-badge');
  const flags = gameState.currentEmailFlags;
  const currentEmailObj = EMAILS[gameState.currentEmail];
  const isClosed = currentEmailObj && gameState.emailResults.some(r => r.emailId === currentEmailObj.id);

  badge.textContent = isClosed ? `${flags.length} SUBMITTED` : `${flags.length} FLAG${flags.length !== 1 ? 'S' : ''}`;

  if (flags.length === 0) {
    list.innerHTML = `<div class="evidence-empty">${isClosed ? 'No evidence flags were submitted for this email.' : 'No flags placed yet. Activate 🚩 Flag Evidence to begin.'}</div>`;
    return;
  }

  list.innerHTML = '';
  flags.forEach(flag => {
    const item = document.createElement('div');
    item.className = 'evidence-item';
    const removeBtnHtml = isClosed ? '' : `<button class="evidence-remove-btn" onclick="removeFlag('${flag.type}')" title="Remove flag">✕</button>`;
    item.innerHTML = `
      <span class="evidence-item-icon">🚩</span>
      <span class="evidence-item-text">${flag.text.length > 60 ? flag.text.slice(0,60)+'…' : flag.text}</span>
      <span class="evidence-item-type">${flag.label}</span>
      ${removeBtnHtml}`;
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
  document.getElementById('flag-mode-btn').classList.remove('active');
  document.querySelector('.gmail-body').classList.remove('flag-mode-active');
  renderEmailList();
  updateHUD();
}

// ═══════════════════════════════════════════════════════════
// REPORT DIALOG
// ═══════════════════════════════════════════════════════════

function showReportDialog() {
  const email = EMAILS[gameState.currentEmail];
  if (!email) return;

  if (gameState.emailResults.some(r => r.emailId === email.id)) {
    showToast('⚠️ You have already submitted a report for this email.', 'warning');
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
      `<div class="report-evidence-count">${flags.length} evidence flag${flags.length > 1 ? 's' : ''} placed</div>`;
  }

  showOverlay('overlay-report');
}

let isSubmittingReport = false;
function submitReport(isPhishing) {
  if (isSubmittingReport) return;
  const email = EMAILS[gameState.currentEmail];
  if (!email) return;

  if (gameState.emailResults.some(r => r.emailId === email.id)) {
    showToast('⚠️ You have already submitted a report for this email.', 'warning');
    closeOverlay('overlay-report');
    return;
  }

  isSubmittingReport = true;
  try {
    closeOverlay('overlay-report');

    const playerFlags = gameState.currentEmailFlags.map(f => f.type);
    const expectedEvidence = email.evidence;

    // Decision scoring — a correct Phishing call is worth more than a correct
    // Legitimate call, since Phishing requires solid evidence to back it up.
    const correctDecision = (isPhishing === email.phishing);
    let emailScore = 0;

    if (correctDecision) {
      emailScore += isPhishing ? 100 : 50;
      gameState.correctDecisions++;
      if (isPhishing) gameState.phishingDetected++;
      else gameState.legitimateDetected++;
    } else {
      emailScore -= 50;
    }

    // Evidence scoring (only matters for phishing emails)
    let correctFlags = [];
    let incorrectFlags = [];
    let missedEvidence = [];

    if (email.phishing) {
      playerFlags.forEach(pf => {
        if (expectedEvidence.includes(pf)) {
          correctFlags.push(pf);
          emailScore += 25;
          gameState.evidenceFoundTotal++;
        } else {
          incorrectFlags.push(pf);
          emailScore -= 10;
        }
      });
      missedEvidence = expectedEvidence.filter(e => !playerFlags.includes(e));

      // Getting the verdict right isn't the whole job — missing real evidence
      // costs points too, even when the final call was correct.
      if (correctDecision && missedEvidence.length > 0) {
        emailScore -= missedEvidence.length * 25;
      }
    } else {
      // Legitimate email — any flag is incorrect
      if (playerFlags.length > 0) {
        incorrectFlags = playerFlags;
        emailScore -= playerFlags.length * 10;
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
      correctFlags,
      incorrectFlags,
      missedEvidence,
      score: emailScore,
      savedFlags: [...gameState.currentEmailFlags]
    };
    gameState.emailResults.push(result);

    // Disable report and flag buttons immediately
    const reportBtn = document.getElementById('report-btn');
    if (reportBtn) {
      reportBtn.disabled = true;
      reportBtn.textContent = '✓ Reported';
      reportBtn.classList.add('reported');
      reportBtn.title = 'You have already submitted a report for this email.';
    }
    const flagModeBtn = document.getElementById('flag-mode-btn');
    if (flagModeBtn) {
      flagModeBtn.disabled = true;
      flagModeBtn.classList.remove('active');
    }

    updateHUD();
    showCapybaraResult(result, email);
  } finally {
    isSubmittingReport = false;
  }
}

// ═══════════════════════════════════════════════════════════
// CAPYBARA REVIEW
// ═══════════════════════════════════════════════════════════

function showCapybaraResult(result, email) {
  const { correctDecision, isPhishing, playerDecision, correctFlags, incorrectFlags, missedEvidence, score } = result;

  // Verdict
  const verdictTitle = document.getElementById('review-verdict-title');
  const decisionRow = document.getElementById('review-decision-row');

  if (isPhishing) {
    if (correctDecision) {
      verdictTitle.textContent = '✓ PHISHING CONFIRMED';
      verdictTitle.className = 'correct';
      decisionRow.className = 'review-decision-row correct';
      decisionRow.innerHTML = '✓ Correct decision (+100) — You correctly identified this as a phishing email.';
    } else {
      verdictTitle.textContent = '✗ MISSED PHISHING';
      verdictTitle.className = 'incorrect';
      decisionRow.className = 'review-decision-row incorrect';
      decisionRow.innerHTML = '✗ Incorrect (−50) — This was a phishing email. You marked it as legitimate.';
    }
  } else {
    if (correctDecision) {
      verdictTitle.textContent = '✓ LEGITIMATE EMAIL';
      verdictTitle.className = 'correct';
      decisionRow.className = 'review-decision-row correct';
      decisionRow.innerHTML = '✓ Correct (+50) — You correctly identified this as a legitimate email.';
    } else {
      verdictTitle.textContent = '✗ FALSE POSITIVE';
      verdictTitle.className = 'incorrect';
      decisionRow.className = 'review-decision-row incorrect';
      decisionRow.innerHTML = '✗ Incorrect (−50) — This was a legitimate email. You reported it as phishing.';
    }
  }

  // Correct flags
  const flagsList = document.getElementById('review-flags-list');
  flagsList.innerHTML = '';

  if (isPhishing && correctFlags.length > 0) {
    correctFlags.forEach(f => {
      const analysis = email.capybaraAnalysis[f];
      if (!analysis) return;
      const item = document.createElement('div');
      item.className = 'review-flag-item correct';
      item.innerHTML = `
        <div class="review-flag-icon">✅</div>
        <div>
          <div class="review-flag-title">CORRECT FLAG (+25)</div>
          <div class="review-flag-desc">${formatAnalysisText(analysis.correct)}</div>
        </div>`;
      flagsList.appendChild(item);
    });
  }

  // Legitimate email — correct identification
  if (!isPhishing && correctDecision) {
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
          <div class="review-flag-title">INCORRECT FLAG — ${f.replace('_', ' ').toUpperCase()} (−10)</div>
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
          <div class="review-flag-title">MISSED EVIDENCE${correctDecision ? ' (−25)' : ''}</div>
          <div class="review-flag-desc">${formatAnalysisText(analysis.missed)}</div>
        </div>`;
      missedEl.appendChild(item);
    });
  } else {
    missedEl.classList.add('hidden');
  }

  // Score
  const scoreVal = document.getElementById('review-score-value');
  scoreVal.textContent = (score >= 0 ? '+' : '') + score;
  scoreVal.style.color = score > 0 ? 'var(--accent-green)' : score < 0 ? 'var(--accent-red)' : 'var(--accent-cyan)';

  // Next button label
  const nextBtn = document.getElementById('btn-next-email');
  const isLast = gameState.emailResults.length >= EMAILS.length;
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

  if (gameState.emailResults.length >= EMAILS.length) {
    finishMission();
    return;
  }

  const nextIdx = EMAILS.findIndex(e => !gameState.emailResults.some(r => r.emailId === e.id));
  if (nextIdx === -1) {
    finishMission();
    return;
  }

  gameState.currentEmail = nextIdx;
  gameState.currentEmailFlags = [];
  gameState.flagModeActive = false;

  renderEmailList();
  updateHUD();

  // Switch to list view if in detail view
  document.getElementById('email-detail-view').classList.remove('active');
  document.getElementById('email-list-view').classList.add('active');

  showToast(`📧 Email ${nextIdx + 1} of ${EMAILS.length} — investigate next.`, 'success');
}

// ═══════════════════════════════════════════════════════════
// FINAL RESULTS
// ═══════════════════════════════════════════════════════════

function finishMission() {
  gameState.phase = 'results';

  const totalEvidence = EMAILS.reduce((sum, e) => sum + e.evidence.length, 0);

  // Calculate rank against the perfect-run total (MAX_SCORE).
  const pct = gameState.score / MAX_SCORE;
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
  document.getElementById('res-accuracy').textContent = `${Math.max(0, Math.round(pct * 100))}%`;
  document.getElementById('res-final-score').textContent = gameState.score;
  document.getElementById('res-max-score').textContent = MAX_SCORE;
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
  gameState.trainingSlide = 0;
  gameState.demoStep = 0;
  gdemoStep = 0;
  gdemoFlags = [];
  gameState.malwareQuarantined = 0;
  gameState.malwareFalsePositives = 0;
  gameState.selectedFolderFileId = null;
  gameState.activeScanFileId = null;
  if (typeof FOLDER_FILES !== 'undefined') {
    FOLDER_FILES.forEach(f => { f.quarantined = false; f.scanned = false; });
  }

  // Close apps
  ['gmail', 'browser', 'folder', 'antivirus'].forEach(a => {
    appState[a].open = false;
    appState[a].minimized = false;
    appState[a].maximized = false;
    appState[a].hasBeenPositioned = false;
    const w = document.getElementById(`win-${a}`);
    if (w) {
      w.classList.add('hidden');
      w.classList.remove('maximized', 'focused', 'minimized');
      w.style.left = '';
      w.style.top = '';
    }
  });
  updateTaskbar();

  document.getElementById('hud').classList.add('hidden');

  // Reset email list view
  document.getElementById('email-detail-view').classList.remove('active');
  document.getElementById('email-list-view').classList.add('active');
  renderEmailList();
  updateHUD();

  // Reset browser
  document.getElementById('browser-content').innerHTML = BROWSER_HOME_HTML;
  document.getElementById('browser-url-input').value = '';
  document.getElementById('browser-security').textContent = '⚠️ Not Secure';
  document.getElementById('browser-security').className = 'browser-security-indicator';
  browserHistory = [];
  browserCurrentIdx = -1;
  browserBypassed = new Set();

  showOverlay('overlay-welcome');
  vnInit();
}

// ═══════════════════════════════════════════════════════════
// BROWSER
// ═══════════════════════════════════════════════════════════

let browserHistory = [];
let browserCurrentIdx = -1;
let browserBypassed = new Set(); // URLs the player chose to "Proceed (unsafe)" past the cert warning

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Treat plain text (no scheme, has spaces, or no dot) as a Google search;
// anything that looks like a domain/URL is navigated to directly.
function isSearchQuery(str) {
  if (/^https?:\/\//i.test(str)) return false;
  if (/\s/.test(str)) return true;
  return !/\./.test(str);
}

function handleBrowserUrlKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    browserGo(e.target.value);
  }
}

function handleHomeSearchKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitHomeSearch();
  }
}

function submitHomeSearch() {
  const input = document.getElementById('browser-home-search');
  if (input) browserGo(input.value);
}

function browserGo(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return;

  let url;
  if (isSearchQuery(trimmed)) {
    url = 'https://www.google.com/search?q=' + encodeURIComponent(trimmed);
  } else {
    url = /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
  }
  navigateBrowser(url);
}

function navigateBrowser(url) {
  const urlInput = document.getElementById('browser-url-input');
  if (urlInput) urlInput.value = url;

  browserHistory = browserHistory.slice(0, browserCurrentIdx + 1);
  browserHistory.push(url);
  browserCurrentIdx = browserHistory.length - 1;

  renderBrowserPage(url);
}

function renderBrowserPage(url) {
  const content = document.getElementById('browser-content');
  const security = document.getElementById('browser-security');

  const isGoogleSearch = /^https:\/\/www\.google\.com\/search\?q=/i.test(url);
  const isKnownUnsafe = Object.prototype.hasOwnProperty.call(FAKE_SITES, url);

  if (isKnownUnsafe && !browserBypassed.has(url)) {
    security.textContent = '⚠️ Not secure';
    security.className = 'browser-security-indicator';
    content.innerHTML = renderPrivacyWarning(url);
    return;
  }

  if (isKnownUnsafe && browserBypassed.has(url)) {
    security.textContent = '⚠️ Not Secure';
    security.className = 'browser-security-indicator';
    content.innerHTML = FAKE_SITES[url];
    return;
  }

  if (isGoogleSearch) {
    security.textContent = '🔒 Secure';
    security.className = 'browser-security-indicator secure';
    const q = decodeURIComponent(url.split('q=')[1] || '');
    content.innerHTML = renderGoogleResults(q);
    return;
  }

  // Any other real-looking address — not one of the game's simulated
  // phishing pages, so it renders as an ordinary, safe website. Emails
  // reference real-world domains (bank sites, Wikipedia, news orgs, etc.)
  // as part of legitimate messages, and players need to be able to open
  // those to compare them against the phishing links — a dead-end
  // "site can't be reached" error broke that investigation flow.
  security.textContent = '🔒 Secure';
  security.className = 'browser-security-indicator secure';
  content.innerHTML = renderGenericSite(url);
}

// A generic, safe-looking mock webpage for any address that isn't one of
// the game's simulated phishing sites. Gives Wikipedia a bit of special
// flavor since it's the site referenced in the mock search results, and
// falls back to a generic "brochure" page for everything else so no typed
// or clicked address ever dead-ends.
function renderGenericSite(url) {
  let hostname, pathname;
  try {
    const u = new URL(url);
    hostname = u.hostname;
    pathname = u.pathname;
  } catch (e) {
    hostname = url;
    pathname = '/';
  }

  if (/(^|\.)wikipedia\.org$/i.test(hostname)) {
    const slug = decodeURIComponent((pathname.split('/wiki/')[1] || 'Phishing').replace(/_/g, ' '));
    const title = slug || 'Phishing';
    return `
      <div class="wikisite">
        <div class="wikisite-header">
          <span class="wikisite-logo">📖</span>
          <span class="wikisite-wordmark">WIKIPEDIA</span>
          <span class="wikisite-tag">The Free Encyclopedia</span>
        </div>
        <div class="wikisite-body">
          <h1>${escapeHtml(title)}</h1>
          <p class="wikisite-sub">From Wikipedia, the free encyclopedia</p>
          <hr/>
          <p><strong>${escapeHtml(title)}</strong> is a form of social engineering in which an attacker impersonates a trustworthy sender or organization to trick a target into revealing sensitive information, such as login credentials or financial details, or into installing malware.</p>
          <p>Common techniques include spoofed sender addresses, urgent or threatening language designed to rush a decision, and links whose visible text does not match their actual destination.</p>
          <p class="wikisite-note">This is a simulated Wikipedia page for training purposes — content is illustrative, not a live article.</p>
        </div>
      </div>`;
  }

  const displayHost = hostname.replace(/^www\./i, '');
  const siteName = (displayHost.split('.')[0] || 'Website').replace(/[-_]/g, ' ');
  const capitalized = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  return `
    <div class="genericsite">
      <div class="genericsite-header">
        <span class="genericsite-logo">${escapeHtml(capitalized.charAt(0))}</span>
        <span class="genericsite-name">${escapeHtml(capitalized)}</span>
        <nav class="genericsite-nav"><a href="#" onclick="return false;">Home</a><a href="#" onclick="return false;">About</a><a href="#" onclick="return false;">Contact</a></nav>
      </div>
      <div class="genericsite-body">
        <h2>Welcome to ${escapeHtml(capitalized)}</h2>
        <p>${escapeHtml(displayHost)} — this page loaded successfully and looks like an ordinary website.</p>
        <p class="genericsite-note">This is a simulated page for training purposes — content is illustrative, not a real website.</p>
      </div>
    </div>`;
}

// Chrome-style "Your connection is not private" certificate warning
function renderPrivacyWarning(url) {
  let hostname;
  try { hostname = new URL(url).hostname; } catch (e) { hostname = url; }
  const safeUrl = escapeHtml(url);
  return `
    <div class="cert-warning">
      <div class="cert-warning-icon">✕</div>
      <h1>Your connection is not private</h1>
      <p>Attackers might be trying to steal your information from <strong>${escapeHtml(hostname)}</strong> (for example, passwords, messages, or credit cards). <a href="#" onclick="return false;">Learn more</a></p>
      <p class="cert-code">NET::ERR_CERT_AUTHORITY_INVALID</p>
      <button class="cert-back-btn" onclick="browserBackToSafety()">Back to safety</button>
      <div class="cert-advanced">
        <button class="cert-advanced-toggle" onclick="toggleCertAdvanced(this)">Advanced ▾</button>
        <div class="cert-advanced-body hidden">
          <p>This server could not prove that it is <strong>${escapeHtml(hostname)}</strong>; its security certificate is not trusted by your computer's operating system. This may be caused by a misconfiguration or an attacker intercepting your connection.</p>
          <a href="#" class="cert-proceed-link" onclick="browserProceedUnsafe('${safeUrl}'); return false;">Proceed to ${escapeHtml(hostname)} (unsafe)</a>
        </div>
      </div>
    </div>`;
}

function toggleCertAdvanced(btn) {
  const body = btn.nextElementSibling;
  const nowHidden = !body.classList.contains('hidden');
  body.classList.toggle('hidden');
  btn.textContent = nowHidden ? 'Advanced ▾' : 'Advanced ▴';
}

function browserProceedUnsafe(url) {
  browserBypassed.add(url);
  renderBrowserPage(url);
}

function browserBackToSafety() {
  if (browserCurrentIdx > 0) {
    browserBack();
  } else {
    browserGoHome();
  }
}

function browserGoHome() {
  browserHistory = [];
  browserCurrentIdx = -1;
  const urlInput = document.getElementById('browser-url-input');
  if (urlInput) urlInput.value = '';
  document.getElementById('browser-content').innerHTML = BROWSER_HOME_HTML;
  const security = document.getElementById('browser-security');
  security.textContent = '⚠️ Not Secure';
  security.className = 'browser-security-indicator';
}

// A simple mock Google results page — not connected to any real search engine
function renderGoogleResults(query) {
  const q = escapeHtml(query);
  const mockResults = [
    {
      url: 'www.consumer.ftc.gov › articles › how-recognize-phishing',
      link: 'https://www.consumer.ftc.gov/articles/how-recognize-phishing',
      title: 'How to Recognize and Avoid Phishing Scams',
      desc: `Learn the tell-tale signs of a phishing email or text message: mismatched sender addresses, urgent threats, and links that don't go where they claim to.`
    },
    {
      url: 'www.cisa.gov › news-events › news › avoiding-social-engineering',
      link: 'https://www.cisa.gov/news-events/news/avoiding-social-engineering',
      title: 'Avoiding Social Engineering and Phishing Attacks | CISA',
      desc: `Attackers use email or malicious websites to solicit personal information by posing as a trustworthy organization.`
    },
    {
      url: 'en.wikipedia.org › wiki › Phishing',
      link: 'https://en.wikipedia.org/wiki/Phishing',
      title: 'Phishing - Wikipedia',
      desc: `Phishing is a form of social engineering where attackers deceive people into revealing sensitive information or installing malware.`
    }
  ];

  // Results are clickable — each one navigates the browser to a real-looking
  // address, which renderGenericSite() (or the Wikipedia special-case) will
  // render, so clicking a search result never dead-ends.
  const items = mockResults.map(r => `
    <div class="gresult-item">
      <div class="gresult-url">${r.url}</div>
      <div class="gresult-title" onclick="navigateBrowser('${r.link}')">${r.title}</div>
      <div class="gresult-desc">${r.desc}</div>
    </div>`).join('');

  return `
    <div class="gresults">
      <div class="gresults-header">
        <div class="gresults-logo"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></div>
        <div class="gresults-query">${q}</div>
      </div>
      <div class="gresults-stats">About ${(Math.floor(Math.random()*9)+1)},${Math.floor(Math.random()*900+100)},000 results (simulated)</div>
      ${items}
      <div class="gresults-empty">This is a simulated search — results are for training purposes only.</div>
    </div>`;
}

function browserBack() {
  if (browserCurrentIdx > 0) {
    browserCurrentIdx--;
    const url = browserHistory[browserCurrentIdx];
    // Render only — do NOT call navigateBrowser() here. navigateBrowser()
    // truncates history to the current index and then pushes the url again,
    // which duplicates the entry we just navigated back to. That duplicate
    // then makes every subsequent Back press land on the same duplicated
    // entry instead of moving further back, so Back appeared to get "stuck".
    const urlInput = document.getElementById('browser-url-input');
    if (urlInput) urlInput.value = url;
    renderBrowserPage(url);
  } else if (browserCurrentIdx === 0) {
    // The home page isn't stored in browserHistory, so index 0 is the
    // first site the player visited. There's nothing earlier to go back
    // to except home — without this, Back silently did nothing here.
    browserGoHome();
  }
}

function browserRefresh() {
  if (browserCurrentIdx >= 0) {
    // Same fix as browserBack(): re-render the current entry without
    // routing through navigateBrowser(), which would push a duplicate
    // history entry every time Reload is pressed.
    renderBrowserPage(browserHistory[browserCurrentIdx]);
  } else {
    browserGoHome();
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

function calculateScore(correctDecision, correct, incorrect, penaltyPerIncorrect = 10) {
  let s = correctDecision ? 100 : -50;
  s += correct.length * 25;
  s -= incorrect.length * penaltyPerIncorrect;
  return s;
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 2: MALWARE INVESTIGATION & HUNTING
// ═══════════════════════════════════════════════════════════

const TOTAL_MALWARE_COUNT = 4;

const FOLDER_FILES = [
  {
    id: 'f1',
    name: 'salary_bonus_september.pdf.exe',
    fakeExt: 'pdf',
    realExt: 'exe',
    type: 'Application (.exe)',
    size: '1.8 MB',
    date: '9/6/2026 09:14 AM',
    icon: '⚡',
    isMalware: true,
    threatName: 'Trojan.Win32.DoubleExt.Dropper',
    threatCategory: 'CRITICAL THREAT',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    analysis: '⚠️ Dangerous double extension! Disguised as a PDF document but actually an executable program that installs backdoors.',
    quarantined: false,
    scanned: false
  },
  {
    id: 'f2',
    name: 'project_architecture_notes.docx',
    fakeExt: 'docx',
    realExt: 'docx',
    type: 'Microsoft Word Document',
    size: '48 KB',
    date: '9/6/2026 08:30 AM',
    icon: '📄',
    isMalware: false,
    threatName: 'Clean File',
    threatCategory: 'SAFE',
    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    analysis: '✅ Verified clean Word document. Normal Office OpenXML structure, no malicious macro payloads detected.',
    quarantined: false,
    scanned: false
  },
  {
    id: 'f3',
    name: 'security_credentials_patch.scr',
    fakeExt: 'scr',
    realExt: 'scr',
    type: 'Screensaver Executable (.scr)',
    size: '3.4 MB',
    date: '9/6/2026 10:02 AM',
    icon: '⚡',
    isMalware: true,
    threatName: 'Spyware.Keylogger.Injector',
    threatCategory: 'CRITICAL THREAT',
    hash: '5f4dcc3b5aa765d61d8327deb882cf992b95990a9151374abd8fa30ee0633b4b',
    analysis: '⚠️ Screensaver executable (.scr). Windows executes .scr files identically to .exe files. Contains keylogging telemetry.',
    quarantined: false,
    scanned: false
  },
  {
    id: 'f4',
    name: 'company_vacation_policy.pdf',
    fakeExt: 'pdf',
    realExt: 'pdf',
    type: 'Adobe Acrobat Document',
    size: '220 KB',
    date: '9/5/2026 04:15 PM',
    icon: '📄',
    isMalware: false,
    threatName: 'Clean File',
    threatCategory: 'SAFE',
    hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    analysis: '✅ Standard PDF document. No embedded JavaScript, exploits, or malicious stream objects found.',
    quarantined: false,
    scanned: false
  },
  {
    id: 'f5',
    name: 'overdue_invoice_inv9918.vbs',
    fakeExt: 'vbs',
    realExt: 'vbs',
    type: 'VBScript Script File',
    size: '14 KB',
    date: '9/6/2026 09:48 AM',
    icon: '📜',
    isMalware: true,
    threatName: 'Dropper.VBS.PowerShellDownloader',
    threatCategory: 'HIGH RISK',
    hash: 'ca978112ca1bbdcafac231b39a23dc4da786081cd1e14eed6da746e44b4735f6',
    analysis: '⚠️ Malicious VBScript. Obfuscated script configured to spawn PowerShell in hidden mode and download ransomware.',
    quarantined: false,
    scanned: false
  },
  {
    id: 'f6',
    name: 'annual_team_retreat.jpg',
    fakeExt: 'jpg',
    realExt: 'jpg',
    type: 'JPEG Image',
    size: '1.2 MB',
    date: '9/4/2026 02:22 PM',
    icon: '🖼️',
    isMalware: false,
    threatName: 'Clean File',
    threatCategory: 'SAFE',
    hash: '098f6bcd4621d373cade4e832627b4f6cf4c45a76e9c60e34c98f98c4f74d081',
    analysis: '✅ Standard digital photograph. Valid JFIF/EXIF header metadata, no steganographic or buffer overflow payload.',
    quarantined: false,
    scanned: false
  },
  {
    id: 'f7',
    name: 'crypto_mining_daemon.exe',
    fakeExt: 'exe',
    realExt: 'exe',
    type: 'Executable Binary (.exe)',
    size: '5.1 MB',
    date: '9/6/2026 10:15 AM',
    icon: '⚡',
    isMalware: true,
    threatName: 'CoinMiner.XMR.Stealth',
    threatCategory: 'CRITICAL THREAT',
    hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    analysis: '⚠️ Unauthorized cryptomining payload. Connects to remote command-and-control pools to consume host hardware resources.',
    quarantined: false,
    scanned: false
  },
  {
    id: 'f8',
    name: 'q3_quarterly_budget.xlsx',
    fakeExt: 'xlsx',
    realExt: 'xlsx',
    type: 'Microsoft Excel Spreadsheet',
    size: '86 KB',
    date: '9/6/2026 08:45 AM',
    icon: '📊',
    isMalware: false,
    threatName: 'Clean File',
    threatCategory: 'SAFE',
    hash: 'b10a8db164e0754105b7a99be72e3fe572b8d009fe82670d912da6d65427ec56',
    analysis: '✅ Standard Excel workbook. Clean formulas, digitally unsigned VBA macros disabled, zero malicious hooks.',
    quarantined: false,
    scanned: false
  }
];

function startMalwareMission() {
  closeOverlay('overlay-results');
  gameState.phase = 'malware';
  gameState.malwareQuarantined = 0;
  gameState.malwareFalsePositives = 0;
  gameState.selectedFolderFileId = null;
  gameState.activeScanFileId = null;

  FOLDER_FILES.forEach(f => {
    f.quarantined = false;
    f.scanned = false;
  });

  // Minimize Gmail so player focuses on Folder and Anti-Virus
  minimizeApp('gmail');

  renderFolderFiles();
  updateAntivirusUI();
  updateHUD();

  // Position and open Folder on the left, Anti-Virus on the right
  openApp('folder');
  openApp('antivirus');

  // Offset window positions nicely on desktop
  const winFolder = document.getElementById('win-folder');
  const winAv = document.getElementById('win-antivirus');
  if (winFolder && winAv) {
    winFolder.style.left = '40px';
    winFolder.style.top = '50px';
    winAv.style.left = '520px';
    winAv.style.top = '70px';
  }

  showToast('📁 Chapter 2: Inspect files in Folder and use Anti-Virus to quarantine all 4 malware threats!', 'warning');
}

function renderFolderFiles(filterQuery = '') {
  const list = document.getElementById('folder-file-list');
  if (!list) return;
  list.innerHTML = '';

  const q = filterQuery.toLowerCase().trim();
  const filtered = FOLDER_FILES.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));

  if (filtered.length === 0) {
    list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px">No matching files found.</div>';
    return;
  }

  filtered.forEach(file => {
    const row = document.createElement('div');
    row.className = `folder-file-row ${file.id === gameState.selectedFolderFileId ? 'selected' : ''} ${file.quarantined ? 'quarantined' : ''}`;
    row.onclick = () => selectFolderFile(file.id);

    let statusBadge = '<span class="badge-file-status badge-unscanned">Unscanned</span>';
    if (file.quarantined) {
      statusBadge = '<span class="badge-file-status badge-quarantined">🛡️ Quarantined</span>';
    } else if (file.scanned) {
      statusBadge = file.isMalware
        ? '<span class="badge-file-status badge-threat">⚠️ Threat</span>'
        : '<span class="badge-file-status badge-clean">✓ Safe</span>';
    }

    row.innerHTML = `
      <div class="file-name-cell">
        <span class="file-icon">${file.icon}</span>
        <span title="${file.name}">${file.name}</span>
      </div>
      <div>${file.date}</div>
      <div>${file.type}</div>
      <div>${file.size}</div>
      <div>${statusBadge}</div>`;

    list.appendChild(row);
  });
}

function filterFolderFiles(val) {
  renderFolderFiles(val);
}

function selectFolderFile(fileId) {
  gameState.selectedFolderFileId = fileId;
  const file = FOLDER_FILES.find(f => f.id === fileId);
  renderFolderFiles(document.getElementById('folder-search-input')?.value || '');

  const emptyEl = document.getElementById('fdp-empty');
  const contentEl = document.getElementById('fdp-content');
  if (!file || !contentEl) return;

  emptyEl.classList.add('hidden');
  contentEl.classList.remove('hidden');

  // Determine analysis visual style
  let analysisClass = 'suspicious';
  if (file.scanned) {
    analysisClass = file.isMalware ? 'threat' : 'clean';
  }

  let quarantineBtnHtml = '';
  if (file.quarantined) {
    quarantineBtnHtml = `<button class="btn-ghost btn-sm" disabled style="opacity:0.6;width:100%">🛡️ File Quarantined</button>`;
  } else {
    quarantineBtnHtml = `<button class="btn-danger btn-sm" style="width:100%" onclick="quarantineFile('${file.id}')">🚩 Quarantine This File</button>`;
  }

  contentEl.innerHTML = `
    <div class="fdp-header">
      <div class="fdp-icon-large">${file.icon}</div>
      <div>
        <div class="fdp-name">${file.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${file.type} • ${file.size}</div>
      </div>
    </div>

    <div class="fdp-meta-table">
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">SHA-256</span>
        <span class="fdp-meta-val">${file.hash.slice(0, 16)}…</span>
      </div>
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">Actual Ext</span>
        <span class="fdp-meta-val" style="color:${file.realExt === 'exe' || file.realExt === 'scr' || file.realExt === 'vbs' ? 'var(--accent-red)' : 'var(--accent-cyan)'}">.${file.realExt}</span>
      </div>
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">Status</span>
        <span class="fdp-meta-val">${file.quarantined ? 'Quarantined' : file.scanned ? (file.isMalware ? 'Threat Detected' : 'Clean') : 'Ready for Scan'}</span>
      </div>
    </div>

    <div class="fdp-analysis-box ${analysisClass}">
      ${file.analysis}
    </div>

    <div class="fdp-actions">
      <button class="btn-primary btn-sm" style="width:100%" onclick="scanFileInAntivirus('${file.id}')">⚡ Scan with Anti-Virus</button>
      ${quarantineBtnHtml}
    </div>`;

  // Pre-load target in Anti-Virus window
  const avTcName = document.getElementById('av-tc-name');
  const avTcDetail = document.getElementById('av-tc-detail');
  const avTcIcon = document.getElementById('av-tc-icon');
  if (avTcName && avTcDetail && avTcIcon) {
    avTcName.textContent = file.name;
    avTcDetail.textContent = `${file.type} • ${file.size} • SHA-256: ${file.hash.slice(0, 10)}…`;
    avTcIcon.textContent = file.icon;
  }
}

function scanFileInAntivirus(fileId) {
  selectFolderFile(fileId);
  openApp('antivirus');
  focusWindow('antivirus');
  startActiveScan();
}

let scanInProgress = false;
function startActiveScan() {
  if (scanInProgress) return;
  const fileId = gameState.selectedFolderFileId;
  const file = FOLDER_FILES.find(f => f.id === fileId);
  if (!file) {
    showToast('💡 Please select a file from the Folder first.', 'warning');
    return;
  }

  scanInProgress = true;
  const progressWrap = document.getElementById('av-progress-wrap');
  const progressFill = document.getElementById('av-progress-fill');
  const progressPct = document.getElementById('av-progress-pct');
  const resultCard = document.getElementById('av-result-card');
  const scanBtn = document.getElementById('av-scan-btn');

  if (progressWrap) progressWrap.classList.remove('hidden');
  if (resultCard) resultCard.classList.add('hidden');
  if (scanBtn) scanBtn.disabled = true;

  let pct = 0;
  const interval = setInterval(() => {
    pct += 20;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressPct) progressPct.textContent = pct + '%';

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        scanInProgress = false;
        file.scanned = true;
        if (progressWrap) progressWrap.classList.add('hidden');
        if (scanBtn) scanBtn.disabled = false;
        renderFolderFiles(document.getElementById('folder-search-input')?.value || '');
        selectFolderFile(file.id);
        displayScanResult(file);
      }, 300);
    }
  }, 120);
}

function displayScanResult(file) {
  const resultCard = document.getElementById('av-result-card');
  if (!resultCard) return;

  resultCard.classList.remove('hidden', 'threat', 'clean');
  resultCard.classList.add(file.isMalware ? 'threat' : 'clean');

  let actionBtn = '';
  if (file.quarantined) {
    actionBtn = '<span style="font-size:12px;color:var(--text-muted);font-weight:700">✓ ALREADY QUARANTINED</span>';
  } else if (file.isMalware) {
    actionBtn = `<button class="btn-danger btn-sm" onclick="quarantineFile('${file.id}')">🚩 QUARANTINE THREAT (+100)</button>`;
  } else {
    actionBtn = '<span style="font-size:12px;color:var(--accent-green);font-weight:700">✓ NO ACTION NEEDED</span>';
  }

  resultCard.innerHTML = `
    <div class="av-result-left">
      <div class="av-threat-title">${file.isMalware ? '⚠️ THREAT IDENTIFIED: ' + file.threatName : '✅ FILE IS CLEAN: ' + file.threatName}</div>
      <div class="av-threat-desc">${file.analysis}</div>
    </div>
    <div>${actionBtn}</div>`;
}

function quarantineFile(fileId) {
  const file = FOLDER_FILES.find(f => f.id === fileId);
  if (!file) return;

  if (file.quarantined) {
    showToast('🛡️ This file is already quarantined.', 'warning');
    return;
  }

  if (file.isMalware) {
    file.quarantined = true;
    file.scanned = true;
    gameState.malwareQuarantined++;
    gameState.score += 100;
    updateHUD();
    updateAntivirusUI();
    renderFolderFiles(document.getElementById('folder-search-input')?.value || '');
    selectFolderFile(file.id);
    displayScanResult(file);

    showToast(`🛡️ Neutralized ${file.name}! (+100 points)`, 'success');

    if (gameState.malwareQuarantined >= TOTAL_MALWARE_COUNT) {
      setTimeout(finishMalwareMission, 1000);
    }
  } else {
    gameState.malwareFalsePositives++;
    gameState.score = Math.max(0, gameState.score - 25);
    updateHUD();
    showToast(`⚠️ False Positive! "${file.name}" is a clean, legitimate file (−25 pts).`, 'warning');
  }
}

function updateAntivirusUI() {
  const countBadge = document.getElementById('av-quarantine-count');
  const logCount = document.getElementById('av-log-count');
  const threatsList = document.getElementById('av-threats-list');
  const banner = document.getElementById('av-status-banner');

  if (countBadge) countBadge.textContent = gameState.malwareQuarantined;
  if (logCount) logCount.textContent = `${gameState.malwareQuarantined} / ${TOTAL_MALWARE_COUNT} Neutralized`;

  const quarantinedFiles = FOLDER_FILES.filter(f => f.quarantined);

  if (quarantinedFiles.length > 0 && banner) {
    banner.classList.add('alert');
  }

  if (threatsList) {
    if (quarantinedFiles.length === 0) {
      threatsList.innerHTML = '<div class="av-threats-empty">No quarantined files yet. Inspect suspicious files in the Folder!</div>';
    } else {
      threatsList.innerHTML = quarantinedFiles.map(f => `
        <div class="av-threat-item quarantined">
          <div>
            <strong>${f.name}</strong>
            <div style="font-size:11px;color:var(--text-muted)">${f.threatName} • Quarantined into Vault</div>
          </div>
          <span style="color:#b388ff;font-weight:700;font-size:11px">🛡️ SECURED</span>
        </div>`).join('');
    }
  }
}

function finishMalwareMission() {
  document.getElementById('res-malware-count').textContent = `${gameState.malwareQuarantined} / ${TOTAL_MALWARE_COUNT}`;
  document.getElementById('res-malware-fp').textContent = gameState.malwareFalsePositives;
  document.getElementById('res-malware-score').textContent = gameState.score;

  let rank = 'S';
  let rankLabel = 'MASTER CYBER DETECTIVE';
  if (gameState.malwareFalsePositives > 1) {
    rank = 'A';
    rankLabel = 'EXCELLENT DETECTIVE';
  }

  const rankEl = document.getElementById('malware-results-rank');
  const rankLabelEl = document.getElementById('malware-results-rank-label');
  if (rankEl) rankEl.textContent = rank;
  if (rankLabelEl) rankLabelEl.textContent = rankLabel;

  showOverlay('overlay-malware-results');
}

function restartEntireGame() {
  hideAllOverlays();
  playAgain();
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

// Show VN intro on load
window.addEventListener('DOMContentLoaded', () => {
  showOverlay('overlay-welcome');
  renderEmailList();
  vnInit();
  initStickyNote();
});
