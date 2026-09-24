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
    sender: { name: 'BPI Security', address: 'bpi.security.verification@gmail.com' },
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
        destination: 'https://bpi-online-security.com/login',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Thank you for banking with BPI.' },
      { type: 'p', text: 'Regards,\nBPI Security Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nThe sender address is <code>bpi.security.verification@gmail.com</code>. Notice the <strong>@gmail.com</strong>! Official BPI emails come only from <code>@bpi.com.ph</code>. Legitimate banks NEVER use free public email accounts like Gmail to deliver urgent security alerts.',
        missed: '🚩 MISSED — FAKE SENDER\nThe email was sent from <code>bpi.security.verification@gmail.com</code>. Notice the <strong>@gmail.com</strong> domain — real banks use their official domain (<code>@bpi.com.ph</code>), never a personal or free Gmail account.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nThe "30 minutes" deadline is a classic social engineering pressure tactic. Attackers create panic to prevent careful thinking.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe email threatened account suspension within 30 minutes. This extreme time pressure is a hallmark of phishing — it forces the victim to act without thinking.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe button links to <code>https://bpi-online-security.com/login</code>, not BPI\'s real website (<code>bpi.com.ph</code>). The domain looks convincing, but attackers register fake domains to harvest credentials.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Verify" button leads to <code>https://bpi-online-security.com/login</code>. Always inspect the destination — the real BPI website is <code>bpi.com.ph</code>.'
      }
    }
  },
  {
    id: 2,
    sender: { name: 'HR Department', address: 'hr@cybercorp.com' },
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
      { type: 'p', text: 'If you have any questions, feel free to reach out to the HR team directly at hr@cybercorp.com.' },
      { type: 'p', text: 'Thank you,\nHR Department\nCyberCorp Inc.' }
    ],
    capybaraAnalysis: {}
  },
  {
    id: 3,
    sender: { name: 'PayPal Security', address: 'security@paypa1-security.com' },
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
        destination: 'https://paypal-account-check.com/login',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Thank you for using PayPal.' },
      { type: 'p', text: 'Regards,\nPayPal Security Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nNotice the domain: <code>paypa1-security.com</code> uses the number "1" instead of the letter "l" in "PayPal". This is called a typosquat domain — a common attacker trick.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender was <code>security@paypa1-security.com</code>. Look closely — "paypa<strong>1</strong>" uses the digit 1, not the letter l. This subtle swap is a typosquat phishing technique.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nThe "24 hours" deadline and threat of permanent closure is engineered to create panic. Legitimate companies give adequate time and never threaten instant loss.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe email threatened permanent account closure within 24 hours. This is a pressure tactic to prevent you from verifying the email\'s legitimacy before acting.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe link destination <code>https://paypal-account-check.com/login</code> is not owned by PayPal. The real PayPal uses <code>paypal.com</code>.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Restore My Account" button leads to <code>https://paypal-account-check.com/login</code>. Always check actual link destinations — not the button label text.'
      }
    }
  },
  {
    id: 4,
    sender: { name: 'IT Department', address: 'it@cybercorp.com' },
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
      { type: 'p', text: 'We apologize for any inconvenience. For urgent matters during the maintenance window, please contact the on-call IT team at it-oncall@cybercorp.com.' },
      { type: 'p', text: 'Thank you for your understanding.\nIT Department' }
    ],
    capybaraAnalysis: {}
  },
  {
    id: 5,
    sender: { name: 'GCash Rewards', address: 'gcash.promotions.rewards@gmail.com' },
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
        destination: 'https://gcash-claim-rewards.com/verify',
        label: 'SUSPICIOUS LINK'
      },
      { type: 'p', text: 'Do not share this link. It is unique to your account.' },
      { type: 'p', text: 'Regards,\nGCash Rewards Team' }
    ],
    capybaraAnalysis: {
      fake_sender: {
        correct: '🚩 SENDER — CORRECT\nThe sender address is <code>gcash.promotions.rewards@gmail.com</code>. Notice the <strong>@gmail.com</strong>! Official GCash communications come exclusively from <code>@gcash.com</code>. Scammers often use free Gmail accounts to lure victims with fake giveaways.',
        missed: '🚩 MISSED — FAKE SENDER\nThe sender was <code>gcash.promotions.rewards@gmail.com</code>. Notice the <strong>@gmail.com</strong> domain — GCash will never use a public or personal Gmail account to distribute rewards.'
      },
      false_urgency: {
        correct: '🚩 URGENCY — CORRECT\nA "2-hour expiry" on a supposed reward is a classic scam pressure tactic. Legitimate rewards do not expire within hours and do not threaten immediate forfeiture.',
        missed: '🚩 MISSED — FALSE URGENCY\nThe 2-hour countdown before the reward "expires" is a pressure tactic. Scammers use short deadlines to stop you from pausing and thinking critically.'
      },
      suspicious_link: {
        correct: '🚩 LINK — CORRECT\nThe claim link goes to <code>https://gcash-claim-rewards.com/verify</code> — not GCash\'s real website (<code>gcash.com</code>). This is a fake phishing site designed to steal your 4-digit MPIN.',
        missed: '🚩 MISSED — SUSPICIOUS LINK\nThe "Claim My Reward" button leads to <code>https://gcash-claim-rewards.com/verify</code>. The real GCash website is <code>gcash.com</code>. Always verify destinations before clicking.'
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
    to: 'hr@cybercorp.com',
    subject: 'Re: September Employee Benefits Update',
    time: '9:12 AM',
    preview: 'Thanks for the update — reviewed and confirmed on my end...',
    body: [
      { type: 'p', text: 'Hi HR Department,' },
      { type: 'p', text: 'Thanks for the update — I reviewed the September benefits information through the normal internal resources. No issues on my end.' },
      { type: 'p', text: 'Regards,\nStudent' }
    ]
  },
  {
    id: 102,
    to: 'it-security@cybercorp.com',
    subject: 'Suspicious emails flagged this week',
    time: '10:47 AM',
    preview: 'Sharing a couple of phishing samples I caught for awareness...',
    body: [
      { type: 'p', text: 'Hi IT Security Team,' },
      { type: 'p', text: 'Sharing a couple of phishing samples I caught this week — fake sender domains, urgency pressure tactics, and mismatched links. Recommend circulating these for staff awareness training.' },
      { type: 'p', text: 'Regards,\nStudent' }
    ]
  }
];

// Fake websites for the browser
// Fake websites for the browser (Authentic Phishing Website Examples)
const FAKE_SITES = {
  'https://bpi-online-security.com/login': `
    <div class="fakesite fakesite-bpi">
      <div class="phish-sim-banner">
        <span class="phish-banner-icon">🚨</span>
        <span class="phish-banner-text"><strong>PHISHING SIMULATION EXAMPLE:</strong> Look at the browser URL bar: <code>bpi-online-security.com</code> is a fake phishing website, NOT the authentic <code>bpi.com.ph</code>!</span>
      </div>
      <div class="fakesite-header" style="background:linear-gradient(90deg, #8a0011, #b3001b);">
        <div class="fakesite-header-inner">
          <div class="fakesite-logo">🏦 BPI Online</div>
          <div class="fakesite-subtag">Personal &amp; Corporate Banking</div>
        </div>
      </div>
      <div class="fakesite-body">
        <div class="fakesite-card">
          <div class="fakesite-card-header">
            <h2>Log In to BPI Online</h2>
            <p>Security Alert: Confirm your account credentials to avoid immediate account restriction.</p>
          </div>
          <form onsubmit="event.preventDefault(); handlePhishingSubmit('bpi-online-security.com', 'BPI Online');">
            <div class="fakesite-field">
              <label for="bpi-user">Username or User ID</label>
              <input type="text" id="bpi-user" placeholder="Enter username" required autocomplete="off" />
            </div>
            <div class="fakesite-field">
              <label for="bpi-pass">Password</label>
              <input type="password" id="bpi-pass" placeholder="Enter password" required autocomplete="off" />
            </div>
            <div class="fakesite-row">
              <label class="fakesite-remember">
                <input type="checkbox" checked /> Remember User ID
              </label>
              <a href="#" class="fakesite-link" onclick="event.preventDefault(); showToast('⚠️ Fake link: Phishing sites only harvest submitted passwords.', 'warning');">Forgot Password?</a>
            </div>
            <button type="submit" class="fakesite-submit" style="background:linear-gradient(90deg, #8a0011, #b3001b);">
              Log In &amp; Verify Account
            </button>
          </form>
          <div class="fakesite-card-footer">
            <p>Don't have an account? <a href="#" onclick="event.preventDefault(); showToast('⚠️ Fake link on phishing portal.', 'warning');">Register for BPI Online</a></p>
          </div>
        </div>
        <div class="fakesite-disclaimer">
          ⚠️ <strong>Cyber Detective Clue:</strong> Notice the domain in your browser bar: <code>bpi-online-security.com</code>. Authentic Philippine banks use <code>.com.ph</code> domains (e.g. <code>bpi.com.ph</code>). Attackers buy lookalike domains to steal login credentials!
        </div>
      </div>
      <div class="fakesite-footer">
        <p>© 2026 Bank of the Philippine Islands. Regulated by the Bangko Sentral ng Pilipinas.</p>
      </div>
    </div>`,

  'https://paypal-account-check.com/login': `
    <div class="fakesite fakesite-paypal">
      <div class="phish-sim-banner">
        <span class="phish-banner-icon">🚨</span>
        <span class="phish-banner-text"><strong>PHISHING SIMULATION EXAMPLE:</strong> Look at the browser URL bar: <code>paypal-account-check.com</code> is a fake clone! Real PayPal is <code>paypal.com</code>.</span>
      </div>
      <div class="fakesite-header" style="background:#ffffff;border-bottom:1px solid #e2e8f0;">
        <div class="fakesite-header-inner">
          <div class="fakesite-logo" style="color:#003087;">🅿️ PayPal</div>
          <div class="fakesite-subtag" style="color:#64748b;">Security &amp; Verification Center</div>
        </div>
      </div>
      <div class="fakesite-body">
        <div class="fakesite-card">
          <div class="fakesite-card-header">
            <h2 style="color:#003087;">Log in to your PayPal account</h2>
            <p>We detected unauthorized activity. Please verify your credentials to restore wallet access.</p>
          </div>
          <form onsubmit="event.preventDefault(); handlePhishingSubmit('paypal-account-check.com', 'PayPal');">
            <div class="fakesite-field">
              <label for="paypal-email">Email address or mobile number</label>
              <input type="text" id="paypal-email" placeholder="Email or mobile number" required autocomplete="off" />
            </div>
            <div class="fakesite-field">
              <label for="paypal-pass">PayPal Password</label>
              <input type="password" id="paypal-pass" placeholder="Password" required autocomplete="off" />
            </div>
            <div class="fakesite-row">
              <label class="fakesite-remember">
                <input type="checkbox" checked /> Stay logged in
              </label>
              <a href="#" class="fakesite-link" onclick="event.preventDefault(); showToast('⚠️ Fake link: Attackers only collect submitted credentials.', 'warning');">Having trouble logging in?</a>
            </div>
            <button type="submit" class="fakesite-submit" style="background:linear-gradient(90deg, #003087, #0070ba);">
              Log In &amp; Restore Access
            </button>
            <div style="margin-top:14px;text-align:center;">
              <button type="button" class="fakesite-secondary-btn" onclick="event.preventDefault(); showToast('⚠️ Fake link on phishing portal.', 'warning');">Sign Up</button>
            </div>
          </form>
        </div>
        <div class="fakesite-disclaimer">
          ⚠️ <strong>Cyber Detective Clue:</strong> Authentic PayPal emails address you by your full name, not generic greetings. Look at the URL bar — <code>paypal-account-check.com</code> is not owned by PayPal!
        </div>
      </div>
      <div class="fakesite-footer">
        <p>English | Español | Français | Contact Us | Privacy | Legal</p>
        <p style="margin-top:4px;">Copyright © 1999–2026 PayPal. All rights reserved.</p>
      </div>
    </div>`,

  'https://gcash-claim-rewards.com/verify': `
    <div class="fakesite fakesite-gcash">
      <div class="phish-sim-banner">
        <span class="phish-banner-icon">🚨</span>
        <span class="phish-banner-text"><strong>PHISHING SIMULATION EXAMPLE:</strong> Look at the browser URL bar: <code>gcash-claim-rewards.com</code> is an MPIN harvesting scam! Authentic GCash is <code>gcash.com</code>.</span>
      </div>
      <div class="fakesite-header" style="background:linear-gradient(90deg,#005cfc,#007dfc);">
        <div class="fakesite-header-inner">
          <div class="fakesite-logo">📱 GCash</div>
          <div class="fakesite-subtag">Rewards &amp; Cash Rebates</div>
        </div>
      </div>
      <div class="fakesite-body">
        <div class="fakesite-card">
          <div class="fakesite-card-header">
            <h2 style="color:#005cfc;">🎉 Claim Your ₱5,000 Cash Reward</h2>
            <p>Special loyalty reward for verified GCash accounts. Enter details below to deposit directly into your wallet.</p>
          </div>
          <form onsubmit="event.preventDefault(); handlePhishingSubmit('gcash-claim-rewards.com', 'GCash');">
            <div class="fakesite-field">
              <label for="gcash-phone">Registered Mobile Number</label>
              <div class="fakesite-phone-wrap">
                <span class="fakesite-phone-prefix">+63</span>
                <input type="tel" id="gcash-phone" placeholder="9XX XXX XXXX" maxlength="12" required autocomplete="off" />
              </div>
            </div>
            <div class="fakesite-field">
              <label for="gcash-mpin">4-Digit MPIN (Security Code)</label>
              <input type="password" id="gcash-mpin" maxlength="4" placeholder="••••" required autocomplete="off" style="letter-spacing:6px;font-size:18px;text-align:center;" />
            </div>
            <div class="fakesite-field">
              <label for="gcash-otp">One-Time PIN (OTP) from SMS</label>
              <input type="password" id="gcash-otp" maxlength="6" placeholder="6-digit OTP" autocomplete="off" style="letter-spacing:4px;text-align:center;" />
            </div>
            <button type="submit" class="fakesite-submit" style="background:linear-gradient(90deg,#005cfc,#007dfc);">
              Verify &amp; Claim ₱5,000 Reward
            </button>
          </form>
        </div>
        <div class="fakesite-disclaimer">
          ⚠️ <strong>Cyber Detective Clue:</strong> <strong>NEVER</strong> enter your 4-digit MPIN or SMS OTP on any website. GCash will NEVER request your MPIN or OTP via a web link! Real domain is strictly <code>gcash.com</code>.
        </div>
      </div>
      <div class="fakesite-footer">
        <p>GCash is regulated by the Bangko Sentral ng Pilipinas (BSP).</p>
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
  readSentIds: [],          // ids of SENT_EMAILS that player has opened/read
  malwareQuarantined: 0,
  malwareFalsePositives: 0,
  selectedFolderFileId: null,
  activeScanFileId: null,
  playerName: 'Student',
  antivirusProtection: true
};

const appState = {
  gmail: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  browser: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  folder: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  antivirus: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  comms: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  ransomware: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  'wifi-settings': { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  'security-settings': { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  taskmanager: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  scanner: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  docviewer: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  imageviewer: { open: false, minimized: false, maximized: false, hasBeenPositioned: false },
  videoplayer: { open: false, minimized: false, maximized: false, hasBeenPositioned: false }
};

// ═══════════════════════════════════════════════════════════
// WINDOW MANAGEMENT & APP LOCKS
// ═══════════════════════════════════════════════════════════

function isAppLocked(appName) {
  // All apps are always unlocked — no chapter prerequisites required
  return false;
}

function updateAppLockStates() {
  const appsToCheck = [
    { name: 'folder', req: 'Chapter 1 (Phishing)' },
    { name: 'antivirus', req: 'Chapter 1 (Phishing)' },
    { name: 'comms', req: 'Chapter 2 (Malware)' },
    { name: 'ransomware', req: 'Chapter 3 (Social Engineering)' }
  ];

  appsToCheck.forEach(({ name: appName, req }) => {
    const isLocked = isAppLocked(appName);
    const icon = document.getElementById(`icon-${appName}`);
    const taskbarBtn = document.getElementById(`taskbar-${appName}`);
    const startCard = document.getElementById(`start-app-${appName}`);
    const startBadge = document.getElementById(`start-badge-${appName}`);
    const recItem = document.getElementById(`rec-app-${appName}`);
    const titleText = isLocked ? `🔒 Locked — Complete ${req} first to unlock` : '';

    if (icon) {
      if (isLocked) {
        icon.classList.add('locked');
        icon.title = titleText;
      } else {
        icon.classList.remove('locked');
        icon.title = '';
      }
    }
    if (taskbarBtn) {
      if (isLocked) {
        taskbarBtn.classList.add('locked');
        taskbarBtn.title = titleText;
      } else {
        taskbarBtn.classList.remove('locked');
        taskbarBtn.title = '';
      }
    }
    if (startCard) {
      if (isLocked) {
        startCard.classList.add('locked');
        if (startBadge) {
          startBadge.className = 'start-tile-status lock';
          startBadge.textContent = '🔒 Locked';
        }
      } else {
        startCard.classList.remove('locked');
        if (startBadge) {
          startBadge.className = 'start-tile-status';
          startBadge.textContent = 'Ready';
        }
      }
    }
    if (recItem) {
      if (isLocked) {
        recItem.classList.add('hidden');
      } else {
        recItem.classList.remove('hidden');
      }
    }
  });
}

function openApp(appName) {
  if (isAppLocked(appName)) {
    const remaining = EMAILS.length - (gameState.emailResults ? gameState.emailResults.length : 0);
    showToast(`🔒 Locked: Complete all 5 email investigations first (${remaining} remaining) to unlock ${appName === 'folder' ? 'Folder' : appName === 'comms' ? 'Phone Link' : 'Anti-Virus'}!`, 'warning');
    if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
    return;
  }

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
  if (typeof AudioManager !== 'undefined') AudioManager.playWindowSound(true);

  if (appName === 'gmail') {
    updateFolderCounts();
  }

  if (appName === 'browser') {
    if (!browserTabs || browserTabs.length === 0) {
      initBrowserTabs();
    } else {
      renderActiveTab();
    }
  }

  if (appName === 'wifi-settings') {
    renderG4WiFiSettings();
  }

  // First time this app is opened, center it on screen so it isn't
  // hidden behind the Detective's Notes sticky note in the bottom-right corner.
  if (!state.hasBeenPositioned) {
    centerWindow(appName);
    state.hasBeenPositioned = true;
  }
}

// Centers a window on the desktop
function centerWindow(appName) {
  const win = document.getElementById(`win-${appName}`);
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  if (!win || !desktop) return;

  const w = win.offsetWidth || 800;
  const h = win.offsetHeight || 560;
  const viewportW = desktop.clientWidth;
  const viewportH = desktop.clientHeight - (taskbar ? taskbar.offsetHeight : 48);

  let left = Math.max(20, Math.round((viewportW - w) / 2));
  let top = Math.max(20, Math.round((viewportH - h) / 2));

  win.style.left = left + 'px';
  win.style.top = top + 'px';
}

function closeApp(appName) {
  const win = document.getElementById(`win-${appName}`);
  if (!win) return;
  if (appName === 'videoplayer') {
    const vid = document.getElementById('videoplayer-video');
    if (vid) vid.pause();
  }
  appState[appName].open = false;
  appState[appName].minimized = false;
  appState[appName].maximized = false;
  win.classList.add('hidden');
  win.classList.remove('maximized', 'focused');
  updateTaskbar();
  if (typeof AudioManager !== 'undefined') AudioManager.playWindowSound(false);
}

function minimizeApp(appName) {
  const win = document.getElementById(`win-${appName}`);
  appState[appName].minimized = true;
  win.classList.add('minimized');
  win.classList.remove('focused');
  updateTaskbar();
  if (typeof AudioManager !== 'undefined') AudioManager.playWindowSound(false);
}

function toggleMaximize(appName) {
  const win = document.getElementById(`win-${appName}`);
  const state = appState[appName];
  const maxBtn = win.querySelector('.win-maximize');
  if (state.maximized) {
    // Restore to saved size/position
    state.maximized = false;
    win.classList.remove('maximized');
    if (state._savedPos) {
      win.style.left   = state._savedPos.left;
      win.style.top    = state._savedPos.top;
      win.style.width  = state._savedPos.width;
      win.style.height = state._savedPos.height;
    }
    if (maxBtn) maxBtn.textContent = '□';
  } else {
    // Save current position/size before maximizing
    const rect = win.getBoundingClientRect();
    state._savedPos = {
      left:   win.style.left   || rect.left + 'px',
      top:    win.style.top    || rect.top  + 'px',
      width:  win.style.width  || rect.width  + 'px',
      height: win.style.height || rect.height + 'px'
    };
    state.maximized = true;
    win.classList.add('maximized');
    if (maxBtn) maxBtn.textContent = '❐';
  }
  focusWindow(appName);
}

let highestWindowZIndex = 120;

function focusWindow(appName) {
  if (!appName) return;
  document.querySelectorAll('.app-window').forEach(w => w.classList.remove('focused'));
  const win = document.getElementById(`win-${appName}`);
  if (win) {
    win.classList.add('focused');
    highestWindowZIndex += 2;
    if (highestWindowZIndex > 450) {
      const allWins = Array.from(document.querySelectorAll('.app-window'))
        .sort((a, b) => (parseInt(a.style.zIndex || 100, 10)) - (parseInt(b.style.zIndex || 100, 10)));
      allWins.forEach((w, idx) => {
        w.style.zIndex = 110 + idx * 2;
      });
      highestWindowZIndex = 110 + allWins.length * 2;
    }
    win.style.zIndex = highestWindowZIndex;
  }
  updateTaskbar();
}

function taskbarClick(appName) {
  if (isAppLocked(appName)) {
    const remaining = EMAILS.length - (gameState.emailResults ? gameState.emailResults.length : 0);
    showToast(`🔒 Locked: Complete all 5 email investigations first (${remaining} remaining) to unlock ${appName === 'folder' ? 'Folder' : 'Anti-Virus'}!`, 'warning');
    return;
  }

  const state = appState[appName];
  if (!state.open) {
    if (appName === 'browser') {
      openBrowserDefault();
    } else {
      openApp(appName);
    }
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
  updateAppLockStates();
  ['gmail', 'browser', 'folder', 'antivirus', 'comms', 'ransomware', 'wifi-settings', 'docviewer', 'imageviewer', 'videoplayer'].forEach(appName => {
    const btn = document.getElementById(`taskbar-${appName}`);
    if (!btn) return;
    const state = appState[appName];
    const win = document.getElementById(`win-${appName}`);

    btn.classList.remove('open', 'active', 'minimized');
    if (state.open) {
      btn.classList.remove('hidden');
      btn.classList.add('open');
      if (state.minimized) {
        btn.classList.add('minimized');
      } else if (win && win.classList.contains('focused')) {
        btn.classList.add('active');
      }
    } else {
      if (appName === 'docviewer' || appName === 'imageviewer' || appName === 'videoplayer') {
        btn.classList.add('hidden');
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
    if (e.target.closest('button') || e.target.closest('input')) return;
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

  // Double click titlebar to toggle maximize (desktop experience)
  document.addEventListener('dblclick', e => {
    const titlebar = e.target.closest('.win-titlebar');
    if (!titlebar || e.target.closest('button') || e.target.closest('input')) return;
    const win = titlebar.closest('.app-window');
    if (!win) return;
    const appName = win.dataset.app;
    if (appName) toggleMaximize(appName);
  });
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
  const s = now.getSeconds().toString().padStart(2, '0');
  
  const timeEl = document.getElementById('taskbar-time');
  if (timeEl) timeEl.textContent = `${h}:${m}`;
  const dateEl = document.getElementById('taskbar-date');
  if (dateEl) dateEl.textContent = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;

  // Live seconds and full date in words for the calendar flyout
  const calLiveTime = document.getElementById('cal-live-time');
  if (calLiveTime) {
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' becomes '12'
    calLiveTime.textContent = `${hours.toString().padStart(2, '0')}:${m}:${s} ${ampm}`;
  }

  const calDateWords = document.getElementById('cal-date-words');
  if (calDateWords) {
    calDateWords.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
updateClock();
setInterval(updateClock, 1000);

// ═══════════════════════════════════════════════════════════
// OVERLAY SYSTEM
// ═══════════════════════════════════════════════════════════

function showOverlay(id) {
  // Hide desktop immediately so it never bleeds through during transition
  const desktop = document.getElementById('desktop');
  if (desktop) desktop.style.visibility = 'hidden';

  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('overlay-backdrop').classList.add('active');
}

function closeOverlay(id) {
  document.getElementById(id).classList.remove('active');
  const anyActive = document.querySelectorAll('.overlay.active').length > 0;
  if (!anyActive) {
    document.getElementById('overlay-backdrop').classList.remove('active');
    // Reveal desktop only when no overlays remain AND loading screen is not active
    const ls = document.getElementById('overlay-loading-screen');
    const loadingActive = ls && ls.classList.contains('ls-active');
    if (!loadingActive) {
      const desktop = document.getElementById('desktop');
      if (desktop) desktop.style.visibility = 'visible';
    }
  }
}

function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  document.getElementById('overlay-backdrop').classList.remove('active');
  const av = document.getElementById('overlay-awareness-video');
  if (av) {
    av.classList.add('hidden');
    av.classList.remove('active');
    const vid = document.getElementById('awareness-real-video');
    if (vid) vid.pause();
  }
  // Only reveal desktop if the loading screen is NOT currently active
  const ls = document.getElementById('overlay-loading-screen');
  const loadingActive = ls && ls.classList.contains('ls-active');
  if (!loadingActive) {
    const desktop = document.getElementById('desktop');
    if (desktop) desktop.style.visibility = 'visible';
  }
}

// ═══════════════════════════════════════════════════════════
// PRE-ASSESSMENT EXAM — Baseline Diagnostic Questionnaire
// ═══════════════════════════════════════════════════════════

const PRE_ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    topic: 'phishing',
    question: 'What is phishing?',
    options: [
      'Catching real fish in a lake using a fishing rod',
      'A cyber attack where fake messages are used to steal passwords or personal info',
      'A computer program that cleans hardware dust from your PC',
      'A tool used to speed up computer video games'
    ],
    correctIndex: 1,
    teacherNote: 'Teacher Note: Phishing uses fake messages and deception to trick victims into revealing sensitive credentials or personal data.'
  },
  {
    id: 2,
    topic: 'phishing',
    question: 'Which of the following is a common warning sign of a phishing email?',
    options: [
      'It comes from your company\'s verified, official email domain',
      'It creates false panic, like "Your account will be closed in 15 minutes!"',
      'It contains no attachments and asks for no sensitive information',
      'It is addressed to your verified student or employee name'
    ],
    correctIndex: 1,
    teacherNote: 'Teacher Note: False urgency is a major red flag! Attackers want you to panic so you click before checking the facts.'
  },
  {
    id: 3,
    topic: 'phishing',
    question: 'What is the safest thing to do before clicking any link or button in an email?',
    options: [
      'Click it as fast as possible to see what opens',
      'Hover your mouse over the link to preview the actual destination web address (URL)',
      'Forward the email to everyone in your contact list',
      'Turn off your computer monitor immediately'
    ],
    correctIndex: 1,
    teacherNote: 'Teacher Note: Always hover to verify! Link text can say anything, but the previewed URL shows where you are truly heading.'
  },
  {
    id: 4,
    topic: 'phishing',
    question: 'If an email asks you to reply with your password or bank PIN, what should you do?',
    options: [
      'Reply immediately with your credentials',
      'Never send it — legitimate organizations will never ask for your password via email',
      'Send only the first half of your password',
      'Post your password on public social media to ask if it is safe'
    ],
    correctIndex: 1,
    teacherNote: 'Teacher Note: Legitimate companies, banks, and IT teams will NEVER ask you to email your password or PIN.'
  },
  {
    id: 5,
    topic: 'malware',
    question: 'What is malware?',
    options: [
      'Physical parts of a computer like the monitor and keyboard',
      'Malicious software created to damage, steal data from, or infect a computer',
      'An official anti-virus tool created to protect your files',
      'A high-speed internet connection cable'
    ],
    correctIndex: 1,
    teacherNote: 'Teacher Note: Malware (short for malicious software) includes viruses, worms, trojans, ransomware, and spyware.'
  },
  {
    id: 6,
    topic: 'malware',
    question: 'You see a file named "bonus_payroll.pdf.exe" in your Downloads folder. What is this?',
    options: [
      'A normal PDF document with extra security features',
      'A dangerous file hiding an executable program (.exe) behind a fake PDF name',
      'A photo file taken with a digital smartphone camera',
      'An official audio recording from your music playlist'
    ],
    correctIndex: 1,
    teacherNote: 'Teacher Note: Watch out for double extensions! Windows runs the final extension (.exe), launching malware while pretending to be a document.'
  },
  {
    id: 7,
    topic: 'malware',
    question: 'What can happen if you double-click a suspicious script attachment (like a .vbs or .bat file)?',
    options: [
      'It can silently execute hidden commands to download viruses onto your computer',
      'It will instantly clean your computer hard drive of all dust',
      'It will automatically print a free discount coupon from your printer',
      'It automatically changes your computer desktop wallpaper'
    ],
    correctIndex: 0,
    teacherNote: 'Teacher Note: Script files (.vbs, .bat) can run system commands behind the scenes to install malicious payloads.'
  },
  {
    id: 8,
    topic: 'malware',
    question: 'What is the main job of Anti-Virus software?',
    options: [
      'To scan, detect, and neutralize computer viruses and malware threats',
      'To sell used computer hardware and laptops online',
      'To make your screen brighter when watching movies',
      'To delete all your school documents every weekend'
    ],
    correctIndex: 0,
    teacherNote: 'Teacher Note: Anti-virus tools actively monitor files, scan for malicious signatures, and stop infections.'
  },
  {
    id: 9,
    topic: 'malware',
    question: 'What does "Quarantine" mean in anti-virus software?',
    options: [
      'Sharing the infected file with friends on social media',
      'Moving the dangerous file to a secure, isolated vault so it cannot run or infect the PC',
      'Running the infected file with full administrator rights',
      'Deleting your computer\'s operating system entirely'
    ],
    correctIndex: 1,
    teacherNote: 'Teacher Note: Quarantine locks the threat in an isolated, encrypted vault, stopping execution while keeping the file safely contained.'
  },
  {
    id: 10,
    topic: 'malware',
    question: 'What is a "False Positive" in cyber security?',
    options: [
      'When a clean, safe file is mistakenly flagged or quarantined as malware',
      'When a computer completely runs out of battery power',
      'When an anti-virus software changes its desktop icon',
      'When a computer file has no name at all'
    ],
    correctIndex: 0,
    teacherNote: 'Teacher Note: A false positive happens when a safe file is wrongly treated as a threat. Always verify before quarantining!'
  }
];

let preAssessmentAnswers = {};
let isPreAssessmentGraded = false;
let preAssessmentScore = 0;

function initPreAssessment() {
  renderPreAssessment();
}

function renderPreAssessment() {
  const listEl = document.getElementById('exam-questions-list');
  if (!listEl) return;

  const answeredCount = Object.keys(preAssessmentAnswers).length;
  const countEl = document.getElementById('exam-answered-count');
  if (countEl) countEl.innerHTML = `<strong>${answeredCount} of ${PRE_ASSESSMENT_QUESTIONS.length}</strong>`;

  const optionLetters = ['A', 'B', 'C', 'D'];

  listEl.innerHTML = PRE_ASSESSMENT_QUESTIONS.map((q, qIdx) => {
    const chosenOpt = preAssessmentAnswers[q.id];
    const isAnswered = chosenOpt !== undefined;
    const isCorrect = isAnswered && chosenOpt === q.correctIndex;

    let markHtml = '';
    let explanationHtml = '';

    if (isPreAssessmentGraded) {
      if (isCorrect) {
        markHtml = '<span class="exam-teacher-mark mark-correct">✔</span>';
      } else {
        markHtml = '<span class="exam-teacher-mark mark-wrong">✘</span>';
      }
      explanationHtml = `<div class="exam-teacher-explanation">✍️ ${q.teacherNote}</div>`;
    }

    const optionsHtml = q.options.map((opt, optIdx) => {
      let optClass = 'exam-opt-row';
      let tagHtml = '';

      if (isPreAssessmentGraded) {
        optClass += ' locked';
        if (optIdx === q.correctIndex) {
          optClass += ' teacher-circled-correct';
          tagHtml = '<span class="exam-teacher-opt-tag correct-tag">✔ Correct</span>';
        } else if (chosenOpt === optIdx) {
          optClass += ' student-wrong-pick';
          tagHtml = '<span class="exam-teacher-opt-tag wrong-tag">✘ Your Answer</span>';
        }
      } else {
        if (chosenOpt === optIdx) {
          optClass += ' selected';
        }
      }

      return `
        <div class="${optClass}" onclick="selectPreAssessmentOption(${q.id}, ${optIdx})">
          <div class="exam-opt-bubble">${optionLetters[optIdx]}</div>
          <div class="exam-opt-text">${opt}</div>
          ${tagHtml}
        </div>`;
    }).join('');

    return `
      <div class="exam-q-card" id="exam-q-${q.id}">
        <div class="exam-q-header">
          <div class="exam-q-text">${q.id}. ${q.question}</div>
          ${markHtml}
        </div>
        <div class="exam-opt-list">
          ${optionsHtml}
        </div>
        ${explanationHtml}
      </div>`;
  }).join('');

  // Update Teacher Grade Box and Action buttons
  const gradeBox = document.getElementById('exam-teacher-grade-box');
  const submitBtn = document.getElementById('btn-submit-exam');
  const proceedBtn = document.getElementById('btn-proceed-vn');
  const skipBtn = document.getElementById('btn-skip-exam');
  const floatingSkipBtn = document.getElementById('btn-floating-skip-exam');

  if (isPreAssessmentGraded) {
    if (gradeBox) {
      gradeBox.classList.remove('hidden');

      const stampTitle = document.getElementById('exam-stamp-title');
      const stampSub = document.getElementById('exam-stamp-sub');
      const stampEl = document.getElementById('exam-stamp');
      const scoreVal = document.getElementById('exam-score-val');
      const teacherNote = document.getElementById('exam-teacher-note');

      if (scoreVal) scoreVal.textContent = `${preAssessmentScore}/10`;

      if (preAssessmentScore >= 7) {
        if (stampTitle) stampTitle.textContent = 'PASSED';
        if (stampSub) stampSub.textContent = 'CYBER ACADEMY • CERTIFIED';
        if (stampEl) {
          stampEl.style.borderColor = '#c62828';
          stampEl.style.color = '#c62828';
        }
      } else {
        if (stampTitle) stampTitle.textContent = 'EVALUATED';
        if (stampSub) stampSub.textContent = 'ACADEMY REMEDIATION REQUIRED';
        if (stampEl) {
          stampEl.style.borderColor = '#d84315';
          stampEl.style.color = '#d84315';
        }
      }

      if (teacherNote) {
        if (preAssessmentScore >= 9) {
          teacherNote.textContent = '"Excellent! Outstanding cybersecurity knowledge and awareness. You demonstrate strong threat detection instincts against phishing and malware."';
        } else if (preAssessmentScore >= 7) {
          teacherNote.textContent = '"Passed! Good cybersecurity knowledge and awareness. Continue practicing to maintain high vigilance against sophisticated cyber threats."';
        } else if (preAssessmentScore >= 5) {
          teacherNote.textContent = '"Needs improvement: You have basic familiarity, but you need more cybersecurity knowledge and awareness to consistently identify disguised links and deceptive files."';
        } else {
          teacherNote.textContent = '"Needs remediation: You need more cybersecurity knowledge and awareness. Pay close attention to the simulation lessons to build essential defense habits against phishing and malware."';
        }
      }
    }

    if (submitBtn) submitBtn.classList.add('hidden');
    if (skipBtn) skipBtn.classList.add('hidden');
    if (floatingSkipBtn) floatingSkipBtn.classList.add('hidden');
    if (proceedBtn) proceedBtn.classList.remove('hidden');
  } else {
    if (gradeBox) gradeBox.classList.add('hidden');
    if (submitBtn) submitBtn.classList.remove('hidden');
    if (skipBtn) skipBtn.classList.remove('hidden');
    if (floatingSkipBtn) floatingSkipBtn.classList.remove('hidden');
    if (proceedBtn) proceedBtn.classList.add('hidden');
  }
}

function selectPreAssessmentOption(qId, optIdx) {
  if (isPreAssessmentGraded) return;
  preAssessmentAnswers[qId] = optIdx;
  if (typeof AudioManager !== 'undefined') {
    AudioManager.playExamChoice();
  }
  renderPreAssessment();
}

function submitPreAssessment() {
  const nameInput = document.getElementById('exam-input-name');
  const playerName = nameInput ? nameInput.value.trim() : '';

  if (!playerName) {
    showToast('✍️ Please write your Student Name on the exam paper before turning it in!', 'warning');
    if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
    if (nameInput) {
      nameInput.focus();
      nameInput.classList.add('highlight-pulse');
      setTimeout(() => nameInput.classList.remove('highlight-pulse'), 1200);
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  const answeredCount = Object.keys(preAssessmentAnswers).length;
  if (answeredCount < PRE_ASSESSMENT_QUESTIONS.length) {
    const missing = PRE_ASSESSMENT_QUESTIONS.length - answeredCount;
    showToast(`⚠️ Please answer all questions before turning in your paper (${missing} left)!`, 'warning');
    if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
    for (const q of PRE_ASSESSMENT_QUESTIONS) {
      if (preAssessmentAnswers[q.id] === undefined) {
        const el = document.getElementById(`exam-q-${q.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
    return;
  }

  gameState.playerName = playerName;
  if (nameInput) nameInput.disabled = true;

  let score = 0;
  PRE_ASSESSMENT_QUESTIONS.forEach(q => {
    if (preAssessmentAnswers[q.id] === q.correctIndex) {
      score++;
    }
  });

  isPreAssessmentGraded = true;
  preAssessmentScore = score;
  renderPreAssessment();

  const shell = document.getElementById('exam-paper-shell');
  if (shell) {
    shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (typeof AudioManager !== 'undefined') {
    if (score >= 7) AudioManager.playCorrect();
    else AudioManager.playWrong();
  }

  showToast(
    score >= 7
      ? `🎓 Exam Graded: ${score}/10 — PASSED! CyberZerØ is ready to guide you.`
      : `🎓 Exam Graded: ${score}/10 — Keep learning! Check the remarks.`,
    score >= 7 ? 'success' : 'warning'
  );
}

function proceedFromPreAssessmentToCategories() {
  const nameInput = document.getElementById('exam-input-name');
  const playerName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Ace';
  if (!gameState.playerName || gameState.playerName === 'Student') {
    gameState.playerName = playerName;
  }
  closeOverlay('overlay-pre-assessment');
  openCategoryHub();
  showToast('📁 Pre-assessment completed! Select your threat category to begin.', 'success');
}

function proceedFromPreAssessmentToVN() {
  proceedFromPreAssessmentToCategories();
}

function skipPreAssessment() {
  const nameInput = document.getElementById('exam-input-name');
  const playerName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Ace';
  if (!gameState.playerName || gameState.playerName === 'Student') {
    gameState.playerName = playerName;
  }
  if (typeof AudioManager !== 'undefined') {
    AudioManager.playExamChoice();
  }
  closeOverlay('overlay-pre-assessment');
  openCategoryHub();
  showToast('⏩ Assessment skipped — welcome to the Threat Categories Hub.', 'info');
}

function skipPreAssessmentFromIntro() {
  if (!gameState.playerName || gameState.playerName === 'Student') {
    gameState.playerName = 'Ace';
  }
  if (typeof AudioManager !== 'undefined') {
    AudioManager.playNotification();
  }
  closeOverlay('overlay-game-intro');
  openCategoryHub();
  showToast('⏩ Assessment skipped — choose your threat category.', 'info');
}

function retakePreAssessment() {
  isPreAssessmentGraded = false;
  preAssessmentAnswers = {};
  preAssessmentScore = 0;
  const nameInput = document.getElementById('exam-input-name');
  if (nameInput) {
    nameInput.disabled = false;
  }
  renderPreAssessment();
  const shell = document.getElementById('exam-paper-shell');
  if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('📝 Fresh exam sheet ready. Good luck!', 'info');
}

function openPreAssessment() {
  showOverlay('overlay-pre-assessment');
  renderPreAssessment();
}

// ═══════════════════════════════════════════════════════════
// THREAT CATEGORIES & PROGRESSION SYSTEM
// ═══════════════════════════════════════════════════════════

const CATEGORIES = [
  {
    id: 'phishing',
    num: 1,
    chapterRange: '1–3',
    chapterTag: 'CHAPTER 1–3',
    title: 'Phishing, Online Scams & Suspicious Links',
    subtitle: 'Chapters 1–3',
    accent: '#00e5ff',
    desc: 'Detect deceptive phishing emails, fraudulent online scams, and suspicious links to prevent credential theft.',
    specs: {
      threatType: 'Email Phishing & Fake Links',
      app: '📧 Email & 🌐 Browser',
      objective: '5 Threats Analyzed'
    },
    unlocked: true,
    completed: false,
    score: 0,
    rank: null
  },
  {
    id: 'malware',
    num: 2,
    chapterRange: '4–6',
    chapterTag: 'CHAPTER 4–6',
    title: 'Malware, Weak passwords & identity theft',
    subtitle: 'Chapters 4–6',
    accent: '#00e676',
    desc: 'Spot disguised malware infections, eliminate weak passwords, and defend against identity theft.',
    specs: {
      threatType: 'Malware & Password Breaches',
      app: '📂 Folder & 🛡️ Anti-Virus',
      objective: '4 Threats Quarantined'
    },
    unlocked: false,
    completed: false,
    score: 0,
    rank: null
  },
  {
    id: 'social_engineering',
    num: 3,
    chapterRange: '7–9',
    chapterTag: 'CHAPTER 7–9',
    title: 'Unsafe Public Wifi, Social Engineering & Malicious Download',
    subtitle: 'Chapters 7–9',
    accent: '#ea80fc',
    desc: 'Stay safe on public Wi-Fi networks, counter social engineering tactics, and block malicious file downloads.',
    specs: {
      threatType: 'Wi-Fi Hijacking & Rogue Downloads',
      app: '📱 Phone Link & 📶 Wi-Fi Settings',
      objective: '5 Stages Investigated'
    },
    unlocked: true,
    completed: false,
    score: 0,
    rank: null
  },
  {
    id: 'ransomware',
    num: 4,
    chapterRange: '10–12',
    chapterTag: 'CHAPTER 10–12',
    title: 'Account Security, Ransomware & Online Privacy',
    subtitle: 'Chapters 10–12',
    accent: '#ff5252',
    desc: 'Fortify overall account security, neutralize ransomware attacks, and safeguard your online privacy.',
    specs: {
      threatType: 'Ransomware & Privacy Exposure',
      app: '🔒 Security Console',
      objective: '100% Vault Secured'
    },
    unlocked: false,
    completed: false,
    score: 0,
    rank: null
  }
];

let activeCategoryStory = 'phishing';

function updateDesktopBackgroundForPhase(phase) {
  const desktop = document.getElementById('desktop');
  if (!desktop) return;
  // Always keep normal desktop background (CSS gradient), same as Chapter 1
  desktop.style.backgroundImage = "";
  desktop.style.backgroundSize = "";
  desktop.style.backgroundPosition = "";
}

function openCategoryHub() {
  // Called from exam/title flow
  _openCategoryHubInternal(false);
}

function openCategoryHubFromDesktop() {
  // Called from desktop icon or taskbar
  _openCategoryHubInternal(true);
}

function _openCategoryHubInternal(fromDesktop) {
  hideAllOverlays();
  updateDesktopBackgroundForPhase('hub');
  renderCategoryHub();
  showOverlay('overlay-category-select');
  updateAppLockStates();
  const label = document.getElementById('cat-hub-back-label');
  if (label) label.textContent = fromDesktop ? 'BACK TO DESKTOP' : 'TITLE MENU';
  const btn = document.getElementById('cat-hub-back-btn');
  if (btn) btn.dataset.fromDesktop = fromDesktop ? '1' : '0';
  if (typeof AudioManager !== 'undefined') {
    AudioManager.playWindowSound(true);
  }
}

function closeCategoryHubBack() {
  const btn = document.getElementById('cat-hub-back-btn');
  const fromDesktop = btn && btn.dataset.fromDesktop === '1';
  closeCategoryHub();
  if (!fromDesktop) {
    showOverlay('overlay-title-menu');
  }
}

function closeCategoryHub() {
  closeOverlay('overlay-category-select');
}

function renderCategoryHub() {
  const completedCount = CATEGORIES.filter(c => c.completed).length;
  const progEl = document.getElementById('cat-hub-progress-text');
  if (progEl) progEl.textContent = `${completedCount} / 4 Modules Completed`;

  const totalScore = CATEGORIES.reduce((sum, c) => sum + (c.score || 0), 0);
  const scoreEl = document.getElementById('cat-hub-score-val');
  if (scoreEl) scoreEl.textContent = `${totalScore} pts`;

  const gridEl = document.getElementById('cat-cards-grid');
  if (!gridEl) return;

  gridEl.innerHTML = CATEGORIES.map((cat, idx) => {
    let statusClass = 'cat-status-locked';
    let statusLabel = '🔒 Locked';
    let btnClass = 'cat-card-btn cat-btn-locked';
    let btnText = `🔒 CHAPTER ${cat.chapterRange}`;
    let prevChap = idx > 0 ? CATEGORIES[idx - 1].chapterRange : '1–3';
    let btnAction = `showToast('🔒 Complete Chapter ${prevChap} first to unlock ${cat.title}!', 'warning')`;

    if (cat.completed) {
      statusClass = 'cat-status-completed';
      statusLabel = `✓ Done (${cat.rank || 'S'})`;
      btnClass = 'cat-card-btn cat-btn-play';
      btnText = `🔄 Replay Ch. ${cat.chapterRange}`;
      btnAction = `startCategoryChapter('${cat.id}')`;
    } else if (cat.unlocked) {
      statusClass = 'cat-status-unlocked';
      statusLabel = '● UNLOCKED';
      btnClass = 'cat-card-btn cat-btn-play';
      btnText = `▶ PLAY CH. ${cat.chapterRange}`;
      btnAction = `startCategoryChapter('${cat.id}')`;
    }

    const cardClass = `cat-card ${cat.completed ? 'completed' : ''} ${!cat.unlocked ? 'locked' : ''}`;

    return `
      <div class="${cardClass}" style="--card-accent: ${cat.accent}"
           data-catid="${cat.id}"
           onclick="selectCategoryCard(this, '${cat.id}')">
        <div class="cat-card-top">
          <span class="cat-num-tag">${cat.chapterTag}</span>
          <span class="cat-status-badge ${statusClass}">${statusLabel}</span>
        </div>

        <div class="cat-card-body">
          <h3 class="cat-card-title">${cat.title}</h3>
          <p class="cat-card-desc">${cat.desc}</p>

          <div class="cat-card-specs">
            <div class="cat-spec-item"><span>Threat:</span> <strong>${cat.specs.threatType}</strong></div>
            <div class="cat-spec-item"><span>App:</span> <strong>${cat.specs.app || cat.specs.environment}</strong></div>
            <div class="cat-spec-item"><span>Goal:</span> <strong>${cat.specs.objective}</strong></div>
            ${cat.score ? `<div class="cat-spec-item" style="color:${cat.accent}"><span>Score:</span> <strong>${cat.score} pts</strong></div>` : ''}
          </div>

          <button class="${btnClass}" onclick="event.stopPropagation(); ${btnAction}">
            ${btnText}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Called when a card is clicked — adds flash + selected state
function selectCategoryCard(cardEl, catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  // Remove selected from all cards
  document.querySelectorAll('.cat-card').forEach(c => {
    c.classList.remove('selected', 'select-flash');
  });

  // Add flash animation then selected state
  cardEl.classList.add('select-flash');
  setTimeout(() => {
    cardEl.classList.remove('select-flash');
    cardEl.classList.add('selected');
  }, 450);
}

function previewCategoryCard() {}
function resetCategoryCard() {}

function startCategoryChapter(categoryId) {
  closeCategoryHub();
  playCategoryStory(categoryId);
}

function proceedToNextCategory(nextCatId) {
  closeOverlay('overlay-results');
  closeOverlay('overlay-malware-results');
  closeOverlay('overlay-social-results');
  closeOverlay('overlay-ransomware-results');

  const cat = CATEGORIES.find(c => c.id === nextCatId);
  if (cat && cat.unlocked) {
    playCategoryStory(nextCatId);
  } else {
    openCategoryHub();
  }
}

function returnToTitleFromCategories() {
  closeCategoryHub();
  showOverlay('overlay-title-menu');
}

function retakeExamFromCategories() {
  closeCategoryHub();
  openPreAssessment();
}

function completeCategory(catId, score, rank) {
  const idx = CATEGORIES.findIndex(c => c.id === catId);
  if (idx !== -1) {
    CATEGORIES[idx].completed = true;
    CATEGORIES[idx].score = Math.max(CATEGORIES[idx].score || 0, score || 0);
    CATEGORIES[idx].rank = rank || 'S';

    // Unlock next category in sequence
    if (idx + 1 < CATEGORIES.length) {
      CATEGORIES[idx + 1].unlocked = true;
      showToast(`🎉 Unlocked Chapter ${CATEGORIES[idx + 1].chapterRange}: ${CATEGORIES[idx + 1].title}!`, 'success');
    }
  }
  updateAppLockStates();
  renderCategoryHub();
}

// ═══════════════════════════════════════════════════════════
// VISUAL NOVEL INTRO & CHAPTER STORY ENGINE
// ═══════════════════════════════════════════════════════════

const VN_CHARACTER_MAP = {
  'NARRATOR':    null,
  'CYBERZERO':   'assets/CyberZerØ.png',
  'ZERO':        'assets/CyberZerØ.png',
  'AI GUIDE ZERO':'assets/CyberZerØ.png',
  'ACE':         'assets/Ace.png',
  'ACE (ALT)':   'assets/Ace1.png',
  'NISHREN':     'assets/Nishren.png',
  'NISHREN (ALT)':'assets/Nishren1.png',
  'PHILLIP':     'assets/Phillip.png',
  'PHILLIP (ALT)':'assets/Phillip1.png',
  'JONALD':      'assets/Jonald.png',
  'JONALD (ALT)':'assets/Jonald1.png',
  'SYSTEM':      null,
};

const VN_STORIES = {
  prologue: [
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'Greetings, Student. Welcome to CYBERZERØ — an interactive cybersecurity simulation where you will transform from zero knowledge into an alert cyber defender.',
      speed: 24,
      scene: 'story'
    },
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'I am CyberZerØ — or simply Zero. As your personal AI Guide and Narrator, I will mentor you through real-world digital investigations and teach you how to protect yourself online.',
      speed: 24,
      scene: 'story'
    },
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'Today, students rely heavily on online learning, school portals, and digital communications. But malicious adversaries constantly deploy deceptive traps to compromise student accounts and devices.',
      speed: 24,
      scene: 'story'
    },
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'In our simulation, you will join four senior high school friends — Ace, Nishren, Phillip, and Jonald — as they encounter four major categories of cyber threats.',
      speed: 24,
      scene: 'story'
    },
    {
      speaker: 'ACE',
      tag: '🎓 STUDENT • CHAPTER 1 DEFENDER',
      bg: 'assets/01Cover.png',
      text: '"Hey! I\'m Ace. In Chapter 1, I received an urgent email claiming my school account was suspended. Zero taught me how to inspect fake sender domains, spot false urgency, and uncover Phishing scams!"',
      speed: 26,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'NISHREN',
      tag: '🎓 STUDENT • CHAPTER 2 DEFENDER',
      bg: 'assets/01Cover.png',
      text: '"Hi, I\'m Nishren! In Chapter 2, I downloaded what looked like a class syllabus, but it was disguised as bonus_payroll.pdf.exe! With Zero\'s guidance, you\'ll hunt and quarantine hidden Malware."',
      speed: 26,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'PHILLIP',
      tag: '🎓 STUDENT • CHAPTER 3 DEFENDER',
      bg: 'assets/01Cover.png',
      text: '"I\'m Phillip. In Chapter 3, attackers impersonated school IT staff via urgent phone calls (Vishing) and text messages (Smishing). Together, we must defend against Social Engineering manipulation!"',
      speed: 26,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'JONALD',
      tag: '🎓 STUDENT • CHAPTER 4 DEFENDER',
      bg: 'assets/01Cover.png',
      text: '"And I\'m Jonald. In Chapter 4, our entire group project was encrypted by a Bitcoin extortionist! Zero guided us through isolating the network and restoring clean backups to defeat Ransomware."',
      speed: 26,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'To neutralize these threats, you will operate our simulated Desktop Environment: inspecting inboxes in Email, searching the Web Browser, examining files in Folder Explorer, running ShieldAV Anti-Virus, and taking command in the Incident Console.',
      speed: 24,
      scene: 'story'
    },
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'Now, before I deploy you into the live simulation workstations, there is a crucial first requirement.',
      speed: 24,
      scene: 'story'
    },
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'To tailor your training and accurately measure your learning journey from zero knowledge to cyber awareness, we need to know your baseline knowledge of cyber threats.',
      speed: 24,
      scene: 'story'
    },
    {
      speaker: 'ZERO',
      tag: '🤖 AI CYBER GUIDE & NARRATOR',
      bg: 'assets/Cover.png',
      text: 'You will now take our official 10-Question Cyber Threat Pre-Assessment Exam. Write your name on the test paper, analyze each question carefully, and do your best.\n\nStudent... are you ready?',
      speed: 24,
      scene: 'story'
    }
  ],

  phishing: [
    {
      speaker: 'NARRATOR',
      text: 'CHAPTER 1: The Video Call & Phishing Threat\n\nAfter school, four senior high school friends — Ace, Nishren, Phillip, and Jonald — connect on a video call to finish their group project.',
      speed: 26,
      scene: 'chapter1_intro'
    },
    {
      speaker: 'ACE',
      text: '"Alright team! Let\'s finish this project before the deadline!"',
      speed: 28,
      mood: 'happy',
      scene: 'videocall'
    },
    {
      speaker: 'PHILLIP',
      text: '"You said that last week."',
      speed: 28,
      mood: 'neutral',
      scene: 'videocall'
    },
    {
      speaker: 'JONALD',
      text: '"And then disappeared for three hours."',
      speed: 28,
      mood: 'neutral',
      scene: 'videocall'
    },
    {
      speaker: 'NISHREN',
      text: '"You mean gaming."',
      speed: 28,
      mood: 'happy',
      scene: 'videocall'
    },
    {
      speaker: 'ACE',
      text: '"Researching games!" Everyone laughs.',
      speed: 28,
      mood: 'happy',
      scene: 'videocall'
    },
    {
      speaker: 'NARRATOR',
      text: '📺 BREAKING NEWS: "Cyber threats targeting students continue to increase as online learning activities expand."',
      speed: 26,
      mood: 'neutral',
      scene: 'videocall',
      newsAlert: true
    },
    {
      speaker: 'CYBERZERO',
      text: 'Hello, students. I am CyberZerØ — your AI Guide for Cybersecurity Knowledge and Awareness.\n\nLearn. Detect. Defend.',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    },
    {
      speaker: 'ACE',
      text: '"Wait, I just received an urgent email saying my school account will be suspended in 30 minutes! Should I click the link?"',
      speed: 28,
      mood: 'worried',
      scene: 'story'
    },
    {
      speaker: 'CYBERZERO',
      text: 'Stop, Ace! Check the sender address and hover over the link. Attackers use urgency to make you panic. Let\'s investigate together on your desktop!',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    }
  ],

  malware: [
    {
      speaker: 'NARRATOR',
      text: 'CHAPTER 2: Nishren and the Disguised Software\n\nFollowing Ace\'s phishing investigation, Nishren searches online for free tools to compile the group project files.',
      speed: 26,
      scene: 'story'
    },
    {
      speaker: 'NISHREN',
      text: '"I found a free file compression tool online! It says \'bonus_payroll.pdf.exe\'. Let me double-click it..."',
      speed: 28,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'CYBERZERO',
      text: 'Warning! Notice the double extension: .pdf.exe! Windows executes the .exe binary, launching a hidden Trojan onto your system.',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    },
    {
      speaker: 'NISHREN',
      text: '"Uh-oh... my computer is slowing down and suspicious script files (.vbs) appeared in my Downloads folder!"',
      speed: 28,
      mood: 'worried',
      scene: 'story'
    },
    {
      speaker: 'CYBERZERO',
      text: 'Open the Folder app and ShieldAV Anti-Virus. Inspect true file extensions, run diagnostic scans, and quarantine all 4 malware threats!',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    }
  ],

  social_engineering: [
    {
      speaker: 'NARRATOR',
      text: 'CHAPTER 3: Group 4 Multimedia Project\n\nGroup 4 is working outside the school because the school network is temporarily unavailable. You use your laptop to continue the multimedia project, communicate with group members, and upload project files.',
      speed: 26,
      scene: 'story',
      bg: 'assets/background/Coffe shop.png'
    },
    {
      speaker: 'NARRATOR',
      text: '“Before you begin this chapter, watch a short 30-second awareness video. It introduces three cybersecurity threats you may encounter: unsafe public Wi-Fi, social engineering, and malicious downloads.\n\nPay attention to the warning signs and safety practices. You will use what you learn to investigate the situation yourself.”',
      speed: 26,
      scene: 'story',
      bg: 'assets/background/Coffe shop.png'
    }
  ],

  ransomware: [
    {
      speaker: 'NARRATOR',
      text: 'CHAPTER 4: Jonald and the Ransomware Extortion\n\nOn the night before final project submission, Jonald checks the team\'s shared project drive.',
      speed: 26,
      scene: 'story'
    },
    {
      speaker: 'JONALD',
      text: '"NO! All our project files are locked with a .locky extension! A ransom note popped up demanding Bitcoin payment!"',
      speed: 28,
      mood: 'worried',
      scene: 'story'
    },
    {
      speaker: 'CYBERZERO',
      text: 'Don\'t panic, Jonald, and NEVER pay the ransom! We have incident response procedures and immutable cloud backups.',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    },
    {
      speaker: 'JONALD',
      text: '"How do we stop it from spreading to the rest of the school network?"',
      speed: 28,
      mood: 'worried',
      scene: 'story'
    },
    {
      speaker: 'CYBERZERO',
      text: 'Open the Incident Console. Isolate compromised storage nodes, terminate malicious background dropper processes, and restore clean snapshots to achieve 100% recovery!',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    }
  ],

  grand_finale: [
    {
      speaker: 'NARRATOR',
      text: 'FINAL CHAPTER: The Virtual Classroom\n\nAfter successfully neutralizing all threats across Phishing, Malware, Social Engineering, and Ransomware, the four students gather in CyberZerØ\'s virtual classroom.',
      speed: 26,
      scene: 'story'
    },
    {
      speaker: 'CYBERZERO',
      text: 'Outstanding work, Ace, Nishren, Phillip, and Jonald! What have we learned on our cybersecurity journey?',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    },
    {
      speaker: 'ACE',
      text: '"How to spot phishing: verify sender addresses, never rush, and hover over every link!"',
      speed: 28,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'NISHREN',
      text: '"How to stop malware: check hidden file extensions, avoid unverified downloads, and scan with Anti-Virus!"',
      speed: 28,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'PHILLIP',
      text: '"How to defend against social engineering: never share passwords or MFA codes over calls or SMS!"',
      speed: 28,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'JONALD',
      text: '"How to respond to ransomware: isolate infected shares immediately and restore from immutable backups!"',
      speed: 28,
      mood: 'happy',
      scene: 'story'
    },
    {
      speaker: 'CYBERZERO',
      text: 'Knowledge is your strongest shield. Cybersecurity is for everyone — especially students.\n\n— CyberZerØ: Learn. Detect. Defend. —',
      speed: 26,
      mood: 'neutral',
      scene: 'story'
    }
  ]
};

let VN_DIALOGUE = VN_STORIES.phishing;

const vnState = {
  lineIndex: 0,
  charIndex: 0,
  typing: false,
  typingTimer: null,
  done: false
};

function playCategoryStory(categoryId) {
  activeCategoryStory = categoryId;
  VN_DIALOGUE = VN_STORIES[categoryId] || VN_STORIES.phishing;
  hideAllOverlays();
  showOverlay('overlay-welcome');
  vnInit();
}

function vnInit() {
  vnSpawnParticles();
  vnState.lineIndex = 0;
  vnState.done = false;
  vnState.typing = false;
  if (vnState.typingTimer) clearTimeout(vnState.typingTimer);
  const bgBackdrop = document.getElementById('vn-bg-backdrop');
  if (bgBackdrop) {
    if (activeCategoryStory === 'prologue') {
      bgBackdrop.style.backgroundImage = "url('assets/Cover.png')";
    } else if (activeCategoryStory === 'social_engineering') {
      bgBackdrop.style.backgroundImage = "url('assets/background/Coffe shop.png')";
    } else {
      bgBackdrop.style.backgroundImage = "url('assets/01Cover.png')";
    }
  }
  const skipBtn = document.getElementById('vn-skip-btn');
  if (skipBtn) {
    if (activeCategoryStory === 'prologue') {
      skipBtn.textContent = 'Skip to Assessment ⏩';
      skipBtn.title = 'Skip the intro and start the Pre-Assessment Exam';
    } else {
      skipBtn.textContent = 'Skip ⏩';
      skipBtn.title = 'Skip dialogue';
    }
  }
  const vcallStage = document.getElementById('vn-videocall-stage');
  if (vcallStage) vcallStage.classList.add('hidden');
  const welcomeOv = document.getElementById('overlay-welcome');
  if (welcomeOv) welcomeOv.classList.remove('vn-mode-videocall');
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

  const textEl        = document.getElementById('vn-text');
  const cursorEl      = document.getElementById('vn-cursor');
  const speakerEl     = document.getElementById('vn-speaker-name');
  const hintEl        = document.getElementById('vn-advance-hint');
  const indEl         = document.getElementById('vn-line-indicator');
  const charEl        = document.getElementById('vn-character');
  const spriteEl      = document.getElementById('vn-char-sprite');
  const charArea      = document.getElementById('vn-character-area');

  const vcallStage    = document.getElementById('vn-videocall-stage');
  const vcallWrapper  = document.getElementById('vcall-aspect-wrapper');
  const welcomeOv     = document.getElementById('overlay-welcome');
  const bgBackdrop    = document.getElementById('vn-bg-backdrop');
  const avatarWrap    = document.getElementById('vn-speaker-avatar-wrap');
  const avatarImg     = document.getElementById('vn-speaker-avatar');
  const speakerStatus = document.getElementById('vn-speaker-status');
  const newsBanner    = document.getElementById('vcall-news-banner');

  speakerEl.textContent = line.speaker;
  indEl.textContent = `${index + 1} / ${VN_DIALOGUE.length}`;
  hintEl.classList.remove('visible');
  cursorEl.classList.remove('visible');
  textEl.textContent = '';

  const imgSrc = VN_CHARACTER_MAP[line.speaker] || null;
  const isVideoCall = (line.scene === 'videocall');

  if (isVideoCall) {
    if (vcallStage) vcallStage.classList.remove('hidden');
    if (welcomeOv) welcomeOv.classList.add('vn-mode-videocall');

    if (charArea) {
      charArea.style.opacity = '0';
      charArea.style.display = 'none';
      if (charEl) charEl.classList.remove('vn-speaking');
    }

    const quads = {
      'NISHREN': document.getElementById('vcall-quad-nishren'),
      'ACE':     document.getElementById('vcall-quad-ace'),
      'PHILLIP': document.getElementById('vcall-quad-phillip'),
      'JONALD':  document.getElementById('vcall-quad-jonald')
    };

    Object.values(quads).forEach(q => q && q.classList.remove('active-speaker'));

    const activeQuad = quads[line.speaker];
    if (activeQuad) {
      activeQuad.classList.add('active-speaker');
      if (vcallWrapper) vcallWrapper.classList.add('has-active-speaker');

      if (avatarWrap) avatarWrap.classList.remove('hidden');
      if (avatarImg && imgSrc) avatarImg.src = imgSrc;
      if (speakerStatus) {
        speakerStatus.classList.remove('hidden');
        speakerStatus.textContent = `🟢 ${line.speaker} • SPEAKING ON CALL`;
        speakerStatus.style.color = '#00e676';
      }
      if (typeof AudioManager !== 'undefined') {
        AudioManager.playExamChoice();
      }
    } else {
      if (vcallWrapper) vcallWrapper.classList.remove('has-active-speaker');
      if (avatarWrap) avatarWrap.classList.add('hidden');
      if (speakerStatus) speakerStatus.classList.add('hidden');
    }

    if (newsBanner) {
      if (line.newsAlert) {
        newsBanner.classList.remove('hidden');
        if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
      } else {
        newsBanner.classList.add('hidden');
      }
    }

    const durEl = document.getElementById('vcall-duration');
    if (durEl) {
      const sec = 245 + Math.max(0, (index - 5) * 6);
      const m = String(Math.floor(sec / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      durEl.textContent = `${m}:${s}`;
    }
  } else {
    if (vcallStage) vcallStage.classList.add('hidden');
    if (welcomeOv) welcomeOv.classList.remove('vn-mode-videocall');
    if (avatarWrap) avatarWrap.classList.add('hidden');
    if (newsBanner) newsBanner.classList.add('hidden');

    if (line.tag && speakerStatus) {
      speakerStatus.classList.remove('hidden');
      speakerStatus.textContent = line.tag;
      speakerStatus.style.color = (line.speaker === 'ZERO' || line.speaker === 'CYBERZERO' || line.speaker === 'AI GUIDE ZERO') ? 'var(--accent-cyan)' : '#a7f3d0';
    } else if (speakerStatus) {
      speakerStatus.classList.add('hidden');
    }

    if (line.bg && bgBackdrop) {
      bgBackdrop.style.backgroundImage = `url('${line.bg}')`;
    } else if (bgBackdrop) {
      if (activeCategoryStory === 'prologue') {
        bgBackdrop.style.backgroundImage = "url('assets/Cover.png')";
      } else if (activeCategoryStory === 'social_engineering') {
        bgBackdrop.style.backgroundImage = "url('assets/background/Coffe shop.png')";
      } else {
        bgBackdrop.style.backgroundImage = "url('assets/01Cover.png')";
      }
    }

    if (spriteEl && charArea) {
      if (imgSrc) {
        charArea.style.opacity = '0';
        charArea.style.transition = 'opacity 0.35s ease';
        const isAIZero = (line.speaker === 'ZERO' || line.speaker === 'CYBERZERO' || line.speaker === 'AI GUIDE ZERO');
        spriteEl.innerHTML = `<img src="${imgSrc}" alt="${line.speaker}" class="vn-char-img ${isAIZero ? 'ai-zero' : ''}" />`;
        charArea.style.display = 'flex';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { charArea.style.opacity = '1'; });
        });
        if (charEl) charEl.classList.add('vn-speaking');
      } else {
        charArea.style.opacity = '0';
        charArea.style.display = 'none';
        if (charEl) charEl.classList.remove('vn-speaking');
      }
    }
  }

  const colours = {
    'CYBERZERO':     'var(--accent-cyan)',
    'ZERO':          '#00f0ff',
    'AI GUIDE ZERO': '#00f0ff',
    'NARRATOR':      'var(--accent-blue)',
    'ACE':           '#f9a825',
    'NISHREN':       '#81c784',
    'PHILLIP':       '#ba68c8',
    'JONALD':        '#e57373',
    'SYSTEM':        'var(--accent-cyan)',
  };
  speakerEl.style.color = colours[line.speaker] || 'var(--accent-cyan)';

  if (vnState.typingTimer) clearTimeout(vnState.typingTimer);
  vnState.typing = true;
  vnState.charIndex = 0;

  function typeNextChar() {
    if (vnState.charIndex < line.text.length) {
      const ch = line.text[vnState.charIndex];
      textEl.textContent += ch;
      vnState.charIndex++;
      if (typeof AudioManager !== 'undefined' && ch.trim().length > 0) {
        AudioManager.playNarratorTyping();
      }
      vnState.typingTimer = setTimeout(typeNextChar, line.speed);
    } else {
      vnState.typing = false;
      if (charEl && charArea && charArea.style.display !== 'none') charEl.classList.remove('vn-speaking');
      cursorEl.classList.add('visible');
      hintEl.classList.add('visible');
      const hint = hintEl.querySelector('span:first-child');
      
      let nextLabel = 'Click to continue';
      if (index === VN_DIALOGUE.length - 1) {
        if (activeCategoryStory === 'prologue') nextLabel = '📝 Start Pre-Assessment Exam ➔';
        else if (activeCategoryStory === 'phishing') nextLabel = 'Start Phishing Demo ➔';
        else if (activeCategoryStory === 'malware') nextLabel = 'Start Malware Lab ➔';
        else if (activeCategoryStory === 'social_engineering') nextLabel = '🎬 Start Social Engineering Mission ➔';
        else if (activeCategoryStory === 'ransomware') nextLabel = 'Start Ransomware Console ➔';
        else if (activeCategoryStory === 'grand_finale') nextLabel = 'View Master Certificate ➔';
      }
      hint.textContent = nextLabel;
      if (index === VN_DIALOGUE.length - 1) vnState.done = true;
    }
  }
  typeNextChar();
}

function vnAdvance() {
  const line = VN_DIALOGUE[vnState.lineIndex];
  if (vnState.typing) {
    if (vnState.typingTimer) clearTimeout(vnState.typingTimer);
    vnState.typing = false;
    const textEl   = document.getElementById('vn-text');
    const cursorEl = document.getElementById('vn-cursor');
    const hintEl   = document.getElementById('vn-advance-hint');
    const charEl   = document.getElementById('vn-character');
    const charArea = document.getElementById('vn-character-area');
    textEl.textContent = line.text;
    if (charEl && charArea && charArea.style.display !== 'none') charEl.classList.remove('vn-speaking');
    cursorEl.classList.add('visible');
    hintEl.classList.add('visible');
    const hint = hintEl.querySelector('span:first-child');
    
    let nextLabel = 'Click to continue';
    if (vnState.lineIndex === VN_DIALOGUE.length - 1) {
      if (activeCategoryStory === 'prologue') nextLabel = '📝 Start Pre-Assessment Exam ➔';
      else if (activeCategoryStory === 'phishing') nextLabel = 'Start Phishing Demo ➔';
      else if (activeCategoryStory === 'malware') nextLabel = 'Start Malware Lab ➔';
      else if (activeCategoryStory === 'social_engineering') nextLabel = '🎬 Start Social Engineering Mission ➔';
      else if (activeCategoryStory === 'ransomware') nextLabel = 'Start Ransomware Console ➔';
      else if (activeCategoryStory === 'grand_finale') nextLabel = 'View Master Certificate ➔';
    }
    hint.textContent = nextLabel;
    if (vnState.lineIndex === VN_DIALOGUE.length - 1) vnState.done = true;
    return;
  }

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
  const vcallStage = document.getElementById('vn-videocall-stage');
  if (vcallStage) vcallStage.classList.add('hidden');
  const welcomeOv = document.getElementById('overlay-welcome');
  if (welcomeOv) welcomeOv.classList.remove('vn-mode-videocall');
  closeOverlay('overlay-welcome');

  if (activeCategoryStory === 'prologue') {
    proceedFromIntroToExam();
  } else if (activeCategoryStory === 'phishing') {
    startDemo();
  } else if (activeCategoryStory === 'malware') {
    startMalwareDemo();
  } else if (activeCategoryStory === 'social_engineering') {
    startGroup4Mission();
  } else if (activeCategoryStory === 'ransomware') {
    startRansomwareMission();
  } else if (activeCategoryStory === 'grand_finale') {
    showGrandCertificate();
  } else {
    openCategoryHub();
  }
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
    speech: `<strong>Hey there, Student! 🎓</strong><br><br>I'm <strong>Detective Zero</strong>. I'll walk you through <strong>2 emails</strong> — one <span style="color:#ff6b6b">phishing</span>, one <span style="color:#69db7c">legitimate</span> — so you know what to look for.`,
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
    speech: `🔴 <strong>RED FLAG #1 — FAKE SENDER</strong><br><br><em>bpi.security.verification@gmail.com</em> uses a free public <strong>@gmail.com</strong> address instead of the official bank domain (<em>@bpi.com.ph</em>)! Legitimate banks NEVER email you from Gmail.<br><br>First, click 🚩 <strong>Flag Evidence</strong> to turn on flag mode, then flag it →`,
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
    speech: `🕵️ <strong>CAUGHT IT.</strong><br><br>The real destination is <em>https://bpi-online-security.com/login</em> — a fake phishing portal built to steal banking credentials.<br><br>Flagging it as evidence #3 →`,
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
    speech: `🏆 <strong>TRAINING COMPLETE, STUDENT!</strong><br><br>🔎 <strong>Spot phishing</strong> — fake senders, pressure tactics, bad links<br>🛡️ <strong>Recognize legit</strong> — verified domain, no urgency<br><br><strong>Your mission:</strong> 5 real emails. Read, flag the evidence, and submit your verdict.`,
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
  updateDesktopBackgroundForPhase('phishing');

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
  const evPanel = document.getElementById('gdemo-evidence-panel');
  if (evPanel) evPanel.classList.remove('hidden');
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
                  gdemoFlags.push({ icon: '🚩', label: 'FAKE SENDER', text: 'bpi.security.verification@gmail.com' });
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
          gdemoFlags.push({ icon: '🚩', label: 'SUSPICIOUS LINK', text: 'https://bpi-online-security.com/login' });
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

      const evPanel = document.getElementById('gdemo-evidence-panel');
      if (evPanel) evPanel.classList.add('hidden');

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
  if (!target || !workspace || !cursor) { if (cb) cb(); return; }

  // Ensure target is scrolled into view if needed
  if (typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  setTimeout(() => {
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
  }, 100);
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
  gameState.readSentIds = [];

  hideAllOverlays();
  renderEmailList();
  updateHUD();
  updateFolderCounts();
  updateAppLockStates();

  document.getElementById('hud').classList.remove('hidden');
  openApp('gmail');

  showToast('🕵️ Mission started! Investigate your inbox.', 'success');

  // Pop up the scoring sticky note beside the desktop once the demo is done
  updateStickyNoteForPhase('phishing');
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

function updateStickyNoteForPhase(phase) {
  const titleEl = document.getElementById('sticky-note-title');
  const scrollEl = document.querySelector('#sticky-note .sticky-note-scroll');
  if (!scrollEl) return;

  if (phase === 'malware') {
    if (titleEl) titleEl.textContent = "🛡️ Malware Hunter Notes";
    scrollEl.innerHTML = `
      <div class="sticky-note-title" style="color:#b388ff;border-bottom:1px solid rgba(179,136,255,0.3);padding-bottom:4px;margin-bottom:8px">Chapter 2: Malware Scoring</div>
      <ul class="sticky-note-list">
        <li><span class="sn-icon sn-good">🛡️</span><span>Quarantine real Malware: <strong>+100</strong> (highest)</span></li>
        <li><span class="sn-icon sn-bad">⚠️</span><span>False Positive (Clean file): <strong>−25</strong></span></li>
        <li><span class="sn-icon sn-good">⚡</span><span>Anti-Virus Scan: <strong>Free check</strong></span></li>
        <li><span class="sn-icon sn-good">🎯</span><span>Goal: Neutralize all <strong>4 threats</strong></span></li>
        <li><span class="sn-icon sn-good">🏆</span><span>Rank S Target: <strong>4/4, 0 False Positives</strong></span></li>
        <li><span class="sn-icon sn-good">📊</span><span>Watch your live score in <strong>top-right HUD</strong></span></li>
      </ul>
      <div class="sticky-note-tip" style="border-left: 3px solid #b388ff; background: rgba(179,136,255,0.12)">
        💡 <strong>Detective Tip:</strong> Check actual extension in Folder (e.g. <code>.pdf.exe</code>, <code>.vbs</code>) and run an Anti-Virus scan before clicking Quarantine!
      </div>`;
    showStickyNote();
  } else {
    if (titleEl) titleEl.textContent = "📒 Detective's Notes";
    scrollEl.innerHTML = `
      <div class="sticky-note-title">How Scoring Works</div>
      <ul class="sticky-note-list">
        <li><span class="sn-icon sn-good">✅</span><span>Correct Phishing verdict <strong>+100</strong> (highest)</span></li>
        <li><span class="sn-icon sn-good">✅</span><span>Correct Legitimate verdict <strong>+50</strong></span></li>
        <li><span class="sn-icon sn-good">🚩</span><span>Each correct evidence flag <strong>+25</strong></span></li>
        <li><span class="sn-icon sn-bad">❌</span><span>Wrong verdict <strong>−50</strong></span></li>
        <li><span class="sn-icon sn-bad">⚠️</span><span>Wrong flag placed <strong>−10</strong></span></li>
        <li><span class="sn-icon sn-bad">🔍</span><span>Missed a real clue (even if verdict's right) <strong>−25</strong></span></li>
        <li><span class="sn-icon sn-good">📊</span><span>Watch your live score in the <strong>top-right corner</strong></span></li>
      </ul>
      <div class="sticky-note-tip">
        💡 A correct verdict isn't enough on its own — find every clue too, or you'll lose points for what you missed.
      </div>`;
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
  updateAppLockStates();
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
  const inboxBadge = document.getElementById('inbox-count');
  const sentBadge = document.getElementById('sent-count');
  const trashBadge = document.getElementById('trash-count');

  // Inbox badge: count remaining uncompleted/uninvestigated emails
  if (inboxBadge) {
    const remainingInbox = EMAILS.filter(e => !gameState.emailResults.some(r => r.emailId === e.id)).length;
    inboxBadge.textContent = remainingInbox;
    inboxBadge.style.display = remainingInbox > 0 ? 'inline-block' : 'none';
  }

  // Sent badge: count unread/unopened sent emails (excluding trashed ones)
  if (sentBadge) {
    if (!gameState.readSentIds) gameState.readSentIds = [];
    const unreadSent = SENT_EMAILS.filter(e => !gameState.trashedSentIds.includes(e.id) && !gameState.readSentIds.includes(e.id)).length;
    sentBadge.textContent = unreadSent;
    sentBadge.style.display = unreadSent > 0 ? 'inline-block' : 'none';
  }

  // Trash badge: count trashed items
  if (trashBadge) {
    const trashCount = gameState.trashedSentIds ? gameState.trashedSentIds.length : 0;
    trashBadge.textContent = trashCount;
    trashBadge.style.display = trashCount > 0 ? 'inline-block' : 'none';
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
    const initial = gameState.playerName ? gameState.playerName.charAt(0).toUpperCase() : 'S'; // Student — the player is the sender
    const avatarColors = ['#5c6bc0', '#00897b'];
    const avatarColor = avatarColors[idx % avatarColors.length];

    const isRead = (folder === 'sent') ? (gameState.readSentIds && gameState.readSentIds.includes(email.id)) : true;
    const item = document.createElement('div');
    item.className = `email-list-item ${isRead ? 'read' : 'unread'}`;

    let actionBtn = '';
    if (folder === 'sent') {
      actionBtn = `<button class="email-action-btn email-delete-btn" title="Delete" onclick="event.stopPropagation(); deleteSentEmail(${email.id})">🗑</button>`;
    } else {
      actionBtn = `<button class="email-action-btn email-restore-btn" title="Restore" onclick="event.stopPropagation(); restoreSentEmail(${email.id})">↩ Restore</button>`;
    }

    let dotHtml = '';
    if (!isRead && folder === 'sent') {
      dotHtml = `<div class="email-status-dot"></div>`;
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
        ${dotHtml}
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

  // If opening a sent email, mark as read/seen and update folder badges
  if (folder === 'sent') {
    if (!gameState.readSentIds) gameState.readSentIds = [];
    if (!gameState.readSentIds.includes(id)) {
      gameState.readSentIds.push(id);
    }
    updateFolderCounts();
  }

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
      <span class="email-meta-value">${escapeHtml(gameState.playerName || 'Student')} (You)</span>
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
  updateFolderCounts();
  renderEmailList();
}

function restoreSentEmail(id) {
  gameState.trashedSentIds = gameState.trashedSentIds.filter(x => x !== id);
  showToast('↩ Restored to Sent', 'success');
  updateFolderCounts();
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
      <span class="email-meta-value" style="color:var(--text-muted)">me@cybercorp.com</span>
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
      link.setAttribute('oncontextmenu', 'handleEmailLinkRightClick(event, this)');
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

function handleEmailLinkRightClick(event, el) {
  event.preventDefault();
  const destination = el.dataset.destination;
  if (destination) {
    showLinkPopup(el, destination);
  }
}

function handleEmailLinkClick(event, el) {
  event.preventDefault();
  const destination = el.dataset.destination;
  if (gameState.flagModeActive) {
    placeFlag(el);
    return;
  }
  if (destination) {
    // Directly open the phishing website in the browser app
    openSuspiciousSite(destination);
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
  const win = document.getElementById('win-browser');
  if (win) {
    win.classList.remove('hidden', 'minimized');
  }
  if (appState.browser) {
    appState.browser.open = true;
    appState.browser.minimized = false;
  }

  openApp('browser');
  focusWindow('browser');

  // If browser is floating (not maximized), center it prominently so the user immediately sees it pop up
  if (win && (!appState.browser || !appState.browser.maximized)) {
    centerWindow('browser');
  }

  if (!browserTabs || browserTabs.length === 0) {
    initBrowserTabs();
  }

  const existingTab = browserTabs ? browserTabs.find(t => t.url === url) : null;
  if (existingTab) {
    switchTab(existingTab.id);
  } else {
    const activeTab = getActiveTab();
    if (activeTab && (activeTab.url === 'https://www.google.com' || activeTab.url === '') && activeTab.history.length <= 1) {
      navigateBrowser(url);
    } else {
      createNewBrowserTab(url);
    }
  }

  // Visual pop-in animation to give responsive feedback
  if (win) {
    win.classList.remove('window-pop-in');
    void win.offsetWidth;
    win.classList.add('window-pop-in');
  }
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
  if (typeof AudioManager !== 'undefined') AudioManager.playFlagChirp();
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
      if (typeof AudioManager !== 'undefined') AudioManager.playCorrect();
    } else {
      emailScore -= 50;
      if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
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
    updateFolderCounts();
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
  completeCategory('phishing', gameState.score, rank);
  updateAppLockStates();
  // Update sticky note to Malware points system for Chapter 2
  updateStickyNoteForPhase('malware');
  showOverlay('overlay-results');
  if (typeof AudioManager !== 'undefined') AudioManager.playMissionComplete();
}

// ═══════════════════════════════════════════════════════════
// PLAY AGAIN
// ═══════════════════════════════════════════════════════════

function playAgain() {
  // Reset state
  updateStickyNoteForPhase('phishing');
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
  gameState.currentFolder = 'inbox';
  gameState.trashedSentIds = [];
  gameState.readSentIds = [];
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
  browserTabs = [];
  browserActiveTabId = 0;
  browserTabCounter = 0;
  browserHistory = [];
  browserCurrentIdx = -1;
  browserBypassed = new Set();
  document.getElementById('browser-content').innerHTML = BROWSER_HOME_HTML;
  document.getElementById('browser-url-input').value = '';
  document.getElementById('browser-security').textContent = '🔒 Secure';
  document.getElementById('browser-security').className = 'browser-security-indicator secure';
  const strip = document.getElementById('browser-tabs-strip');
  if (strip) strip.innerHTML = '';

  showOverlay('overlay-welcome');
  vnInit();
}

// ═══════════════════════════════════════════════════════════
// BROWSER
// ═══════════════════════════════════════════════════════════

let browserHistory = [];
let browserCurrentIdx = -1;
let browserBypassed = new Set(); // URLs the player chose to "Proceed (unsafe)" past the cert warning

// ── MULTI-TAB SYSTEM ──────────────────────────────────────
// Each tab: { id, url, title, icon, history, histIdx }
let browserTabs = [];
let browserActiveTabId = 0;
let browserTabCounter = 0;

function initBrowserTabs() {
  browserTabs = [];
  browserTabCounter = 0;
  browserActiveTabId = 0;
  const homeTab = createTabObj('https://www.google.com', 'Google', '🌐');
  browserTabs.push(homeTab);
  browserActiveTabId = homeTab.id;
  renderTabStrip();
  renderActiveTab();
}

function createTabObj(url, title, icon) {
  return {
    id: ++browserTabCounter,
    url: url,
    title: title,
    icon: icon,
    history: [url],
    histIdx: 0
  };
}

function getActiveTab() {
  return browserTabs.find(t => t.id === browserActiveTabId) || null;
}

function switchTab(tabId) {
  browserActiveTabId = tabId;
  renderTabStrip();
  renderActiveTab();
}

function closeTab(tabId, event) {
  if (event) event.stopPropagation();
  const idx = browserTabs.findIndex(t => t.id === tabId);
  if (idx === -1) return;
  browserTabs.splice(idx, 1);
  if (browserTabs.length === 0) {
    // Re-open a blank tab
    initBrowserTabs();
    return;
  }
  if (browserActiveTabId === tabId) {
    const newIdx = Math.min(idx, browserTabs.length - 1);
    browserActiveTabId = browserTabs[newIdx].id;
  }
  renderTabStrip();
  renderActiveTab();
}

function createNewBrowserTab(url) {
  url = url || 'https://www.google.com';
  const tab = createTabObj(url, 'New Tab', '🌐');
  browserTabs.push(tab);
  browserActiveTabId = tab.id;
  renderTabStrip();
  renderPageIntoTab(tab, url);
}

function renderTabStrip() {
  const strip = document.getElementById('browser-tabs-strip');
  if (!strip) return;
  strip.innerHTML = browserTabs.map(tab => `
    <div class="browser-tab${tab.id === browserActiveTabId ? ' active' : ''}" onclick="switchTab(${tab.id})" title="${tab.url}">
      <span class="browser-tab-favicon">${tab.icon}</span>
      <span class="browser-tab-title">${escapeHtml(tab.title)}</span>
      <button class="browser-tab-close" onclick="closeTab(${tab.id}, event)" title="Close tab">✕</button>
    </div>
  `).join('') +
  `<button class="browser-new-tab-btn" onclick="createNewBrowserTab()" title="New Tab">+</button>`;
}

function renderActiveTab() {
  const tab = getActiveTab();
  if (!tab) return;
  const urlInput = document.getElementById('browser-url-input');
  if (urlInput) urlInput.value = tab.url === 'https://www.google.com' ? '' : tab.url;
  // Sync global history vars for back/forward
  browserHistory = tab.history;
  browserCurrentIdx = tab.histIdx;
  updateBrowserNavBtns();
  _applyPageToContent(tab.url);
}

function renderPageIntoTab(tab, url) {
  tab.url = url;
  // Update tab history
  tab.history = tab.history.slice(0, tab.histIdx + 1);
  if (tab.history[tab.histIdx] !== url) {
    tab.history.push(url);
    tab.histIdx = tab.history.length - 1;
  }
  browserHistory = tab.history;
  browserCurrentIdx = tab.histIdx;
  const urlInput = document.getElementById('browser-url-input');
  if (urlInput) urlInput.value = url === 'https://www.google.com' ? '' : url;
  updateBrowserNavBtns();
  _applyPageToContent(url);
  // Update tab title/icon from security indicator side effect
  const tabTitle = document.getElementById('browser-tab-title-fake');
  renderTabStrip();
}

function extractHostFromUrl(url) {
  if (!url) return 'this site';
  try {
    const u = new URL(url);
    return u.hostname || url;
  } catch (e) {
    let clean = (url || '').replace(/^https?:\/\//i, '').trim();
    clean = clean.split('/')[0].split('?')[0].split('#')[0];
    return clean || url;
  }
}

function getPhishingSiteForUrl(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes('bpi-online-security.com')) {
    return {
      key: 'https://bpi-online-security.com/login',
      title: 'BPI Online — Security Verification',
      icon: '🏦',
      html: FAKE_SITES['https://bpi-online-security.com/login']
    };
  }
  if (lower.includes('paypal-account-check.com')) {
    return {
      key: 'https://paypal-account-check.com/login',
      title: 'Log in to your PayPal account',
      icon: '🅿️',
      html: FAKE_SITES['https://paypal-account-check.com/login']
    };
  }
  if (lower.includes('gcash-claim-rewards.com')) {
    return {
      key: 'https://gcash-claim-rewards.com/verify',
      title: 'GCash — Claim Rewards Portal',
      icon: '📱',
      html: FAKE_SITES['https://gcash-claim-rewards.com/verify']
    };
  }
  return null;
}

function isInternetConnected() {
  if (typeof networkSettings === 'undefined') return true;
  if (networkSettings.airplane) return false;
  if (!networkSettings.wifi) return false;
  if (!networkSettings.currentSsid) return false;
  return true;
}

function openWifiSettingsFromBrowser() {
  openApp('wifi-settings');
  focusWindow('wifi-settings');
  if (typeof switchWifiSettingsTab === 'function') {
    switchWifiSettingsTab('wifi');
  }
  showToast('📶 Opened Wi-Fi Settings — turn on Wi-Fi to reconnect.', 'info');
}

function renderChromeOfflineError(url) {
  return `
    <div class="chrome-error-page chrome-offline-page">
      <div class="chrome-error-container">
        <div class="chrome-error-icon chrome-dino-icon" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 48 48" fill="#5f6368" style="display:block;">
            <path d="M30 4h14v4h2v8h-2v2h-6v4h6v2h-4v2h-4v2h-2v2h-2v4h2v2h4v2h-6v2h-2v2h-2v2h-2v2h-2v4h-2v4h-4v-4h2v-4h2v-2h2v-2h2v-2h2v-2h-2v-4h-2v-2h-2v-2h-2v-2h-2v-2h-2v-4h2v-2h2v-2h2v-4h2v-4h2v-2h2V4z M40 8h2v2h-2z"/>
            <rect x="22" y="24" width="4" height="2" fill="#5f6368"/>
            <rect x="20" y="32" width="2" height="6" fill="#5f6368"/>
            <rect x="26" y="32" width="2" height="6" fill="#5f6368"/>
          </svg>
        </div>
        <h1 class="chrome-error-heading">No internet</h1>
        <div class="chrome-error-suggestions">
          <p class="chrome-error-try" style="font-size:14px;color:#5f6368;margin-bottom:8px;font-weight:500;">Try:</p>
          <ul class="chrome-error-list">
            <li>Checking the network cables, modem, and router</li>
            <li><a href="#" class="chrome-diag-link" onclick="openWifiSettingsFromBrowser(); return false;">Reconnecting to Wi-Fi</a></li>
            <li><a href="#" class="chrome-diag-link" onclick="openNetworkDiagnostics('wifi'); return false;">Running Windows Network Diagnostics</a></li>
          </ul>
        </div>
        <div class="chrome-error-actions">
          <button class="chrome-reload-btn" id="chrome-reload-btn" onclick="triggerChromeReload('${escapeHtml(url)}')">
            <span class="chrome-reload-icon">🔄</span> Reload
          </button>
        </div>
        <div class="chrome-error-code">ERR_INTERNET_DISCONNECTED</div>
      </div>
    </div>
  `;
}

function renderChromeDnsError(url) {
  const hostname = extractHostFromUrl(url);
  return `
    <div class="chrome-error-page">
      <div class="chrome-error-container">
        <div class="chrome-error-icon" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <h1 class="chrome-error-heading">This site can’t be reached</h1>
        <p class="chrome-error-msg">
          Check if there is a typo in <strong class="chrome-error-domain">${escapeHtml(hostname)}</strong>.
        </p>
        <div class="chrome-error-suggestions">
          <ul class="chrome-error-list">
            <li>If spelling is correct, try <a href="#" class="chrome-diag-link" onclick="openNetworkDiagnostics('${escapeHtml(hostname)}'); return false;">running Windows Network Diagnostics</a>.</li>
          </ul>
        </div>
        <div class="chrome-error-actions">
          <button class="chrome-reload-btn" id="chrome-reload-btn" onclick="triggerChromeReload('${escapeHtml(url)}')">
            <span class="chrome-reload-icon">🔄</span> Reload
          </button>
        </div>
        <div class="chrome-error-code">DNS_PROBE_FINISHED_NXDOMAIN</div>
      </div>
    </div>
  `;
}

function triggerChromeReload(url) {
  const btn = document.getElementById('chrome-reload-btn');
  const tab = getActiveTab();
  const security = document.getElementById('browser-security');

  if (btn) {
    btn.classList.add('loading');
    btn.innerHTML = '<span class="chrome-reload-spinner"></span> Reloading...';
    btn.disabled = true;
  }

  if (tab) {
    tab.icon = '🔄';
    tab.title = 'Connecting...';
    renderTabStrip();
  }

  if (security) {
    security.textContent = '🔄 Resolving host...';
    security.className = 'browser-security-indicator';
  }

  if (typeof AudioManager !== 'undefined') AudioManager.playClick();

  setTimeout(() => {
    if (tab) {
      _applyPageToContent(url || tab.url);
    }
  }, 650);
}

function openNetworkDiagnostics(host) {
  if (!isInternetConnected()) {
    showToast('🔍 Windows Network Diagnostics: Your Wi-Fi network adapter is turned off or disconnected. Please reconnect to Wi-Fi to restore internet access (ERR_INTERNET_DISCONNECTED).', 'warning');
    if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
    return;
  }
  showToast(`🔍 Windows Network Diagnostics: Internet connection is active, but "${host}" cannot be found on the DNS server (DNS_PROBE_FINISHED_NXDOMAIN).`, 'warning');
  if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
}

function renderLegitSite(url) {
  const host = extractHostFromUrl(url).toLowerCase();
  if (host.includes('bpi.com.ph')) {
    return `
      <div class="legitsite">
        <div class="legitsite-header" style="background:#8a0011;color:white;">
          <div style="font-size:20px;font-weight:800;">🏦 BPI Online (Official)</div>
          <div style="font-size:12px;opacity:0.9;">bpi.com.ph • Official Portal</div>
        </div>
        <div class="legitsite-body">
          <div class="legitsite-advisory-banner">
            <div class="legitsite-advisory-title">🛡️ OFFICIAL BPI SECURITY ADVISORY</div>
            <p style="margin:6px 0 0 0;font-size:13.5px;line-height:1.5;">
              BPI will <strong>NEVER</strong> send emails, SMS, or messages with links asking you to log in, verify your account, or provide your password or One-Time PIN (OTP). The official BPI portal is strictly <strong>bpi.com.ph</strong>.
            </p>
          </div>
          <h2 style="font-size:22px;color:#1e293b;margin-bottom:12px;">Welcome to Bank of the Philippine Islands</h2>
          <p style="color:#475569;line-height:1.6;font-size:14px;">This is the legitimate, authentic Bank of the Philippine Islands online banking portal. Notice the secure padlock icon (🔒) and the official domain name in the address bar.</p>
          <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
            <h4 style="margin:0 0 8px 0;color:#0f172a;">How to Spot Fake BPI Websites:</h4>
            <ul style="margin:0;padding-left:20px;color:#475569;font-size:13.5px;line-height:1.6;">
              <li>Look for typos in the domain like <code>bpi-online-security.com</code> or <code>bpi-verify.com</code>.</li>
              <li>Official BPI domain will always end in <strong>.bpi.com.ph</strong>.</li>
              <li>Fake sites create false urgency claiming your account will be locked in 30 minutes.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
  if (host.includes('paypal.com')) {
    return `
      <div class="legitsite">
        <div class="legitsite-header" style="background:#003087;color:white;">
          <div style="font-size:20px;font-weight:800;">🅿️ PayPal (Official)</div>
          <div style="font-size:12px;opacity:0.9;">paypal.com • Official Site</div>
        </div>
        <div class="legitsite-body">
          <div class="legitsite-advisory-banner">
            <div class="legitsite-advisory-title">🛡️ OFFICIAL PAYPAL SECURITY NOTICE</div>
            <p style="margin:6px 0 0 0;font-size:13.5px;line-height:1.5;">
              Always verify you are on <strong>https://www.paypal.com</strong>. Legitimate PayPal communications will always address you by your real full name, never "Dear Customer" or "Dear User".
            </p>
          </div>
          <h2 style="font-size:22px;color:#1e293b;margin-bottom:12px;">PayPal Security &amp; Safety Center</h2>
          <p style="color:#475569;line-height:1.6;font-size:14px;">You have reached the authentic PayPal website. Protection against phishing and identity theft starts with verifying the domain name.</p>
        </div>
      </div>
    `;
  }
  if (host.includes('gcash.com')) {
    return `
      <div class="legitsite">
        <div class="legitsite-header" style="background:#005cfc;color:white;">
          <div style="font-size:20px;font-weight:800;">📱 GCash (Official)</div>
          <div style="font-size:12px;opacity:0.9;">gcash.com • Official Site</div>
        </div>
        <div class="legitsite-body">
          <div class="legitsite-advisory-banner">
            <div class="legitsite-advisory-title">🛡️ GCASH TRUST &amp; SECURITY REMINDER</div>
            <p style="margin:6px 0 0 0;font-size:13.5px;line-height:1.5;">
              <strong>NEVER share your MPIN or OTP.</strong> GCash will never send SMS or emails with links asking for your 4-digit MPIN or One-Time PIN.
            </p>
          </div>
          <h2 style="font-size:22px;color:#1e293b;margin-bottom:12px;">GCash Security Center</h2>
          <p style="color:#475569;line-height:1.6;font-size:14px;">Authentic GCash services are accessed through the official mobile app and <strong>gcash.com</strong>.</p>
        </div>
      </div>
    `;
  }
  return renderGenericSite(url);
}

function _applyPageToContent(url) {
  const content = document.getElementById('browser-content');
  const security = document.getElementById('browser-security');
  const tab = getActiveTab();
  if (!content) return;

  function setTabMeta(title, icon, secText, secClass) {
    if (tab) { tab.title = title; tab.icon = icon; }
    if (security) { security.textContent = secText; security.className = 'browser-security-indicator' + (secClass ? ' ' + secClass : ''); }
    renderTabStrip();
  }

  // 0. OFFLINE CHECK: If Wi-Fi is turned off or disconnected
  if (!isInternetConnected()) {
    setTabMeta('No internet', '🦖', '⚠️ Disconnected', 'not-secure');
    content.innerHTML = renderChromeOfflineError(url);
    return;
  }

  const isGoogleHome = url === 'https://www.google.com' || url === '';
  const isGoogleSearch = /^https:\/\/www\.google\.com\/search\?q=/i.test(url);

  // 1. Google Homepage
  if (isGoogleHome) {
    setTabMeta('Google', '🌐', '🔒 Secure', 'secure');
    content.innerHTML = BROWSER_HOME_HTML;
    return;
  }

  // 2. Real Phishing Website Examples (Directly displayed from email links or URLs)
  const phishSite = getPhishingSiteForUrl(url);
  if (phishSite) {
    setTabMeta(phishSite.title, phishSite.icon, '⚠️ Not Secure', 'not-secure');
    content.innerHTML = phishSite.html;
    return;
  }

  // 3. Google Search Results
  if (isGoogleSearch) {
    const q = decodeURIComponent(url.split('q=')[1] || '');
    setTabMeta(`${q} — Google Search`, '🔍', '🔒 Secure', 'secure');
    content.innerHTML = renderGoogleResults(q);
    return;
  }

  // 4. Legitimate Bank & Service Portals
  if (/bpi\.com\.ph|paypal\.com|gcash\.com/i.test(url)) {
    const legitTitle = /bpi/i.test(url) ? 'BPI Online — Bank of the Philippine Islands' : (/paypal/i.test(url) ? 'PayPal — Official Security Center' : 'GCash — Official Site');
    const legitIcon = /bpi/i.test(url) ? '🏦' : (/paypal/i.test(url) ? '🅿️' : '📱');
    setTabMeta(legitTitle, legitIcon, '🔒 Secure', 'secure');
    content.innerHTML = renderLegitSite(url);
    return;
  }

  // 5. Official Threat Intel & Cybersecurity Guides
  if (/malware|trojan|ransomware|threat-intel/i.test(url)) {
    setTabMeta('Malware Intel & Defense | CISA', '🦠', '🔒 Secure', 'secure');
    content.innerHTML = renderMalwareIntelSite();
    return;
  }

  if (/cisa\.gov/i.test(url)) {
    setTabMeta('CISA — Cyber Defense Agency', '🛡️', '🔒 Secure', 'secure');
    content.innerHTML = renderCisaHomeSite();
    return;
  }

  if (/consumer\.ftc\.gov|how-recognize-phishing/i.test(url)) {
    setTabMeta('How to Recognize Phishing | FTC', '🎣', '🔒 Secure', 'secure');
    content.innerHTML = renderPhishingGuideSite();
    return;
  }

  if (/wikipedia\.org/i.test(url)) {
    setTabMeta('Wikipedia, the free encyclopedia', '📖', '🔒 Secure', 'secure');
    content.innerHTML = renderGenericSite(url);
    return;
  }

  // 6. IMPROPER / NON-EXISTENT DOMAIN: Chrome "This site can't be reached" (DNS_PROBE_FINISHED_NXDOMAIN)
  const displayHost = extractHostFromUrl(url);
  setTabMeta(displayHost, '📄', '⚠️ Not Secure', 'not-secure');
  content.innerHTML = renderChromeDnsError(url);
}

function openBrowserDefault() {
  openApp('browser');
  focusWindow('browser');
  if (!browserTabs || browserTabs.length === 0) {
    initBrowserTabs();
  }
}

function handlePhishingSubmit(domain, brand) {
  showToast(`🚨 PHISHING DETECTED! You just submitted credentials to "${domain}" — a fake ${brand} portal. Your credentials would now be stolen. Always verify the domain in the address bar!`, 'warning');
  if (typeof AudioManager !== 'undefined') AudioManager.playWrong();

  // Flash the security indicator red
  const security = document.getElementById('browser-security');
  if (security) {
    security.textContent = '🚨 PHISHING DETECTED';
    security.style.color = '#f28b82';
    security.style.fontWeight = '900';
    setTimeout(() => {
      security.textContent = '⚠️ Not Secure';
      security.style.color = '';
      security.style.fontWeight = '';
    }, 4000);
  }
}

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

function submitBrowserUrl() {
  const input = document.getElementById('browser-url-input');
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

function updateBrowserNavBtns() {
  const backBtn = document.getElementById('browser-back');
  const fwdBtn = document.getElementById('browser-forward');
  const tab = getActiveTab();
  if (tab) {
    if (backBtn) backBtn.disabled = (tab.histIdx <= 0);
    if (fwdBtn) fwdBtn.disabled = (tab.histIdx >= tab.history.length - 1);
  } else {
    if (backBtn) backBtn.disabled = true;
    if (fwdBtn) fwdBtn.disabled = true;
  }
}

function navigateBrowser(url) {
  const tab = getActiveTab();
  if (!tab) {
    createNewBrowserTab(url);
    return;
  }
  renderPageIntoTab(tab, url);
}

// Compatibility alias — renderBrowserPage now delegates to tab system
function renderBrowserPage(url) {
  navigateBrowser(url);
}

function browserBack() {
  const tab = getActiveTab();
  if (!tab || tab.histIdx <= 0) return;
  tab.histIdx--;
  const url = tab.history[tab.histIdx];
  tab.url = url;
  browserHistory = tab.history;
  browserCurrentIdx = tab.histIdx;
  const urlInput = document.getElementById('browser-url-input');
  if (urlInput) urlInput.value = url === 'https://www.google.com' ? '' : url;
  updateBrowserNavBtns();
  _applyPageToContent(url);
}

function browserForward() {
  const tab = getActiveTab();
  if (!tab || tab.histIdx >= tab.history.length - 1) return;
  tab.histIdx++;
  const url = tab.history[tab.histIdx];
  tab.url = url;
  browserHistory = tab.history;
  browserCurrentIdx = tab.histIdx;
  const urlInput = document.getElementById('browser-url-input');
  if (urlInput) urlInput.value = url === 'https://www.google.com' ? '' : url;
  updateBrowserNavBtns();
  _applyPageToContent(url);
}

function browserRefresh() {
  const tab = getActiveTab();
  if (tab) triggerChromeReload(tab.url);
}

function browserGoHome() {
  const tab = getActiveTab();
  if (tab) {
    renderPageIntoTab(tab, 'https://www.google.com');
  } else {
    initBrowserTabs();
  }
  const urlInput = document.getElementById('browser-url-input');
  if (urlInput) urlInput.value = '';
}


// ── AUTHENTIC MALWARE THREAT INTELLIGENCE WEBSITE ──
function renderMalwareIntelSite() {
  return `
    <div class="malwaresite">
      <div class="intel-banner">
        <div class="intel-banner-left">
          <span class="intel-banner-shield">🛡️</span>
          <div>
            <div class="intel-banner-title">CYBERSECURITY &amp; INFRASTRUCTURE SECURITY AGENCY</div>
            <div class="intel-banner-sub">NATIONAL THREAT ASSESSMENT DIVISION • OFFICIAL BULLETIN</div>
          </div>
        </div>
        <div class="intel-banner-badge">THREAT ADVISORY: ACTIVE MALWARE CAMPAIGNS</div>
      </div>

      <div class="intel-content">
        <div class="intel-breadcrumbs">
          <a href="#" onclick="browserGoHome()">Home</a> › 
          <a href="#" onclick="browserGo('https://www.cisa.gov')">CISA</a> › 
          <span>Malware Threat Intel &amp; Defense</span>
        </div>

        <h1 class="intel-h1">Malware Defense &amp; Threat Intelligence Guide</h1>
        <div class="intel-meta-bar">
          <span>📅 Updated: September 2026</span>
          <span>🏷️ Category: Threat Intelligence</span>
          <span>⏱️ 5 min read</span>
          <span class="verified-tag">✔ Verified Cyber Intelligence</span>
        </div>

        <div class="intel-alert-box">
          <strong>⚠️ Critical Threat Notice:</strong> Over 70% of organizational and student workstation breaches originate from deceptive file downloads and malicious email attachments. Attackers use social engineering to convince users to execute trojan droppers.
        </div>

        <div class="intel-section">
          <h2>1. What is Malware?</h2>
          <p>
            <strong>Malware</strong> (short for <em>malicious software</em>) is an overarching term for code or programs intentionally crafted to damage, disrupt, steal, or gain unauthorized access to computer systems, data, and networks.
          </p>
          <p>
            Unlike legitimate software, malware executes unauthorized tasks without the user's informed consent. Modern cyber threats frequently combine social engineering with multi-stage payloads.
          </p>
        </div>

        <div class="intel-section">
          <h2>2. Major Classifications of Malware</h2>
          <div class="intel-cards-grid">
            <div class="intel-threat-card card-trojan">
              <div class="threat-card-header">
                <span class="threat-card-name">🦠 Trojan Horse</span>
                <span class="threat-card-tag">High Danger</span>
              </div>
              <p class="threat-card-desc">
                Disguised as beneficial, free, or legitimate software (converters, games, PDF viewers). Once executed by the victim, it silently deploys backdoors, disables security software, or downloads secondary malware droppers.
              </p>
              <div class="threat-card-case">
                <strong>Field Case (Chapter 3):</strong> Nishren downloaded a "free project tool" online. Moments later, his machine slowed down as the trojan installed unauthorized remote access tools.
              </div>
            </div>

            <div class="intel-threat-card card-ransom">
              <div class="threat-card-header">
                <span class="threat-card-name">🔒 Ransomware</span>
                <span class="threat-card-tag" style="background:#fee2e2;color:#b91c1c">Critical Danger</span>
              </div>
              <p class="threat-card-desc">
                Infiltrates the operating system and encrypts user documents, spreadsheets, and databases using strong military-grade cryptography (.locked, .crypted). Attackers demand cryptocurrency payments for the decryption key.
              </p>
              <div class="threat-card-case">
                <strong>Field Case (Chapter 5):</strong> Jonald opened an infected invoice file, triggering instant file encryption across his school workstation.
              </div>
            </div>

            <div class="intel-threat-card card-spyware">
              <div class="threat-card-header">
                <span class="threat-card-name">🕵️ Spyware &amp; Keyloggers</span>
                <span class="threat-card-tag" style="background:#ede9fe;color:#6d28d9">Stealth Threat</span>
              </div>
              <p class="threat-card-desc">
                Operates invisibly in background memory, logging every keystroke, capturing browser cookies, stealing passwords, and streaming screen captures to adversary command-and-control servers.
              </p>
              <div class="threat-card-case">
                <strong>Threat Vector:</strong> Often bundled inside cracked pirated utilities and unauthorized browser extensions.
              </div>
            </div>

            <div class="intel-threat-card card-worm">
              <div class="threat-card-header">
                <span class="threat-card-name">🪱 Worms &amp; Botnets</span>
                <span class="threat-card-tag" style="background:#e0f2fe;color:#0369a1">Network Threat</span>
              </div>
              <p class="threat-card-desc">
                Self-replicating malicious programs that automatically propagate across network shares, open ports, and USB storage without requiring human interaction, enlisting computers into distributed botnets.
              </p>
              <div class="threat-card-case">
                <strong>Threat Vector:</strong> Exploits unpatched system vulnerabilities and weak default administrative credentials.
              </div>
            </div>
          </div>
        </div>

        <div class="intel-section">
          <h2>3. Common Infection Vectors &amp; Deceptive Disguises</h2>
          <ul class="intel-list">
            <li>
              <strong>Double File Extensions:</strong> Files named <code>project_document.pdf.exe</code> or <code>receipt.docx.scr</code>. Operating systems hide known extensions by default, tricking users into double-clicking executables.
            </li>
            <li>
              <strong>Compressed Archive Droppers (.zip, .iso, .vhd):</strong> Attackers place malicious scripts (<code>.vbs</code>, <code>.bat</code>, <code>.ps1</code>) inside archives to evade automatic web and email gateway scanners.
            </li>
            <li>
              <strong>Unverified "Free" Download Mirrors:</strong> Downloading tools, games, or patches from third-party forums or suspicious file-hosters rather than official vendor repositories.
            </li>
            <li>
              <strong>Macro-Enabled Documents:</strong> Microsoft Office files prompting users to "Enable Editing" or "Enable Macros" to execute embedded VBA downloader scripts.
            </li>
          </ul>
        </div>

        <div class="intel-section">
          <h2>4. Practical Malware Defense Checklist</h2>
          <div class="defense-steps-box">
            <div class="defense-step">
              <span class="step-num">1</span>
              <div>
                <strong>Enable File Name Extensions:</strong> Always configure your file manager to display full file extensions so disguised executables (<code>.exe</code>, <code>.scr</code>) are immediately visible.
              </div>
            </div>
            <div class="defense-step">
              <span class="step-num">2</span>
              <div>
                <strong>Inspect Digital Signatures &amp; File Hashes:</strong> Legitimate software from reputable vendors carries valid digital certificates. Unsigned executables should never be run without verification.
              </div>
            </div>
            <div class="defense-step">
              <span class="step-num">3</span>
              <div>
                <strong>Employ Active Real-Time Heuristic Protection:</strong> Keep your anti-virus software (such as ShieldAV) active with real-time heuristic monitoring and updated threat signature databases.
              </div>
            </div>
            <div class="defense-step">
              <span class="step-num">4</span>
              <div>
                <strong>Maintain Offline / Cold Backups:</strong> Keep regular backups on disconnected external storage to guarantee recovery in the event of a ransomware attack.
              </div>
            </div>
          </div>
        </div>

        <div class="intel-footer-nav">
          <button class="google-btn" onclick="browserGo('https://www.google.com/search?q=phishing+defense+guide')">🔍 Search Phishing Intelligence</button>
          <button class="google-btn" onclick="browserGo('https://www.cisa.gov')">🛡️ CISA Cyber Defense Home</button>
          <button class="google-btn" onclick="browserGoHome()">🏠 Return to Google</button>
        </div>
      </div>
    </div>`;
}

// ── CISA HOMEPAGE ──
function renderCisaHomeSite() {
  return `
    <div class="cisasite">
      <div class="intel-banner">
        <div class="intel-banner-left">
          <span class="intel-banner-shield">🛡️</span>
          <div>
            <div class="intel-banner-title">CYBERSECURITY &amp; INFRASTRUCTURE SECURITY AGENCY</div>
            <div class="intel-banner-sub">AMERICA'S CYBER DEFENSE AGENCY • DEFEND TODAY, SECURE TOMORROW</div>
          </div>
        </div>
        <div class="intel-banner-badge" style="background:#16a34a;color:#fff;border-color:#16a34a">SHIELDS UP: OPERATIONAL</div>
      </div>

      <div class="intel-content">
        <div class="intel-breadcrumbs">
          <a href="#" onclick="browserGoHome()">Home</a> › 
          <span>Official Cybersecurity Portal</span>
        </div>

        <h1 class="intel-h1">National Cyber Defense &amp; Digital Safety Resource Center</h1>
        <div class="intel-meta-bar">
          <span>Official Government Source (cisa.gov)</span>
          <span>🛡️ Cybersecurity Advisories</span>
          <span class="verified-tag">✔ Authenticated Domain</span>
        </div>

        <div class="intel-section">
          <h2>Shields Up: 4 Essential Steps for Every Digital Citizen</h2>
          <p>Cybersecurity is not just for technical experts. Following these four foundational habits prevents over 90% of opportunistic cyber attacks:</p>
          <div class="defense-steps-box">
            <div class="defense-step">
              <span class="step-num">1</span>
              <div><strong>Enable Multi-Factor Authentication (MFA):</strong> MFA makes it 99% harder for adversaries to compromise your accounts even if your password is stolen.</div>
            </div>
            <div class="defense-step">
              <span class="step-num">2</span>
              <div><strong>Recognize and Report Phishing:</strong> Think before you click. Be suspicious of unsolicited requests for personal info, urgency, and strange sender emails.</div>
            </div>
            <div class="defense-step">
              <span class="step-num">3</span>
              <div><strong>Update Your Software:</strong> Enable automatic operating system and browser updates to patch known vulnerabilities before attackers exploit them.</div>
            </div>
            <div class="defense-step">
              <span class="step-num">4</span>
              <div><strong>Use Strong, Unique Passwords:</strong> Never reuse passwords across email, banking, and school portals. Use passphrases or a password manager.</div>
            </div>
          </div>
        </div>

        <div class="intel-section">
          <h2>Featured Security Bulletins</h2>
          <ul class="intel-list">
            <li><strong>Malware &amp; Software Dropper Advisory:</strong> <a href="#" onclick="browserGo('https://www.cisa.gov/topics/malware'); return false;" style="color:#0284c7;font-weight:700;">Read the complete Malware Intel &amp; Classification Guide ➔</a></li>
            <li><strong>Phishing &amp; Social Engineering Trends:</strong> <a href="#" onclick="browserGo('https://www.consumer.ftc.gov/articles/how-recognize-phishing'); return false;" style="color:#0284c7;font-weight:700;">How to identify deceptive phishing domains and fake sender headers ➔</a></li>
          </ul>
        </div>
      </div>
    </div>`;
}

// ── FTC PHISHING RECOGNITION GUIDE ──
function renderPhishingGuideSite() {
  return `
    <div class="cisasite">
      <div class="intel-banner" style="background:#1e3a8a;border-bottom-color:#60a5fa">
        <div class="intel-banner-left">
          <span class="intel-banner-shield">🎣</span>
          <div>
            <div class="intel-banner-title">FEDERAL TRADE COMMISSION • CONSUMER ADVICE</div>
            <div class="intel-banner-sub">OFFICIAL FRAUD &amp; PHISHING PREVENTION DIVISION</div>
          </div>
        </div>
        <div class="intel-banner-badge" style="background:#2563eb;color:#fff;border-color:#60a5fa">CONSUMER SECURITY GUIDE</div>
      </div>

      <div class="intel-content">
        <div class="intel-breadcrumbs">
          <a href="#" onclick="browserGoHome()">Home</a> › 
          <span>How to Recognize and Avoid Phishing Scams</span>
        </div>

        <h1 class="intel-h1">How to Spot Phishing Emails &amp; Deceptive Links</h1>
        <div class="intel-meta-bar">
          <span>Federal Trade Commission (consumer.ftc.gov)</span>
          <span class="verified-tag">✔ Official Advisory</span>
        </div>

        <div class="intel-section">
          <h2>The 4 Red Flags of Phishing Emails</h2>
          <ul class="intel-list">
            <li><strong>1. Deceptive Sender Addresses:</strong> The sender name might say "IT Support" or "Bank Security", but the actual email address is <code>support@accounts-verification-service.com</code> instead of the legitimate organization domain.</li>
            <li><strong>2. Artificial &amp; High Urgency:</strong> Demands immediate action: "Your account will be suspended within 1 hour!" Designed to induce panic so the victim clicks before thinking.</li>
            <li><strong>3. Hidden Link Mismatches:</strong> The visible text says <code>https://www.paypal.com</code>, but hovering over the link reveals the actual destination leads to an untrusted external server.</li>
            <li><strong>4. Unexpected Attachments:</strong> Invoices or order confirmations with file names ending in <code>.zip</code>, <code>.exe</code>, or <code>.pdf.exe</code> containing malware droppers.</li>
          </ul>
        </div>

        <div class="intel-footer-nav">
          <button class="google-btn" onclick="browserGo('https://www.cisa.gov/topics/malware')">🦠 Learn About Malware Threats</button>
          <button class="google-btn" onclick="browserGoHome()">🏠 Return to Google Home</button>
        </div>
      </div>
    </div>`;
}

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
          <p><strong>${escapeHtml(title)}</strong> is a prominent subject in cybersecurity and digital forensics. Understanding the anatomy of modern threats allows students and detectives to detect and mitigate unauthorized system intrusions.</p>
          <p>Key defensive practices include inspecting domain names, verifying SSL certificate validity, and quarantining suspicious attachments in isolated sandboxes.</p>
          <div style="margin-top:20px;padding:12px;background:#f0f9ff;border-radius:6px;border:1px solid #bae6fd;">
            <strong>Related Intelligence:</strong> <a href="#" onclick="browserGo('https://www.cisa.gov/topics/malware'); return false;" style="color:#0284c7;font-weight:700;">Explore CISA Malware &amp; Threat Intelligence ➔</a>
          </div>
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
        <nav class="genericsite-nav"><a href="#" onclick="browserGoHome()">Search</a><a href="#" onclick="browserGo('https://www.cisa.gov/topics/malware')">Threat Intel</a></nav>
      </div>
      <div class="genericsite-body">
        <h2>${escapeHtml(capitalized)} Secure Portal</h2>
        <p>You have navigated to <strong>${escapeHtml(displayHost)}</strong>. This authenticated website is functioning normally.</p>
        <div style="margin-top:20px;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
          <h4>Cyber Threat Research Links:</h4>
          <p style="margin:8px 0;"><a href="#" onclick="browserGo('https://www.cisa.gov/topics/malware'); return false;" style="color:#0284c7;">🦠 View Official Malware Encyclopedia &amp; Trojan Analysis</a></p>
          <p style="margin:8px 0;"><a href="#" onclick="browserGo('https://www.consumer.ftc.gov/articles/how-recognize-phishing'); return false;" style="color:#0284c7;">🎣 View FTC Phishing Recognition Guidelines</a></p>
        </div>
      </div>
    </div>`;
}

function renderGoogleResults(query) {
  const q = escapeHtml(query);
  const qLower = query.toLowerCase();

  let mockResults = [];

  if (/malware|trojan|virus|spyware|worm|download/i.test(qLower)) {
    mockResults = [
      {
        url: 'www.cisa.gov › topics › malware-and-ransomware',
        link: 'https://www.cisa.gov/topics/malware',
        title: 'Malware Threat Intelligence & Defense Guide | CISA',
        desc: `Comprehensive official threat advisory on Trojans, Ransomware, Spyware, Worms, and how adversaries disguise executables (.exe, .scr) as harmless documents.`
      },
      {
        url: 'www.cisa.gov › news-events › news › safe-software-downloads',
        link: 'https://www.cisa.gov/topics/malware#trojans',
        title: 'Trojan Horses: The Danger of "Free Software" Downloads | Cyber Academy',
        desc: `Learn why downloading free utilities and game tools from online forums leads to Trojan dropper infections and system compromise.`
      },
      {
        url: 'www.consumer.ftc.gov › articles › ransomware-protection',
        link: 'https://www.cisa.gov/topics/malware#ransomware',
        title: 'Ransomware Prevention & Recovery Best Practices | CISA & FTC',
        desc: `Protecting personal and organizational files from cryptographic ransomware lockouts. Real-world mitigation and cold backup advice.`
      },
      {
        url: 'www.sans.org › resources › glossary › malware',
        link: 'https://www.cisa.gov/topics/malware',
        title: 'Malware Classifications & Threat Categories | SANS Institute',
        desc: `Authoritative cybersecurity glossary covering all major malware families, attack vectors, and prevention frameworks.`
      }
    ];
  } else if (/phishing|email|scam|spoof/i.test(qLower)) {
    mockResults = [
      {
        url: 'www.consumer.ftc.gov › articles › how-recognize-phishing',
        link: 'https://www.consumer.ftc.gov/articles/how-recognize-phishing',
        title: 'How to Recognize and Avoid Phishing Scams | Federal Trade Commission',
        desc: `Learn the 4 tell-tale signs of a phishing email: mismatched sender addresses, artificial urgency, deceptive hyperlinks, and generic greetings.`
      },
      {
        url: 'www.cisa.gov › news-events › news › avoiding-social-engineering',
        link: 'https://www.cisa.gov',
        title: 'Avoiding Social Engineering and Phishing Attacks | CISA',
        desc: `Attackers use email or malicious websites to solicit personal information by posing as a trustworthy organization.`
      },
      {
        url: 'www.ic3.gov › resources › phishing-prevention',
        link: 'https://www.consumer.ftc.gov/articles/how-recognize-phishing',
        title: 'Phishing & Email Spoofing | FBI Internet Crime Complaint Center',
        desc: `Report phishing and email spoofing attacks. FBI guidance on identifying lookalike sender addresses and fake login pages.`
      }
    ];
  } else if (/ransomware|encrypt|decrypt|ransom/i.test(qLower)) {
    mockResults = [
      {
        url: 'www.cisa.gov › stopransomware',
        link: 'https://www.cisa.gov/topics/malware#ransomware',
        title: 'Stop Ransomware | CISA',
        desc: `Official joint advisory on ransomware prevention, detection, and recovery. Includes offline backup strategies and incident response playbooks.`
      },
      {
        url: 'www.consumer.ftc.gov › topics › ransomware-protection',
        link: 'https://www.cisa.gov/topics/malware',
        title: 'Ransomware Protection & Recovery Guide | FTC Consumer Advice',
        desc: `Step-by-step guidance on protecting files from ransomware encryption and recovering after an attack without paying a ransom.`
      }
    ];
  } else if (/cybersecurity|cyber security|cyber defense|infosec/i.test(qLower)) {
    mockResults = [
      {
        url: 'www.cisa.gov',
        link: 'https://www.cisa.gov',
        title: 'Cybersecurity & Infrastructure Security Agency (CISA)',
        desc: `America's Cyber Defense Agency — providing resources, advisories, and guidelines to defend national and personal digital infrastructure.`
      },
      {
        url: 'www.consumer.ftc.gov › privacy-identity-online-security',
        link: 'https://www.consumer.ftc.gov/articles/how-recognize-phishing',
        title: 'Online Security & Identity Protection Tips | FTC',
        desc: `Expert advice on cybersecurity hygiene, password safety, phishing awareness, and protecting your digital identity online.`
      }
    ];
  } else {
    // Unknown query — show Google no-results page
    return `
      <div class="gresults">
        <div class="gresults-header">
          <div class="gresults-logo" onclick="browserGoHome()"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></div>
          <div class="gresults-search-form">
            <input type="text" class="gresults-search-input" id="gresults-search-input" value="${q}" placeholder="Search Google..." onkeydown="if(event.key==='Enter'){browserGo(this.value);}" />
            <button class="gresults-search-btn" onclick="browserGo(document.getElementById('gresults-search-input').value)">Search</button>
          </div>
        </div>
        <div class="google-noresult-container">
          <div class="google-noresult-icon">🔍</div>
          <div class="google-noresult-heading">Your search — <em>${q}</em> — did not match any documents.</div>
          <div class="google-noresult-suggestions">
            <p>Suggestions:</p>
            <ul>
              <li>Make sure that all words are spelled correctly.</li>
              <li>Try different keywords.</li>
              <li>Try more general keywords.</li>
              <li>Try fewer keywords.</li>
            </ul>
          </div>
          <div class="google-noresult-tips">
            💡 <strong>Detective Tip:</strong> This browser is optimized for cybersecurity topics. Try searching for
            <a href="#" onclick="browserGo('https://www.google.com/search?q=malware'); return false;" style="color:#1a73e8;">malware</a>,
            <a href="#" onclick="browserGo('https://www.google.com/search?q=phishing'); return false;" style="color:#1a73e8;">phishing</a>, or
            <a href="#" onclick="browserGo('https://www.google.com/search?q=ransomware'); return false;" style="color:#1a73e8;">ransomware</a>.
          </div>
        </div>
      </div>`;
  }

  const items = mockResults.map(r => `
    <div class="gresult-item">
      <div class="gresult-url">${r.url}</div>
      <div class="gresult-title" onclick="navigateBrowser('${r.link}')">${r.title}</div>
      <div class="gresult-desc">${r.desc}</div>
    </div>`).join('');

  return `
    <div class="gresults">
      <div class="gresults-header">
        <div class="gresults-logo" onclick="browserGoHome()"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></div>
        <div class="gresults-search-form">
          <input type="text" class="gresults-search-input" id="gresults-search-input" value="${q}" placeholder="Search Google or enter query..." onkeydown="if(event.key==='Enter'){browserGo(this.value);}" />
          <button class="gresults-search-btn" onclick="browserGo(document.getElementById('gresults-search-input').value)">Search</button>
        </div>
      </div>
      <div class="gresults-stats">About ${(Math.floor(Math.random()*9)+1)},${Math.floor(Math.random()*900+100)},000 results (0.${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)} seconds)</div>
      ${items}
    </div>`;
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
  if (typeof AudioManager !== 'undefined') AudioManager.playNotification();
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

const FOLDER_FILES = [];

// ═══════════════════════════════════════════════════════════
// CHAPTER 2: MALWARE GUIDED DEMO — Interactive Walkthrough
// ═══════════════════════════════════════════════════════════

const MALWARE_DEMO_SCRIPT = [
  {
    step: 0,
    label: 'Welcome',
    objective: 'Meet your Chapter 2 malware hunting toolkit',
    speech: `<strong>Welcome to Chapter 2, Investigator! 🛡️</strong><br><br>Attackers don't just rely on fake emails — they disguise <strong>dangerous malware payloads</strong> inside ordinary-looking downloads.<br><br>In this guided demo, you will learn how to inspect files in the <strong>Folder (Downloads)</strong> and neutralize threats using <strong>ShieldAV Anti-Virus</strong>!`,
    btn: "Let's Begin →",
    action: null
  },
  {
    step: 1,
    label: 'Inspect Folder',
    objective: 'Select a suspicious file in Downloads',
    speech: `📁 <strong>STEP 1: INSPECT YOUR DOWNLOADS</strong><br><br>Attackers disguise files with convincing business names like payroll, invoices, or bonuses.<br><br>Let's select <em style="color:#ffab40;font-weight:700">bonus_payroll_sept.pdf.exe</em> from the file list on the right →`,
    btn: 'Select File →',
    action: 'select-file-1'
  },
  {
    step: 2,
    label: 'Double Extension',
    objective: 'Spot the fake extension trick',
    speech: `🔍 <strong>CATCH THE DOUBLE EXTENSION TRICK</strong><br><br>Look closely at the actual extension in the inspection panel: <span class="capy-code">.exe</span>!<br><br>Attackers append <em>.pdf</em> into the filename hoping you only notice the document name. But Windows executes the final extension: <strong>.exe</strong>. Opening this runs dangerous binary code!`,
    btn: 'Check Extension →',
    action: 'highlight-ext'
  },
  {
    step: 3,
    label: 'Send to AV',
    objective: 'Forward suspicious file to Anti-Virus',
    speech: `⚡ <strong>STEP 2: SCAN BEFORE YOU OPEN</strong><br><br>Never open an unknown or unexpected executable. Instead, click <strong>⚡ Scan with Anti-Virus</strong> to load the file into the ShieldAV security engine →`,
    btn: 'Send to Anti-Virus →',
    action: 'send-to-av'
  },
  {
    step: 4,
    label: 'Enable Defense',
    objective: 'Turn ON Anti-Virus Protection',
    speech: `🛡️ <strong>STEP 3: ACTIVATE REAL-TIME PROTECTION</strong><br><br>Notice the security status banner: <span style="color:#ff5252;font-weight:800">⚠️ DEFENSE ENGINE DISABLED</span>!<br><br>Your Anti-Virus cannot scan or block threats while protection is turned off.<br><br>Click the <strong>PROTECTION [OFF]</strong> switch to turn it <strong>ON</strong> →`,
    btn: 'Turn ON Anti-Virus →',
    action: 'turn-on-av'
  },
  {
    step: 5,
    label: 'Deep Scan',
    objective: 'Run heuristic & signature scan',
    speech: `⚡ <strong>STEP 4: EXECUTE SIGNATURE SCAN</strong><br><br>Now that the engine is active, ShieldAV cross-references known malware hashes and heuristic threat signatures.<br><br>Click <strong>⚡ Scan File</strong> to initiate the scan →`,
    btn: 'Run Deep Scan →',
    action: 'run-av-scan'
  },
  {
    step: 6,
    label: 'Quarantine Threat',
    objective: 'Lock malware into the encrypted vault',
    speech: `🚨 <strong>CONFIRMED THREAT — QUARANTINE!</strong><br><br>ShieldAV detected a Trojan dropper payload. Click <strong>🚩 QUARANTINE THREAT</strong> to isolate the file into the secure vault and earn <strong>+100 points</strong>!`,
    btn: 'Quarantine Malware →',
    action: 'quarantine-threat'
  },
  {
    step: 7,
    label: 'Clean Files',
    objective: 'Identify safe legitimate files',
    speech: `⚠️ <strong>BEWARE FALSE POSITIVES</strong><br><br>Do NOT quarantine every file you find! Quarantining a clean legitimate file incurs a <strong>−25 point penalty</strong>.<br><br>Let's inspect a safe business document: <em style="color:#00e5ff;font-weight:700">project_roadmap_2026.docx</em> →`,
    btn: 'Inspect Clean File →',
    action: 'select-clean-file'
  },
  {
    step: 8,
    label: 'Verify Safe',
    objective: 'Confirm clean scan verdict',
    speech: `✅ <strong>CLEAN SCAN VERDICT</strong><br><br>ShieldAV scanned the document and verified clean headers with zero malicious macro payloads.<br><br>Verdict: <strong>✓ NO ACTION NEEDED</strong>. Leave verified clean files alone to protect your investigation score!`,
    btn: 'Verify Clean Scan →',
    action: 'scan-clean-file'
  },
  {
    step: 9,
    label: 'Briefing',
    objective: 'Start Chapter 2: Malware Hunter',
    speech: `🏆 <strong>READY TO HUNT, INVESTIGATOR!</strong><br><br>📁 <strong>Folder (Downloads):</strong> Inspect files and watch for double extensions (<em>.pdf.exe</em>), script droppers (<em>.vbs</em>), and suspicious screensavers (<em>.scr</em>).<br><br>🛡️ <strong>ShieldAV:</strong> Keep Real-Time Protection ON, scan suspicious files, and quarantine all confirmed threats.<br><br><strong>Your Mission:</strong> 4 disguised malware threats are hidden in Downloads. Neutralize them all!`,
    btn: 'START HUNTING MALWARE →',
    action: 'done'
  }
];

let gmalwareDemoStep = 0;

function startMalwareDemo() {
  gameState.phase = 'malware-demo';
  gmalwareDemoStep = 0;
  updateDesktopBackgroundForPhase('malware');

  // Reset all demo visuals
  resetMalwareDemoVisuals();
  updateStickyNoteForPhase('malware');
  showOverlay('overlay-malware-demo');
  renderMalwareDemoStep(0);
}

function skipMalwareDemo() {
  hideAllOverlays();
  startMalwareMission();
  showToast('⏭ Malware demo skipped — mission started!', 'warning');
}

function setMalwareDemoTab(tab) {
  const folderTab = document.getElementById('gdemo-mtab-folder');
  const avTab = document.getElementById('gdemo-mtab-av');
  const folderView = document.getElementById('gdemo-mview-folder');
  const avView = document.getElementById('gdemo-mview-av');

  if (tab === 'folder') {
    if (folderTab) folderTab.classList.add('active');
    if (avTab) avTab.classList.remove('active');
    if (folderView) folderView.classList.remove('hidden');
    if (avView) avView.classList.add('hidden');
  } else {
    if (avTab) avTab.classList.add('active');
    if (folderTab) folderTab.classList.remove('active');
    if (avView) avView.classList.remove('hidden');
    if (folderView) folderView.classList.add('hidden');
  }
}

let demoAvProtection = false;

function setMalwareDemoAvActive(isActive) {
  demoAvProtection = !!isActive;
  const toggleBtn = document.getElementById('gdemo-mav-toggle');
  const toggleText = document.getElementById('gdemo-mav-toggle-text');
  const banner = document.getElementById('gdemo-mav-banner');
  const icon = document.getElementById('gdemo-mav-shield-icon');
  const title = document.getElementById('gdemo-mav-status-title');
  const sub = document.getElementById('gdemo-mav-status-sub');

  if (demoAvProtection) {
    if (toggleBtn) toggleBtn.classList.add('active');
    if (toggleText) toggleText.textContent = 'ON';
    if (banner) banner.classList.remove('disabled');
    if (icon) icon.textContent = '🛡️';
    if (title) title.textContent = 'DEFENSE ENGINE ACTIVE';
    if (sub) sub.textContent = 'Definitions v2026.09 • Real-Time Protection Online';
  } else {
    if (toggleBtn) toggleBtn.classList.remove('active');
    if (toggleText) toggleText.textContent = 'OFF';
    if (banner) banner.classList.add('disabled');
    if (icon) icon.textContent = '⚠️';
    if (title) title.textContent = 'DEFENSE ENGINE DISABLED';
    if (sub) sub.textContent = '⚠️ Real-Time Protection is OFF • Turn ON to scan threats';
  }
}

function toggleMalwareDemoProtection() {
  setMalwareDemoAvActive(!demoAvProtection);
  if (demoAvProtection) {
    showToast('🛡️ Real-Time Protection activated in Demo!', 'success');
  } else {
    showToast('⚠️ Real-Time Protection turned OFF in Demo.', 'warning');
  }
}

function resetMalwareDemoVisuals() {
  hideMalwareCursor();
  setMalwareDemoTab('folder');
  setMalwareDemoAvActive(false);

  // Reset File 1 row
  const f1 = document.getElementById('gdemo-mfile-1');
  if (f1) {
    f1.className = 'folder-file-row selected';
    const st1 = document.getElementById('gdemo-mfile-1-status');
    if (st1) { st1.className = 'badge-file-status badge-unscanned'; st1.textContent = 'Unscanned'; }
  }

  // Reset File 2 row
  const f2 = document.getElementById('gdemo-mfile-2');
  if (f2) {
    f2.className = 'folder-file-row';
    const st2 = document.getElementById('gdemo-mfile-2-status');
    if (st2) { st2.className = 'badge-file-status badge-unscanned'; st2.textContent = 'Unscanned'; }
  }

  // Reset Inspection Pane to File 1
  setMalwareDemoInspection({
    icon: '📄',
    name: 'bonus_payroll_sept.pdf.exe',
    sub: 'Executable Binary • 2.4 MB',
    hash: 'a94f82c1b483e102…',
    ext: '<span style="color:var(--accent-red);font-weight:700">.exe <span class="gdemo-warning-pill">⚠️ HIDDEN EXECUTABLE</span></span>',
    status: 'Ready for Scan',
    analysis: '⚠️ <strong>Double Extension Alert</strong>: Filename mimics a PDF document, but the real file extension is <code>.exe</code>. Opening it executes binary code!',
    analysisClass: 'suspicious'
  });

  // Reset Anti-Virus
  const avTargetName = document.getElementById('gdemo-mav-tc-name');
  const avTargetDetail = document.getElementById('gdemo-mav-tc-detail');
  const avTargetIcon = document.getElementById('gdemo-mav-tc-icon');
  if (avTargetName) avTargetName.textContent = 'bonus_payroll_sept.pdf.exe';
  if (avTargetDetail) avTargetDetail.textContent = 'Executable Binary (.exe) • 2.4 MB • SHA-256: a94f82c1b4…';
  if (avTargetIcon) avTargetIcon.textContent = '📄';

  const avProgress = document.getElementById('gdemo-mav-progress-wrap');
  if (avProgress) avProgress.classList.add('hidden');
  const avProgressFill = document.getElementById('gdemo-mav-progress-fill');
  if (avProgressFill) avProgressFill.style.width = '0%';
  const avProgressPct = document.getElementById('gdemo-mav-progress-pct');
  if (avProgressPct) avProgressPct.textContent = '0%';

  const avResult = document.getElementById('gdemo-mav-result');
  if (avResult) avResult.classList.add('hidden');

  const qCount = document.getElementById('gdemo-mav-qcount');
  if (qCount) qCount.textContent = '0';
  const vaultCount = document.getElementById('gdemo-mav-vault-count');
  if (vaultCount) vaultCount.textContent = '0 Quarantined';
  const threatsList = document.getElementById('gdemo-mav-threats-list');
  if (threatsList) threatsList.innerHTML = '<div class="av-threats-empty" id="gdemo-mav-empty-log">No quarantined files yet. Scan and neutralize threats!</div>';

  const nextBtn = document.getElementById('btn-malware-demo-next');
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
  }
}

function setMalwareDemoInspection(data) {
  const icon = document.getElementById('gdemo-minsp-icon');
  const name = document.getElementById('gdemo-minsp-name');
  const sub = document.getElementById('gdemo-minsp-sub');
  const hash = document.getElementById('gdemo-minsp-hash');
  const ext = document.getElementById('gdemo-mext-val');
  const status = document.getElementById('gdemo-minsp-status');
  const analysis = document.getElementById('gdemo-minsp-analysis');

  if (icon) icon.textContent = data.icon;
  if (name) name.textContent = data.name;
  if (sub) sub.textContent = data.sub;
  if (hash) hash.textContent = data.hash;
  if (ext) ext.innerHTML = data.ext;
  if (status) status.textContent = data.status;
  if (analysis) {
    analysis.className = `fdp-analysis-box ${data.analysisClass || 'suspicious'}`;
    analysis.innerHTML = data.analysis;
  }
}

function renderMalwareDemoStep(stepIdx) {
  const script = MALWARE_DEMO_SCRIPT[stepIdx];
  if (!script) return;

  const objectiveHtml = `<div class="gdemo-objective"><span class="gdemo-objective-tag">STEP ${stepIdx + 1}/${MALWARE_DEMO_SCRIPT.length} · ${script.label}</span><span class="gdemo-objective-goal">🎯 ${script.objective}</span></div>`;
  setMalwareDemoSpeech(objectiveHtml + script.speech);

  const nextBtn = document.getElementById('btn-malware-demo-next');
  if (nextBtn) nextBtn.textContent = script.btn;
}

function setMalwareDemoSpeech(html) {
  const el = document.getElementById('gdemo-malware-speech-text');
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(4px)';
  el.style.transition = 'opacity 250ms, transform 250ms';
  setTimeout(() => {
    el.innerHTML = html;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 200);
}

function malwareDemoProceed() {
  const script = MALWARE_DEMO_SCRIPT[gmalwareDemoStep];
  if (!script) return;

  if (script.action) {
    executeMalwareDemoAction(script.action, () => {
      gmalwareDemoStep++;
      renderMalwareDemoStep(gmalwareDemoStep);
    });
  } else {
    gmalwareDemoStep++;
    renderMalwareDemoStep(gmalwareDemoStep);
  }
}

function executeMalwareDemoAction(action, callback) {
  const btn = document.getElementById('btn-malware-demo-next');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.5';
  }

  const re = () => {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
    callback();
  };

  if (action === 'select-file-1') {
    setMalwareDemoTab('folder');
    animateMalwareCursorTo('gdemo-mfile-1', () => {
      setTimeout(() => {
        malwareClickEffect(() => {
          const f1 = document.getElementById('gdemo-mfile-1');
          const f2 = document.getElementById('gdemo-mfile-2');
          if (f1) f1.classList.add('selected');
          if (f2) f2.classList.remove('selected');
          hideMalwareCursor();
          setTimeout(re, 400);
        });
      }, 400);
    });

  } else if (action === 'highlight-ext') {
    setMalwareDemoTab('folder');
    animateMalwareCursorTo('gdemo-mext-val', () => {
      setTimeout(() => {
        malwareClickEffect(() => {
          hideMalwareCursor();
          setTimeout(re, 500);
        });
      }, 500);
    });

  } else if (action === 'send-to-av') {
    setMalwareDemoTab('folder');
    animateMalwareCursorTo('gdemo-mbtn-scan-av', () => {
      setTimeout(() => {
        malwareClickEffect(() => {
          hideMalwareCursor();
          setTimeout(() => {
            setMalwareDemoTab('av');
            const targetName = document.getElementById('gdemo-mav-tc-name');
            const targetDetail = document.getElementById('gdemo-mav-tc-detail');
            const targetIcon = document.getElementById('gdemo-mav-tc-icon');
            if (targetName) targetName.textContent = 'bonus_payroll_sept.pdf.exe';
            if (targetDetail) targetDetail.textContent = 'Executable Binary (.exe) • 2.4 MB • SHA-256: a94f82c1b4…';
            if (targetIcon) targetIcon.textContent = '📄';
            setTimeout(re, 500);
          }, 350);
        });
      }, 400);
    });

  } else if (action === 'turn-on-av') {
    setMalwareDemoTab('av');
    animateMalwareCursorTo('gdemo-mav-toggle', () => {
      setTimeout(() => {
        malwareClickEffect(() => {
          setMalwareDemoAvActive(true);
          hideMalwareCursor();
          showToast('🛡️ Real-Time Protection activated in Demo!', 'success');
          setTimeout(re, 600);
        });
      }, 400);
    });

  } else if (action === 'run-av-scan') {
    setMalwareDemoTab('av');
    animateMalwareCursorTo('gdemo-mav-scan-btn', () => {
      setTimeout(() => {
        malwareClickEffect(() => {
          hideMalwareCursor();
          const progressWrap = document.getElementById('gdemo-mav-progress-wrap');
          const progressFill = document.getElementById('gdemo-mav-progress-fill');
          const progressPct = document.getElementById('gdemo-mav-progress-pct');
          const resultCard = document.getElementById('gdemo-mav-result');

          if (progressWrap) progressWrap.classList.remove('hidden');
          if (resultCard) resultCard.classList.add('hidden');

          let pct = 0;
          const interval = setInterval(() => {
            pct += 25;
            if (progressFill) progressFill.style.width = pct + '%';
            if (progressPct) progressPct.textContent = pct + '%';

            if (pct >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                if (progressWrap) progressWrap.classList.add('hidden');
                if (resultCard) {
                  resultCard.className = 'av-result-card threat';
                  resultCard.classList.remove('hidden');
                  resultCard.innerHTML = `
                    <div class="av-result-left">
                      <div class="av-threat-title" id="gdemo-mav-res-title">⚠️ THREAT IDENTIFIED: Trojan.Win32.DoubleExt</div>
                      <div class="av-threat-desc" id="gdemo-mav-res-desc">Disguised executable binary. Signature matches known backdoor dropper payload.</div>
                    </div>
                    <div>
                      <button class="btn-danger btn-sm" id="gdemo-mav-quarantine-btn" onclick="malwareDemoTriggerQuarantine()">🚩 QUARANTINE THREAT (+100)</button>
                    </div>`;
                }
                setTimeout(re, 400);
              }, 300);
            }
          }, 150);
        });
      }, 400);
    });

  } else if (action === 'quarantine-threat') {
    setMalwareDemoTab('av');
    animateMalwareCursorTo('gdemo-mav-quarantine-btn', () => {
      setTimeout(() => {
        malwareClickEffect(() => {
          hideMalwareCursor();
          const resultCard = document.getElementById('gdemo-mav-result');
          if (resultCard) {
            resultCard.innerHTML = `
              <div class="av-result-left">
                <div class="av-threat-title" style="color:var(--accent-green)">🛡️ THREAT NEUTRALIZED: Trojan.Win32.DoubleExt</div>
                <div class="av-threat-desc">File successfully quarantined and moved into the encrypted vault (+100 pts).</div>
              </div>
              <div>
                <span style="font-size:12px;color:var(--accent-green);font-weight:700">✓ QUARANTINED</span>
              </div>`;
          }

          const qCount = document.getElementById('gdemo-mav-qcount');
          if (qCount) qCount.textContent = '1';
          const vaultCount = document.getElementById('gdemo-mav-vault-count');
          if (vaultCount) vaultCount.textContent = '1 Quarantined';

          const threatsList = document.getElementById('gdemo-mav-threats-list');
          if (threatsList) {
            threatsList.innerHTML = `
              <div class="av-threat-item quarantined">
                <div>
                  <strong style="color:#ffffff;font-size:13px">bonus_payroll_sept.pdf.exe</strong>
                  <div style="font-size:12px;color:#cbd5e1;margin-top:2px">Trojan.Win32.DoubleExt • Quarantined into Vault</div>
                </div>
                <span style="color:#c084fc;font-weight:800;font-size:11.5px">🛡️ SECURED</span>
              </div>`;
          }

          const f1Status = document.getElementById('gdemo-mfile-1-status');
          if (f1Status) {
            f1Status.className = 'badge-file-status badge-quarantined';
            f1Status.innerHTML = '🛡️ Quarantined';
          }
          const f1Row = document.getElementById('gdemo-mfile-1');
          if (f1Row) f1Row.classList.add('quarantined');

          setTimeout(re, 500);
        });
      }, 400);
    });

  } else if (action === 'select-clean-file') {
    setMalwareDemoTab('folder');
    setTimeout(() => {
      animateMalwareCursorTo('gdemo-mfile-2', () => {
        setTimeout(() => {
          malwareClickEffect(() => {
            const f1 = document.getElementById('gdemo-mfile-1');
            const f2 = document.getElementById('gdemo-mfile-2');
            if (f1) f1.classList.remove('selected');
            if (f2) f2.classList.add('selected');

            setMalwareDemoInspection({
              icon: '📝',
              name: 'project_roadmap_2026.docx',
              sub: 'Microsoft Word Document • 340 KB',
              hash: 'c8317e0892bf44a1…',
              ext: '<span style="color:var(--accent-cyan);font-weight:700">.docx</span>',
              status: 'Ready for Scan',
              analysis: '✅ <strong>Legitimate Office Document</strong>: Valid Office Open XML format. Standard text and media streams, no hidden executables, unsigned macros disabled.',
              analysisClass: 'clean'
            });

            hideMalwareCursor();
            setTimeout(re, 500);
          });
        }, 400);
      });
    }, 200);

  } else if (action === 'scan-clean-file') {
    setMalwareDemoTab('av');
    const targetName = document.getElementById('gdemo-mav-tc-name');
    const targetDetail = document.getElementById('gdemo-mav-tc-detail');
    const targetIcon = document.getElementById('gdemo-mav-tc-icon');
    if (targetName) targetName.textContent = 'project_roadmap_2026.docx';
    if (targetDetail) targetDetail.textContent = 'Word Document (.docx) • 340 KB • SHA-256: c8317e0892…';
    if (targetIcon) targetIcon.textContent = '📝';

    const resultCard = document.getElementById('gdemo-mav-result');
    if (resultCard) resultCard.classList.add('hidden');

    setTimeout(() => {
      animateMalwareCursorTo('gdemo-mav-scan-btn', () => {
        setTimeout(() => {
          malwareClickEffect(() => {
            hideMalwareCursor();
            const progressWrap = document.getElementById('gdemo-mav-progress-wrap');
            const progressFill = document.getElementById('gdemo-mav-progress-fill');
            const progressPct = document.getElementById('gdemo-mav-progress-pct');

            if (progressWrap) progressWrap.classList.remove('hidden');

            let pct = 0;
            const interval = setInterval(() => {
              pct += 35;
              if (pct > 100) pct = 100;
              if (progressFill) progressFill.style.width = pct + '%';
              if (progressPct) progressPct.textContent = pct + '%';

              if (pct >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                  if (progressWrap) progressWrap.classList.add('hidden');
                  if (resultCard) {
                    resultCard.className = 'av-result-card clean';
                    resultCard.classList.remove('hidden');
                    resultCard.innerHTML = `
                      <div class="av-result-left">
                        <div class="av-threat-title">✅ FILE IS CLEAN: Safe Document</div>
                        <div class="av-threat-desc">Zero threat signatures or exploits detected. Valid Word document.</div>
                      </div>
                      <div>
                        <span style="font-size:12px;color:var(--accent-green);font-weight:700">✓ NO ACTION NEEDED</span>
                      </div>`;
                  }
                  const f2Status = document.getElementById('gdemo-mfile-2-status');
                  if (f2Status) {
                    f2Status.className = 'badge-file-status badge-clean';
                    f2Status.textContent = '✓ Safe';
                  }
                  setTimeout(re, 500);
                }, 250);
              }
            }, 120);
          });
        }, 400);
      });
    }, 200);

  } else if (action === 'done') {
    startMalwareMission();
  }
}

function animateMalwareCursorTo(targetId, cb) {
  const cursor = document.getElementById('gdemo-malware-cursor');
  const workspace = document.getElementById('gdemo-malware-workspace');
  const target = document.getElementById(targetId);
  if (!target || !workspace || !cursor) { if (cb) cb(); return; }

  const wsRect = workspace.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();

  const left = tRect.left - wsRect.left + (tRect.width / 2) - 12;
  const top = tRect.top - wsRect.top + (tRect.height / 2);

  cursor.classList.add('visible');
  cursor.style.left = left + 'px';
  cursor.style.top = top + 'px';

  setTimeout(() => {
    target.classList.add('gdemo-highlight-pulse');
    setTimeout(() => target.classList.remove('gdemo-highlight-pulse'), 700);
  }, 700);
}

function handleMalwareDemoFileClick(fileKey) {
  if (fileKey === 'f1') {
    const f1 = document.getElementById('gdemo-mfile-1');
    const f2 = document.getElementById('gdemo-mfile-2');
    if (f1) f1.classList.add('selected');
    if (f2) f2.classList.remove('selected');
    setMalwareDemoInspection({
      icon: '📄',
      name: 'invoice_march_overdue.pdf.exe',
      sub: 'Executable Application (.exe) • 840 KB',
      hash: 'e71829da1b0c9f42…',
      ext: '<span style="color:var(--accent-red);font-weight:700">.exe</span> <span style="font-size:10px;color:var(--accent-red)">(Double Extension!)</span>',
      status: '<span style="color:var(--accent-red);font-weight:700">⚠️ Fake PDF Extension</span>',
      analysis: '⚠️ <strong>Trojan / Double Extension Alert</strong>: Filename mimics a PDF document, but the real file extension is <code>.exe</code>. Opening it executes binary code!',
      analysisClass: 'suspicious'
    });
  } else if (fileKey === 'f2') {
    const f1 = document.getElementById('gdemo-mfile-1');
    const f2 = document.getElementById('gdemo-mfile-2');
    if (f1) f1.classList.remove('selected');
    if (f2) f2.classList.add('selected');
    setMalwareDemoInspection({
      icon: '📝',
      name: 'project_roadmap_2026.docx',
      sub: 'Microsoft Word Document • 340 KB',
      hash: 'c8317e0892bf44a1…',
      ext: '<span style="color:var(--accent-cyan);font-weight:700">.docx</span>',
      status: 'Ready for Scan',
      analysis: '✅ <strong>Legitimate Office Document</strong>: Valid Office Open XML format. Standard text and media streams, no hidden executables, unsigned macros disabled.',
      analysisClass: 'clean'
    });
  }
}

function malwareDemoGoToScan() {
  setMalwareDemoTab('av');
}

function malwareDemoTriggerScan() {
  if (!demoAvProtection) {
    showToast('⚠️ Anti-Virus is OFF! Click the PROTECTION toggle button to turn it ON before scanning.', 'warning');
    const toggleBtn = document.getElementById('gdemo-mav-toggle');
    if (toggleBtn) {
      toggleBtn.classList.add('highlight-pulse');
      setTimeout(() => toggleBtn.classList.remove('highlight-pulse'), 1200);
    }
    return;
  }
  const scanBtn = document.getElementById('gdemo-mav-scan-btn');
  if (scanBtn) scanBtn.click();
}

function malwareDemoTriggerQuarantine() {
  const qBtn = document.getElementById('gdemo-mav-quarantine-btn');
  if (qBtn) qBtn.click();
}

function startMalwareMission() {
  closeOverlay('overlay-results');
  closeOverlay('overlay-malware-demo');
  gameState.phase = 'malware';
  gameState.malwareQuarantined = 0;
  gameState.malwareFalsePositives = 0;
  gameState.selectedFolderFileId = null;
  gameState.activeScanFileId = null;
  gameState.antivirusProtection = true;

  updateStickyNoteForPhase('malware');

  FOLDER_FILES.forEach(f => {
    f.quarantined = false;
    f.scanned = false;
  });

  // Minimize Gmail so player focuses on Folder and Anti-Virus
  minimizeApp('gmail');

  renderFolderFiles();
  updateAntiVirusProtectionUI();
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

// ═══════════════════════════════════════════════════════════
// REAL WINDOWS FILE EXPLORER & MULTI-VIEWER SYSTEM
// ═══════════════════════════════════════════════════════════

let currentExplorerFolder = 'downloads';
let explorerViewMode = 'details'; // 'details' | 'grid'
let previewPaneVisible = false;
let explorerHistory = ['downloads'];
let explorerHistoryIdx = 0;
let explorerSortCol = 'name';
let explorerSortAsc = true;

// Additional folder virtual files for non-Downloads folders
const EXPLORER_ADDITIONAL_FILES = {
  documents: [
    {
      id: 'doc_arch',
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
      analysis: '✅ Verified clean Word document. Normal Office OpenXML structure, zero macro scripts.',
      quarantined: false,
      scanned: true
    }
  ],
  pictures: [
    {
      id: 'pic_retreat',
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
      analysis: '✅ Standard digital photograph. Valid JFIF/EXIF header metadata, zero steganographic payloads.',
      quarantined: false,
      scanned: true,
      mediaSrc: 'assets/background/Coffe shop.png'
    }
  ],
  videos: [
    {
      id: 'vid_awareness',
      name: 'cyber_awareness_clip.mp4',
      fakeExt: 'mp4',
      realExt: 'mp4',
      type: 'MP4 Video File (.mp4)',
      size: '17.3 MB',
      date: '9/6/2026 10:20 AM',
      icon: '🎬',
      isMalware: false,
      threatName: 'Clean File',
      threatCategory: 'SAFE',
      hash: '7c91a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f99aa',
      analysis: '✅ Standard H.264 / AAC multimedia file. Verified digital container structure with no malicious buffer overflow triggers.',
      quarantined: false,
      scanned: false,
      mediaSrc: 'assets/video/video3.mp4'
    }
  ],
  desktop: [
    {
      id: 'desk_app_gmail',
      name: 'Email',
      fakeExt: 'lnk',
      realExt: 'lnk',
      type: 'Application Shortcut',
      size: '2 KB',
      date: '9/6/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/mail.svg" alt="Email" />',
      appId: 'gmail',
      isMalware: false,
      threatName: 'Application',
      threatCategory: 'SAFE',
      hash: 'EMAIL-APP-SHORTCUT-CYBERZERO',
      analysis: 'System shortcut for Email (Phishing Investigation Suite).',
      quarantined: false,
      scanned: true
    },
    {
      id: 'desk_app_browser',
      name: 'Browser',
      fakeExt: 'lnk',
      realExt: 'lnk',
      type: 'Application Shortcut',
      size: '2 KB',
      date: '9/6/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/browser.svg" alt="Browser" />',
      appId: 'browser',
      isMalware: false,
      threatName: 'Application',
      threatCategory: 'SAFE',
      hash: 'BROWSER-APP-SHORTCUT-CYBERZERO',
      analysis: 'System shortcut for Cyber-Net Web Browser.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'desk_app_notes',
      name: 'Sticky Notes',
      fakeExt: 'lnk',
      realExt: 'lnk',
      type: 'Application Shortcut',
      size: '1 KB',
      date: '9/6/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/note.svg" alt="Sticky Notes" />',
      appId: 'notes',
      isMalware: false,
      threatName: 'Application',
      threatCategory: 'SAFE',
      hash: 'NOTES-APP-SHORTCUT-CYBERZERO',
      analysis: 'System shortcut for Sticky Notes application.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'desk_app_folder',
      name: 'File Explorer',
      fakeExt: 'lnk',
      realExt: 'lnk',
      type: 'Application Shortcut',
      size: '2 KB',
      date: '9/6/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/folder.svg" alt="File Explorer" />',
      appId: 'folder',
      isMalware: false,
      threatName: 'Application',
      threatCategory: 'SAFE',
      hash: 'EXPLORER-APP-SHORTCUT-CYBERZERO',
      analysis: 'System shortcut for Windows File Explorer.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'desk_app_antivirus',
      name: 'ShieldAV Anti-Virus',
      fakeExt: 'lnk',
      realExt: 'lnk',
      type: 'Application Shortcut',
      size: '3 KB',
      date: '9/6/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/windows_defender.svg" alt="ShieldAV Anti-Virus" />',
      appId: 'antivirus',
      isMalware: false,
      threatName: 'Application',
      threatCategory: 'SAFE',
      hash: 'SHIELDAV-APP-SHORTCUT-CYBERZERO',
      analysis: 'System shortcut for ShieldAV Endpoint Protection.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'desk_app_comms',
      name: 'Phone Link',
      fakeExt: 'lnk',
      realExt: 'lnk',
      type: 'Application Shortcut',
      size: '2 KB',
      date: '9/6/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/Smartphone.svg" alt="Phone Link" />',
      appId: 'comms',
      isMalware: false,
      threatName: 'Application',
      threatCategory: 'SAFE',
      hash: 'PHONELINK-APP-SHORTCUT-CYBERZERO',
      analysis: 'System shortcut for Phone Link / CyberComms application.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'desk_app_recycle',
      name: 'Recycle Bin',
      fakeExt: 'lnk',
      realExt: 'lnk',
      type: 'System Folder',
      size: '0 KB',
      date: '9/6/2026 08:00 AM',
      icon: '<img src="assets/icons/folder icons/delete.svg" alt="Recycle Bin" />',
      isMalware: false,
      threatName: 'System Folder',
      threatCategory: 'SAFE',
      hash: 'RECYCLE-BIN-SYSTEM-SHORTCUT',
      analysis: 'Windows Recycle Bin for temporary deleted file storage.',
      quarantined: false,
      scanned: true
    }
  ],
  music: [
    {
      id: 'mus_theme',
      name: 'cyberzero_main_theme.mp3',
      fakeExt: 'mp3',
      realExt: 'mp3',
      type: 'MP3 Audio File (.mp3)',
      size: '4.6 MB',
      date: '9/6/2026 11:20 AM',
      icon: '🎵',
      isMalware: false,
      threatName: 'Clean File',
      threatCategory: 'SAFE',
      hash: 'c4a89f012de940404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f91a0',
      analysis: '✅ Verified clean MP3 audio stream (320 kbps). Clean acoustic ID3 tags, no malicious payload.',
      quarantined: false,
      scanned: true,
      mediaSrc: 'assets/sounds/Hi - Wii.mp3',
      artist: 'CyberZero OST • 320 kbps'
    }
  ],
  usb: [],
  network: [],
  thispc: [
    {
      id: 'pc_perflogs',
      name: 'PerfLogs',
      fakeExt: 'dir',
      realExt: 'dir',
      subFolderKey: 'dir_perflogs',
      type: 'File Folder',
      size: '0 KB',
      date: '9/1/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />',
      isMalware: false,
      threatName: 'System Folder',
      threatCategory: 'SAFE',
      hash: 'C-PERFLOGS-DIR',
      analysis: '✅ Windows Performance Logs directory.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'pc_prog',
      name: 'Program Files',
      fakeExt: 'dir',
      realExt: 'dir',
      subFolderKey: 'dir_progfiles',
      type: 'File Folder',
      size: '24.5 GB',
      date: '9/1/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />',
      isMalware: false,
      threatName: 'System Folder',
      threatCategory: 'SAFE',
      hash: 'C-PROGRAM-FILES-DIR',
      analysis: '✅ Core Windows 64-bit application binaries and runtime frameworks.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'pc_prog86',
      name: 'Program Files (x86)',
      fakeExt: 'dir',
      realExt: 'dir',
      subFolderKey: 'dir_progfiles86',
      type: 'File Folder',
      size: '12.1 GB',
      date: '9/1/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />',
      isMalware: false,
      threatName: 'System Folder',
      threatCategory: 'SAFE',
      hash: 'C-PROGRAM-FILES-X86-DIR',
      analysis: '✅ 32-bit legacy application directory.',
      quarantined: false,
      scanned: true
    },
    {
      id: 'pc_users',
      name: 'Users',
      fakeExt: 'dir',
      realExt: 'dir',
      subFolderKey: 'dir_users',
      type: 'File Folder',
      size: '45.8 GB',
      date: '9/1/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />',
      isMalware: false,
      threatName: 'System Folder',
      threatCategory: 'SAFE',
      hash: 'C-USERS-PROFILES-DIR',
      analysis: '✅ User profiles directory (C:\\Users\\Nishren).',
      quarantined: false,
      scanned: true
    },
    {
      id: 'pc_win',
      name: 'Windows',
      fakeExt: 'dir',
      realExt: 'dir',
      subFolderKey: 'dir_windows',
      type: 'System Folder',
      size: '38.2 GB',
      date: '9/1/2026 08:00 AM',
      icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />',
      isMalware: false,
      threatName: 'System Folder',
      threatCategory: 'SAFE',
      hash: 'C-WINDOWS-SYSTEM-ROOT',
      analysis: '✅ Windows 11 Operating System files, system drivers, and kernel assemblies.',
      quarantined: false,
      scanned: true
    }
  ],

  // ── Windows C Sub-folders ──────────────────────────────────
  dir_perflogs: [],

  dir_progfiles: [
    { id: 'pf_wdef', name: 'Windows Defender', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '210 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'PF-WDEF', analysis: '✅ Windows Defender antivirus binaries.', quarantined: false, scanned: true },
    { id: 'pf_edge', name: 'Microsoft Edge', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '890 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'PF-EDGE', analysis: '✅ Microsoft Edge browser installation.', quarantined: false, scanned: true },
    { id: 'pf_office', name: 'Microsoft Office', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '4.2 GB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'PF-OFFICE', analysis: '✅ Microsoft Office 365 suite (Word, Excel, Outlook).', quarantined: false, scanned: true },
    { id: 'pf_wt', name: 'WindowsApps', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '1.8 GB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'PF-WAPPS', analysis: '✅ Microsoft Store and UWP applications.', quarantined: false, scanned: true }
  ],

  dir_progfiles86: [
    { id: 'pf86_vc', name: 'Microsoft Visual C++', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '340 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'PF86-VC', analysis: '✅ Microsoft Visual C++ Redistributable (x86).', quarantined: false, scanned: true },
    { id: 'pf86_java', name: 'Java', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '480 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'PF86-JAVA', analysis: '✅ Java Runtime Environment (JRE 8 x86).', quarantined: false, scanned: true },
    { id: 'pf86_inet', name: 'Internet Explorer', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '92 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'PF86-IE', analysis: '✅ Legacy IE compatibility shim (disabled on Windows 11).', quarantined: false, scanned: true }
  ],

  dir_users: [
    { id: 'usr_nishren', name: 'Nishren', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '45.1 GB', date: '9/6/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'User Profile', threatCategory: 'SAFE', hash: 'USERS-NISHREN', analysis: '✅ Primary user profile directory.', quarantined: false, scanned: true },
    { id: 'usr_public', name: 'Public', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '512 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'User Profile', threatCategory: 'SAFE', hash: 'USERS-PUBLIC', analysis: '✅ Shared public user folder accessible to all local accounts.', quarantined: false, scanned: true },
    { id: 'usr_default', name: 'Default', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '28 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'User Profile', threatCategory: 'SAFE', hash: 'USERS-DEFAULT', analysis: '✅ Default user profile template used for new account creation.', quarantined: false, scanned: true }
  ],

  dir_windows: [
    { id: 'win_sys32', name: 'System32', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '18.4 GB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'WIN-SYS32', analysis: '✅ Core Windows 64-bit system DLLs, drivers and executables.', quarantined: false, scanned: true },
    { id: 'win_syswow', name: 'SysWOW64', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '6.1 GB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'WIN-SYSWOW64', analysis: '✅ 32-bit compatibility system libraries (WoW64 subsystem).', quarantined: false, scanned: true },
    { id: 'win_temp', name: 'Temp', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '1.2 GB', date: '9/6/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'WIN-TEMP', analysis: '✅ Windows temporary files directory. Safe to clear periodically.', quarantined: false, scanned: true },
    { id: 'win_fonts', name: 'Fonts', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '340 MB', date: '9/1/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'WIN-FONTS', analysis: '✅ Installed system font files (TrueType and OpenType).', quarantined: false, scanned: true },
    { id: 'win_logs', name: 'Logs', fakeExt: 'dir', realExt: 'dir', subFolderKey: null, type: 'File Folder', size: '880 MB', date: '9/6/2026 08:00 AM', icon: '<img src="assets/icons/apps/folder.svg" alt="Folder" />', isMalware: false, threatName: 'System Folder', threatCategory: 'SAFE', hash: 'WIN-LOGS', analysis: '✅ Windows event and setup logs used for diagnostics.', quarantined: false, scanned: true }
  ]
};

function getExplorerCurrentFiles() {
  if (currentExplorerFolder === 'downloads') {
    return FOLDER_FILES;
  }
  // thispc_contents shows the actual C: folder list
  if (currentExplorerFolder === 'thispc_contents') {
    return EXPLORER_ADDITIONAL_FILES['thispc'] || [];
  }
  // usb_contents shows the USB drive folder list (empty)
  if (currentExplorerFolder === 'usb_contents') {
    return EXPLORER_ADDITIONAL_FILES['usb'] || [];
  }
  return EXPLORER_ADDITIONAL_FILES[currentExplorerFolder] || [];
}

function getExplorerFileById(fileId) {
  // First check FOLDER_FILES
  let found = FOLDER_FILES.find(f => f.id === fileId);
  if (found) return found;

  // Check additional folder collections
  for (const list of Object.values(EXPLORER_ADDITIONAL_FILES)) {
    found = list.find(f => f.id === fileId);
    if (found) return found;
  }
  return null;
}

function renderFolderFiles(filterQuery = '') {
  const list = document.getElementById('folder-file-list');
  if (!list) return;
  list.innerHTML = '';
  list.removeAttribute('style');

  // ── SPECIAL VIEW: "This PC" — Devices and Drives ──────────────
  if (currentExplorerFolder === 'thispc') {
    list.className = 'folder-file-list thispc-view';
    list.innerHTML = `
      <div style="padding:8px 14px 0">
        <div class="thispc-section-label">Devices and drives</div>
        <div class="thispc-drives-grid">
          <div class="thispc-drive-card" id="drive-card-c" ondblclick="switchExplorerFolder('thispc_contents')" onclick="document.querySelectorAll('.thispc-drive-card').forEach(c=>c.classList.remove('selected'));this.classList.add('selected')" title="Double-click to open Windows (C:)">
            <div class="thispc-drive-card-top">
              <div class="thispc-drive-icon">💻<span class="drive-badge">C</span></div>
              <div class="thispc-drive-info">
                <div class="thispc-drive-name">Windows (C:)</div>
                <div class="thispc-drive-free">182 GB free of 512 GB</div>
              </div>
            </div>
            <div class="thispc-drive-bar"><div class="thispc-drive-bar-fill" style="width:64%"></div></div>
          </div>
          <div class="thispc-drive-card" id="drive-card-e" onclick="document.querySelectorAll('.thispc-drive-card').forEach(c=>c.classList.remove('selected'));this.classList.add('selected')" ondblclick="switchExplorerFolder('usb_contents')" title="Double-click to open USB Drive (E:)">
            <div class="thispc-drive-card-top">
              <div class="thispc-drive-icon">💾<span class="drive-badge">E</span></div>
              <div class="thispc-drive-info">
                <div class="thispc-drive-name">USB Drive (E:)</div>
                <div class="thispc-drive-free">16.0 GB free of 16.0 GB</div>
              </div>
            </div>
            <div class="thispc-drive-bar"><div class="thispc-drive-bar-fill empty" style="width:0%"></div></div>
          </div>
        </div>
        <div class="thispc-section-label">Network locations</div>
        <div class="thispc-drives-grid">
          <div class="thispc-drive-card" id="drive-card-net" ondblclick="switchExplorerFolder('network')" onclick="document.querySelectorAll('.thispc-drive-card').forEach(c=>c.classList.remove('selected'));this.classList.add('selected')" title="Double-click to open Network">
            <div class="thispc-drive-card-top">
              <div class="thispc-drive-icon">🌐</div>
              <div class="thispc-drive-info">
                <div class="thispc-drive-name">Network (CYBER-ACADEMY)</div>
                <div class="thispc-drive-free">192.168.1.0/24 • SMB 3.1.1</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    updateFolderStatusBar(3, null);
    return;
  }

  // ── SPECIAL VIEW: "USB Drive" root — show as drive card ──────
  if (currentExplorerFolder === 'usb') {
    list.className = 'folder-file-list thispc-view';
    list.innerHTML = `
      <div style="padding:8px 14px 0">
        <div class="thispc-section-label">USB Drive (E:)</div>
        <div class="thispc-drives-grid">
          <div class="thispc-drive-card" id="usb-open-card" ondblclick="switchExplorerFolder('usb_contents')" onclick="document.querySelectorAll('.thispc-drive-card').forEach(c=>c.classList.remove('selected'));this.classList.add('selected')" title="Double-click to open USB Drive (E:)">
            <div class="thispc-drive-card-top">
              <div class="thispc-drive-icon">💾<span class="drive-badge">E</span></div>
              <div class="thispc-drive-info">
                <div class="thispc-drive-name">USB Drive (E:)</div>
                <div class="thispc-drive-free">16.0 GB free of 16.0 GB</div>
              </div>
            </div>
            <div class="thispc-drive-bar"><div class="thispc-drive-bar-fill empty" style="width:0%"></div></div>
          </div>
        </div>
      </div>`;
    updateFolderStatusBar(1, null);
    return;
  }

  const isDesktop = (currentExplorerFolder === 'desktop');

  // ── SPECIAL VIEW: Desktop folder — Windows desktop icon layout ─
  if (isDesktop) {
    list.className = 'folder-file-list desktop-folder-view';

    const currentFiles = getExplorerCurrentFiles();
    const q = filterQuery.toLowerCase().trim();
    const filtered = currentFiles.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));

    if (filtered.length === 0) {
      list.className = 'folder-file-list empty-folder-view';
      list.innerHTML = `
        <div class="folder-empty-state">
          <div class="folder-empty-icon">🔍</div>
          <div class="folder-empty-text">No matching items.</div>
        </div>`;
      updateFolderStatusBar(0, null);
      return;
    }

    // Build column-flow grid of desktop icons
    list.innerHTML = `<div class="desk-folder-grid">${filtered.map(file => `
      <div class="desk-folder-icon ${file.id === gameState.selectedFolderFileId ? 'selected' : ''}"
           id="dfi-${file.id}"
           onclick="selectFolderFile('${file.id}')"
           ondblclick="openFileFromFolder('${file.id}')"
           title="${file.name}">
        <div class="dfi-icon">${file.icon}</div>
        <div class="dfi-name">${file.name}</div>
      </div>`).join('')}
    </div>`;

    updateFolderStatusBar(filtered.length, getExplorerFileById(gameState.selectedFolderFileId));
    return;
  }

  // Desktop folder is always shown in icon grid view
  const effectiveViewMode = explorerViewMode;
  list.className = `folder-file-list view-${effectiveViewMode}`;

  const currentFiles = getExplorerCurrentFiles();
  const q = filterQuery.toLowerCase().trim();
  let filtered = currentFiles.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));

  // Sort files
  filtered.sort((a, b) => {
    let valA = a[explorerSortCol] || '';
    let valB = b[explorerSortCol] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return explorerSortAsc ? -1 : 1;
    if (valA > valB) return explorerSortAsc ? 1 : -1;
    return 0;
  });

  if (filtered.length === 0) {
    const isUsb = (currentExplorerFolder === 'usb_contents');
    const emptyMsg = q ? 'No matching files found.' : (isUsb ? 'This drive is empty.' : 'This folder is empty.');
    const emptyIcon = q ? '🔍' : (isUsb ? '💾' : '📁');
    list.className = 'folder-file-list empty-folder-view';
    list.innerHTML = `
      <div class="folder-empty-state">
        <div class="folder-empty-icon">${emptyIcon}</div>
        <div class="folder-empty-text">${emptyMsg}</div>
      </div>`;
    updateFolderStatusBar(0, null);
    return;
  }

  filtered.forEach(file => {
    if (effectiveViewMode === 'details') {
      const row = document.createElement('div');
      row.className = `folder-file-row ${file.id === gameState.selectedFolderFileId ? 'selected' : ''} ${file.quarantined ? 'quarantined' : ''}`;
      row.onclick = () => selectFolderFile(file.id);
      row.ondblclick = () => openFileFromFolder(file.id);

      row.innerHTML = `
        <div class="file-name-cell">
          <span class="file-icon">${file.icon}</span>
          <span class="file-name-text" title="${file.name}">${file.name}</span>
        </div>
        <div>${file.date}</div>
        <div>${file.type}</div>
        <div>${file.size}</div>`;

      list.appendChild(row);
    } else {
      // Large Icons Grid View
      const card = document.createElement('div');
      card.className = `grid-file-card ${file.id === gameState.selectedFolderFileId ? 'selected' : ''} ${file.quarantined ? 'quarantined' : ''}`;
      card.onclick = () => selectFolderFile(file.id);
      card.ondblclick = () => openFileFromFolder(file.id);

      card.innerHTML = `
        <div class="grid-card-icon">${file.icon}</div>
        <div class="grid-card-name" title="${file.name}">${file.name}</div>
        ${isDesktop ? '' : `<div class="grid-card-tag">${file.size}</div>`}`;

      list.appendChild(card);
    }
  });

  const selectedFile = getExplorerFileById(gameState.selectedFolderFileId);
  updateFolderStatusBar(filtered.length, selectedFile);
}

function updateFolderStatusBar(itemCount, selectedFile) {
  const itemsEl = document.getElementById('explorer-status-items');
  const selEl = document.getElementById('explorer-status-selected');
  if (itemsEl) itemsEl.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;
  if (selEl) {
    if (selectedFile) {
      selEl.textContent = `1 item selected (${selectedFile.size})`;
    } else {
      selEl.textContent = `0 items selected`;
    }
  }
}

function filterFolderFiles(val) {
  renderFolderFiles(val);
}

function clearFolderSearch() {
  const inp = document.getElementById('folder-search-input');
  if (inp) {
    inp.value = '';
    renderFolderFiles('');
  }
}

function switchExplorerFolder(folderKey) {
  currentExplorerFolder = folderKey;

  // Update history
  if (explorerHistory[explorerHistoryIdx] !== folderKey) {
    explorerHistory = explorerHistory.slice(0, explorerHistoryIdx + 1);
    explorerHistory.push(folderKey);
    explorerHistoryIdx = explorerHistory.length - 1;
  }

  // Update sidebar active class
  document.querySelectorAll('.explorer-sidebar .sidebar-item').forEach(el => el.classList.remove('active'));
  const _sidebarKey = (folderKey === 'thispc' || folderKey === 'thispc_contents' || folderKey.startsWith('dir_'))
    ? 'c'
    : (folderKey === 'usb' || folderKey === 'usb_contents') ? 'usb'
    : folderKey;
  const activeSidebarItem = document.getElementById(`sidebar-folder-${_sidebarKey}`) || document.getElementById(`sidebar-folder-${folderKey}`);
  if (activeSidebarItem) activeSidebarItem.classList.add('active');

  // Update downloads badge count
  const dlBadge = document.getElementById('downloads-badge');
  if (dlBadge) {
    dlBadge.textContent = FOLDER_FILES.length;
    dlBadge.style.display = FOLDER_FILES.length > 0 ? '' : 'none';
  }



  // Render Drive & Network Location Banners
  const bannerEl = document.getElementById('explorer-banner-area');
  if (bannerEl) {
    if (folderKey === 'thispc' || folderKey === 'usb' || folderKey === 'network' || folderKey === 'usb_contents') {
      // Self-contained pages and empty locations — no banner needed
      bannerEl.classList.add('hidden');
      bannerEl.innerHTML = '';
    } else if (folderKey.startsWith('dir_')) {
      bannerEl.classList.remove('hidden');
      bannerEl.innerHTML = `
        <div class="explorer-drive-banner" style="cursor:pointer" onclick="switchExplorerFolder('thispc_contents')" title="Back to Windows (C:)">
          <div class="edb-icon">💻</div>
          <div class="edb-main">
            <div class="edb-title-row">
              <span class="edb-title">Windows (C:) — 512 GB</span>
            </div>
            <div class="edb-bar"><div class="edb-bar-fill" style="width: 64%"></div></div>
            <div class="edb-stats">330 GB used • 182 GB free of 512 GB (BitLocker: ON)</div>
          </div>
        </div>`;
    } else if (folderKey === 'usb_contents') {
      // Inside USB folder — no banner, just show files
      bannerEl.classList.add('hidden');
      bannerEl.innerHTML = '';
    } else {
      bannerEl.classList.add('hidden');
      bannerEl.innerHTML = '';
    }
  }

  // Update breadcrumb
  const pathEl = document.getElementById('folder-active-path');
  const tabTitle = document.getElementById('explorer-tab-title');
  const searchInput = document.getElementById('folder-search-input');

  const folderNames = {
    downloads: 'Suspicious_Transfers',
    documents: 'Documents',
    pictures: 'Pictures',
    videos: 'Videos',
    music: 'Music',
    desktop: 'Desktop',
    thispc: 'This PC',
    thispc_contents: 'Windows (C:)',
    usb: 'USB Drive (E:)',
    usb_contents: 'USB Drive (E:)',
    network: 'Network',
    // Windows C sub-folders
    dir_perflogs:   'PerfLogs',
    dir_progfiles:  'Program Files',
    dir_progfiles86:'Program Files (x86)',
    dir_users:      'Users',
    dir_windows:    'Windows'
  };

  // Map sub-folder keys back to their parent drive banner
  const subFolderParent = {
    dir_perflogs:   'thispc_contents',
    dir_progfiles:  'thispc_contents',
    dir_progfiles86:'thispc_contents',
    dir_users:      'thispc_contents',
    dir_windows:    'thispc_contents',
    thispc_contents: 'thispc',
    usb_contents:   'thispc'
  };
  const parentKey = subFolderParent[folderKey] || null;

  const displayName = folderNames[folderKey] || folderKey;
  const parentDriveName = parentKey ? (folderNames[parentKey] || parentKey) : null;
  const breadcrumb = parentDriveName ? `${parentDriveName} › ${displayName}` : displayName;
  if (pathEl) pathEl.textContent = breadcrumb;
  if (tabTitle) tabTitle.textContent = `${displayName} — File Explorer`;
  if (searchInput) searchInput.placeholder = `Search ${displayName}...`;

  // Reset search
  if (searchInput) searchInput.value = '';

  // Reset file selection
  gameState.selectedFolderFileId = null;
  const emptyEl = document.getElementById('fdp-empty');
  const contentEl = document.getElementById('fdp-content');
  if (emptyEl) emptyEl.classList.remove('hidden');
  if (contentEl) contentEl.classList.add('hidden');

  // Show/hide the details column header (Name / Date / Type / Size)
  const tableHeader = document.getElementById('explorer-table-header');
  if (tableHeader) {
    const hideHeader = (folderKey === 'desktop' || folderKey === 'thispc' || folderKey === 'usb');
    tableHeader.style.display = hideHeader ? 'none' : (explorerViewMode === 'details' ? 'grid' : 'none');
  }

  renderFolderFiles('');
}

function explorerGoBack() {
  if (explorerHistoryIdx > 0) {
    explorerHistoryIdx--;
    switchExplorerFolder(explorerHistory[explorerHistoryIdx]);
  }
}

function explorerGoForward() {
  if (explorerHistoryIdx < explorerHistory.length - 1) {
    explorerHistoryIdx++;
    switchExplorerFolder(explorerHistory[explorerHistoryIdx]);
  }
}

function explorerGoUp() {
  switchExplorerFolder('thispc');
}

function refreshExplorerFolder() {
  renderFolderFiles(document.getElementById('folder-search-input')?.value || '');
  showToast('📁 Folder refreshed.', 'info');
}

function setExplorerViewMode(mode) {
  explorerViewMode = mode;
  const btnDetails = document.getElementById('cmd-view-details');
  const btnGrid = document.getElementById('cmd-view-grid');
  const statBtnDetails = document.getElementById('stat-btn-details');
  const statBtnGrid = document.getElementById('stat-btn-grid');
  const header = document.getElementById('explorer-table-header');

  if (btnDetails) btnDetails.classList.toggle('active', mode === 'details');
  if (btnGrid) btnGrid.classList.toggle('active', mode === 'grid');
  if (statBtnDetails) statBtnDetails.classList.toggle('active', mode === 'details');
  if (statBtnGrid) statBtnGrid.classList.toggle('active', mode === 'grid');

  if (header) {
    header.style.display = (mode === 'details') ? 'grid' : 'none';
  }

  renderFolderFiles(document.getElementById('folder-search-input')?.value || '');
}

function toggleExplorerPreviewPane() {
  previewPaneVisible = !previewPaneVisible;
  const pane = document.getElementById('folder-detail-pane');
  const btn = document.getElementById('cmd-toggle-preview');
  if (pane) pane.classList.toggle('collapsed', !previewPaneVisible);
  if (btn) btn.classList.toggle('active', previewPaneVisible);
}


function sortExplorerFiles(col) {
  if (explorerSortCol === col) {
    explorerSortAsc = !explorerSortAsc;
  } else {
    explorerSortCol = col;
    explorerSortAsc = true;
  }
  renderFolderFiles(document.getElementById('folder-search-input')?.value || '');
}

function createNewExplorerTab() {
  showToast('📁 New File Explorer tab opened.', 'info');
}

function explorerNewItem() {
  showToast('ℹ️ System policy: Creating new files is restricted in simulation sandbox.', 'info');
}
function explorerCut() { showToast('Selected file cut to clipboard', 'info'); }
function explorerCopy() { showToast('Selected file copied to clipboard', 'info'); }
function explorerRename() { showToast('Rename file: Access denied (File locked by system)', 'warning'); }
function explorerDelete() {
  if (gameState.selectedFolderFileId) {
    quarantineFile(gameState.selectedFolderFileId);
  } else {
    showToast('Please select a file first.', 'warning');
  }
}

function openSelectedExplorerFile() {
  if (!gameState.selectedFolderFileId) {
    showToast('⚠️ Please select a file from the list first.', 'warning');
    return;
  }
  openFileFromFolder(gameState.selectedFolderFileId);
}

function scanSelectedExplorerFile() {
  if (!gameState.selectedFolderFileId) {
    showToast('⚠️ Please select a file from the list first.', 'warning');
    return;
  }
  scanFileInAntivirus(gameState.selectedFolderFileId);
}

function quarantineSelectedExplorerFile() {
  if (!gameState.selectedFolderFileId) {
    showToast('⚠️ Please select a file from the list first.', 'warning');
    return;
  }
  quarantineFile(gameState.selectedFolderFileId);
}

function selectFolderFile(fileId) {
  gameState.selectedFolderFileId = fileId;
  const file = getExplorerFileById(fileId);
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

  // Generate In-Pane Live Preview Widget based on file type
  let quickPreviewHtml = '';
  const ext = file.realExt.toLowerCase();

  if (ext === 'docx') {
    quickPreviewHtml = `
      <div class="fdp-quick-preview">
        <div class="fdp-preview-doc-card">
          <div class="fdp-preview-doc-title">📄 Microsoft Word Document</div>
          <div class="fdp-preview-doc-snippet">
            <strong>CyberZerØ Student Defense Architecture</strong><br>
            Technical specifications & endpoint guidelines v2.4. Zero macro triggers found.
          </div>
        </div>
        <button class="fdp-preview-open-btn" onclick="openFileFromFolder('${file.id}')">
          <span>📂</span> Open in Microsoft Word
        </button>
      </div>`;
  } else if (ext === 'jpg' || ext === 'png') {
    const imgSrc = file.mediaSrc || 'assets/background/Coffe shop.png';
    quickPreviewHtml = `
      <div class="fdp-quick-preview">
        <img class="fdp-preview-img" src="${imgSrc}" alt="${file.name}" />
        <button class="fdp-preview-open-btn" onclick="openFileFromFolder('${file.id}')">
          <span>🖼️</span> View in Photos App
        </button>
      </div>`;
  } else if (ext === 'mp4') {
    quickPreviewHtml = `
      <div class="fdp-quick-preview">
        <div class="fdp-preview-video-wrap">
          <video class="fdp-preview-video" src="${file.mediaSrc || 'assets/video/video3.mp4'}" muted preload="metadata"></video>
        </div>
        <button class="fdp-preview-open-btn" onclick="openFileFromFolder('${file.id}')">
          <span>🎬</span> Play in Media Player
        </button>
      </div>`;
  } else if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'm4a') {
    quickPreviewHtml = `
      <div class="fdp-quick-preview" style="background:linear-gradient(135deg, rgba(30,58,138,0.25), rgba(139,92,246,0.25)); border:1px solid rgba(139,92,246,0.3); border-radius:8px; padding:16px 12px; text-align:center;">
        <div style="font-size:38px; margin-bottom:6px">🎵</div>
        <div style="font-size:12px; font-weight:700; color:#00e5ff; word-break:break-all">${file.name}</div>
        <div style="font-size:10.5px; color:#94a3b8; margin:4px 0 10px 0">${file.artist || 'CyberZero Soundtrack • 320 kbps MP3'}</div>
        <button class="fdp-preview-open-btn" onclick="openFileFromFolder('${file.id}')">
          <span>▶</span> Play in Media Player
        </button>
      </div>`;
  } else if (ext === 'srv' || ext === 'nas' || ext === 'ws' || ext === 'prt' || ext === 'mob' || ext === 'share') {
    quickPreviewHtml = `
      <div class="fdp-quick-preview" style="background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.3); border-radius:8px; padding:16px 12px; text-align:center;">
        <div style="font-size:38px; margin-bottom:6px">${file.icon}</div>
        <div style="font-size:12px; font-weight:700; color:#60a5fa">${file.name}</div>
        <div style="font-size:10.5px; color:#94a3b8; margin:4px 0 10px 0">${file.type} • Status: ${file.date}</div>
        <button class="fdp-preview-open-btn" onclick="openFileFromFolder('${file.id}')">
          <span>🔗</span> Connect / Explore Resource
        </button>
      </div>`;
  } else if (ext === 'iso' || ext === 'pcap' || ext === 'bin' || ext === 'inf' || ext === 'log') {
    quickPreviewHtml = `
      <div class="fdp-quick-preview" style="background:rgba(0,229,255,0.08); border:1px solid rgba(0,229,255,0.25); border-radius:8px; padding:16px 12px; text-align:center;">
        <div style="font-size:38px; margin-bottom:6px">${file.icon}</div>
        <div style="font-size:12px; font-weight:700; color:#00e5ff">${file.name}</div>
        <div style="font-size:10.5px; color:#94a3b8; margin:4px 0 10px 0">${file.type} • ${file.size}</div>
        <button class="fdp-preview-open-btn" onclick="openFileFromFolder('${file.id}')">
          <span>📂</span> Inspect File
        </button>
      </div>`;
  } else if (file.isMalware || ext === 'exe' || ext === 'scr' || ext === 'vbs') {
    quickPreviewHtml = `
      <div class="fdp-quick-preview" style="background:rgba(255,82,82,0.08);border-color:rgba(255,82,82,0.3)">
        <div style="font-size:32px;margin-bottom:6px">⚠️</div>
        <div style="font-size:11px;font-weight:700;color:#ff5252">UNTRUSTED EXECUTABLE BINARY</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:2px;text-align:center">Execution blocked by Defender SmartScreen</div>
      </div>`;
  }

  contentEl.innerHTML = `
    <div class="fdp-header">
      <div class="fdp-icon-large">${file.icon}</div>
      <div>
        <div class="fdp-name">${file.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${file.type} • ${file.size}</div>
      </div>
    </div>

    ${quickPreviewHtml}

    <div class="fdp-meta-table">
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">Date Modified</span>
        <span class="fdp-meta-val">${file.date}</span>
      </div>
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">File Type</span>
        <span class="fdp-meta-val">${file.type}</span>
      </div>
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">File Size</span>
        <span class="fdp-meta-val">${file.size}</span>
      </div>
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">Extension</span>
        <span class="fdp-meta-val" style="color:${file.realExt === 'exe' || file.realExt === 'scr' || file.realExt === 'vbs' ? 'var(--accent-red)' : 'var(--accent-cyan)'}">.${file.realExt}</span>
      </div>
      <div class="fdp-meta-row">
        <span class="fdp-meta-label">SHA-256</span>
        <span class="fdp-meta-val">${file.hash ? file.hash.slice(0, 16) + '…' : 'N/A'}</span>
      </div>
    </div>

    <div class="fdp-analysis-box ${analysisClass}">
      ${file.analysis}
    </div>`;

  // Pre-load target in Anti-Virus window
  const avTcName = document.getElementById('av-tc-name');
  const avTcDetail = document.getElementById('av-tc-detail');
  const avTcIcon = document.getElementById('av-tc-icon');
  if (avTcName && avTcDetail && avTcIcon) {
    avTcName.textContent = file.name;
    avTcDetail.textContent = `${file.type} • ${file.size} • SHA-256: ${file.hash.slice(0, 10)}…`;
    avTcIcon.innerHTML = file.icon;
  }
}

function scanFileInAntivirus(fileId) {
  selectFolderFile(fileId);
  openApp('antivirus');
  focusWindow('antivirus');
  startActiveScan();
}

// ═══════════════════════════════════════════════════════════
// OPEN FILE HANDLERS (DOCX, IMAGE, VIDEO, SMARTSCREEN)
// ═══════════════════════════════════════════════════════════

let smartscreenTargetFile = null;

function openFileFromFolder(fileId) {
  const file = getExplorerFileById(fileId);
  if (!file) return;

  // App shortcuts in Desktop folder
  if (file.appId) {
    if (file.appId === 'notes') {
      toggleStickyNote();
    } else {
      openApp(file.appId);
    }
    return;
  }
  if (file.id === 'desk_app_recycle') {
    showToast('🗑️ Recycle Bin is currently empty.', 'info');
    return;
  }

  if (file.quarantined) {
    showToast(`🛡️ Access Denied: "${file.name}" is quarantined in the Anti-Virus security vault!`, 'warning');
    if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
    return;
  }

  const ext = file.realExt.toLowerCase();

  // 1. DANGEROUS MALWARE / EXECUTABLE / SCRIPT
  if (file.isMalware || ext === 'exe' || ext === 'scr' || ext === 'vbs') {
    showSmartScreenWarning(file);
    return;
  }

  // 2. DOCX / WORD DOCUMENT
  if (ext === 'docx' || ext === 'doc' || ext === 'txt' || ext === 'pdf' || ext === 'xlsx') {
    openDocViewer(file);
    return;
  }

  // 3. IMAGE FILES
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'svg' || ext === 'webp') {
    openImageViewer(file);
    return;
  }

  // 4. AUDIO FILES (MP3, WAV, OGG, M4A)
  if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'm4a') {
    openAudioPlayer(file);
    return;
  }

  // 5. VIDEO FILES
  if (ext === 'mp4' || ext === 'webm' || ext === 'mov' || ext === 'mkv') {
    openVideoPlayer(file);
    return;
  }

  // 6. NETWORK RESOURCES & SHARES
  if (ext === 'srv' || ext === 'nas' || ext === 'ws' || ext === 'prt' || ext === 'mob' || ext === 'share') {
    showToast(`🌐 Connected to ${file.name} (${file.size || 'Local Subnet'}). Resource active.`, 'success');
    return;
  }

  // 7. DISK IMAGES & CAPTURES
  if (ext === 'iso') {
    showToast(`💿 Mounted "${file.name}" as virtual optical disc. Image clean.`, 'info');
    return;
  }
  if (ext === 'pcap') {
    showToast(`📊 Analyzed "${file.name}": 14,200 local packets verified clean.`, 'info');
    return;
  }
  if (ext === 'bin' || ext === 'inf' || ext === 'sys' || ext === 'log') {
    showToast(`⚙️ Inspected system file: "${file.name}" (${file.type}).`, 'info');
    return;
  }
  if (ext === 'dir') {
    // If this folder has a defined sub-folder, navigate into it
    if (file.subFolderKey) {
      switchExplorerFolder(file.subFolderKey);
    } else {
      showToast(`📁 "${file.name}" is empty or a protected system folder.`, 'info');
    }
    return;
  }

  showToast(`Opened "${file.name}" with default handler.`, 'info');
}

// ─── 1. MICROSOFT WORD (DOCX VIEWER) ────────────────────────
function openDocViewer(file) {
  const titleText = document.getElementById('docviewer-title-text');

  // Text File / Diagnostic Log View
  if (file.realExt === 'txt' || file.name.endsWith('.txt')) {
    if (titleText) titleText.textContent = `Notepad — ${file.name}`;
    const page = document.getElementById('docviewer-page-content');
    if (page) {
      page.innerHTML = `
        <div style="font-family:var(--font-mono, monospace); font-size:12px; line-height:1.6; color:#0f172a; white-space:pre-wrap; padding:10px;">
================================================================
USB FLASH DRIVE HARDWARE DIAGNOSTIC REPORT
Device: SanDisk Ultra USB 3.0 (16GB FAT32)
Volume Serial Number: 84B2-79F1
Scan Date: 2026-09-06 09:30:14 UTC
================================================================
[INFO] Bus Type: USB 3.2 Gen 1 (5.0 Gbps)
[INFO] Controller: Phison PS2251-09 (Verified OEM Firmware)
[INFO] Sector Size: 512 bytes | Cluster Size: 4096 bytes
[INFO] Bad Blocks / Sectors: 0 (Health Status: 100% HEALTHY)
[PASS] S.M.A.R.T. Self-Test Completed: PASSED
[PASS] Integrity Hash Check: No Bit Rot Detected
[PASS] File System Verification: 0 corrupt directory records
----------------------------------------------------------------
Security Telemetry (ShieldAV Storage Sentinel):
[✓] Hidden partitions: None
[✓] MBR / Boot Sector: Clean (Standard MS-DOS 5.0 boot record)
[✓] Malicious autorun payload: NOT DETECTED
================================================================
Status: DEVICE HARDWARE IS HEALTHY AND AUTHORIZED FOR USE.
================================================================
        </div>`;
    }
    openApp('docviewer');
    focusWindow('docviewer');
    showToast(`📝 Opened "${file.name}" in Text Viewer.`, 'success');
    return;
  }

  // Confidential Field Case Notes
  if (file.id === 'usb_notes') {
    if (titleText) titleText.textContent = `Microsoft Word — ${file.name}`;
    const page = document.getElementById('docviewer-page-content');
    if (page) {
      page.innerHTML = `
        <div class="word-doc-header-banner">
          <div>
            <div class="word-doc-title">CYBER INVESTIGATION FIELD NOTES</div>
            <div class="word-doc-subtitle">Incident Case #2026-004 • Confidential Forensic Journal</div>
          </div>
          <div style="font-size:32px">🕵️</div>
        </div>
        <div class="word-doc-meta-strip">
          <span><strong>Investigator:</strong> Nishren</span>
          <span><strong>Location:</strong> Campus Library & Server Room Perimeter</span>
          <span><strong>Security:</strong> AES-256 Passphrase Protected</span>
        </div>
        <h3 style="color:#1e40af;margin-top:0">Field Timeline</h3>
        <p><strong>08:30 AM:</strong> Identified rogue Wi-Fi beacon emitting SSID "CAMPUS_FREE_STUDENT_WIFI" near cafeteria.</p>
        <p><strong>08:45 AM:</strong> Packet capture initiated. Signal triangulation points to an unauthorized battery-powered ESP32/Pineapple access point.</p>
        <p><strong>09:15 AM:</strong> Intercepted credential phishing templates targeting campus student portal logins.</p>
        <div class="word-callout-box" style="margin-top:16px">
          <strong>✓ Action Plan:</strong> Alert students not to connect to unencrypted networks; advise Ms. Santos in IT to locate physical transmitter.
        </div>`;
    }
    openApp('docviewer');
    focusWindow('docviewer');
    showToast(`📄 Opened "${file.name}" in Microsoft Word.`, 'success');
    return;
  }

  if (titleText) titleText.textContent = `Microsoft Word — ${file.name}`;

  const page = document.getElementById('docviewer-page-content');
  if (page) {
    page.innerHTML = `
      <div class="word-doc-header-banner">
        <div>
          <div class="word-doc-title">CYBERZERØ CAMPUS DEFENSE ARCHITECTURE</div>
          <div class="word-doc-subtitle">High School Cyber Security Division • Technical Specification v2.6</div>
        </div>
        <div style="font-size:32px">🛡️</div>
      </div>

      <div class="word-doc-meta-strip">
        <span><strong>Author:</strong> Nishren (Lead Investigator)</span>
        <span><strong>Reviewer:</strong> Ms. Santos (IT Dept)</span>
        <span><strong>Classification:</strong> VERIFIED CLEAN</span>
        <span><strong>Status:</strong> Approved</span>
      </div>

      <h3 style="color:#1e40af;margin-top:0">1. Executive Overview</h3>
      <p>This document outlines the multi-layered cyber defense architecture deployed across campus student workstations. The primary mission is early threat detection, neutralization of spear-phishing campaigns, and real-time endpoint malware quarantine.</p>

      <h3 style="color:#1e40af">2. File Extension & Attachment Protocols</h3>
      <p>Attackers commonly exploit default operating system configurations that conceal known extensions. A double-extension file such as <code>document.pdf.exe</code> is technically an executable binary. Staff and students must enforce full file extension visibility.</p>

      <div class="word-callout-warning">
        <strong>⚠️ MANDATORY MACRO SECURITY POLICY:</strong><br>
        Legitimate official school documents will <strong>NEVER</strong> prompt users to "Enable Content", execute Visual Basic macros, or disable security sandboxing to read basic text. Any document demanding macro activation must be quarantined immediately.
      </div>

      <h3 style="color:#1e40af">3. Antivirus Integration & Digital Signatures</h3>
      <p>All downloaded attachments undergo automated SHA-256 hashing. The cryptographic signature for this document is verified as:</p>
      <div style="background:#f1f5f9;padding:8px 12px;border-radius:4px;font-family:var(--font-mono);font-size:10.5px;color:#0f172a;word-break:break-all">
        SHA-256: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e (Clean)
      </div>

      <div class="word-callout-box" style="margin-top:20px">
        <strong>✓ Document Verified:</strong> Clean Office OpenXML document structure. Zero obfuscated payloads or remote templates detected.
      </div>`;
  }

  openApp('docviewer');
  focusWindow('docviewer');
  showToast(`📄 Opened "${file.name}" in Microsoft Word.`, 'success');
}

function scanCurrentDocumentInAV() {
  if (gameState.selectedFolderFileId) {
    scanFileInAntivirus(gameState.selectedFolderFileId);
  } else {
    showToast('Document already verified clean by ShieldAV.', 'success');
  }
}

function setWordZoom(val) {
  const page = document.getElementById('docviewer-page-content');
  if (page) {
    page.style.transform = `scale(${val / 100})`;
    page.style.transformOrigin = 'top center';
  }
}

// ─── 2. PHOTOS / IMAGE VIEWER ───────────────────────────────
let imgViewerScale = 1;
let imgViewerRotation = 0;

function openImageViewer(file) {
  const titleText = document.getElementById('imageviewer-title-text');
  if (titleText) titleText.textContent = `Photos — ${file.name}`;

  const imgEl = document.getElementById('imgviewer-display');
  const imgSrc = file.mediaSrc || 'assets/background/Coffe shop.png';
  if (imgEl) {
    imgEl.src = imgSrc;
    imgViewerScale = 1;
    imgViewerRotation = 0;
    imgEl.style.transform = `scale(${imgViewerScale}) rotate(${imgViewerRotation}deg)`;
  }

  // Populate Info Drawer
  const infoList = document.getElementById('pinfo-list');
  if (infoList) {
    infoList.innerHTML = `
      <div class="pinfo-row">
        <span class="pinfo-label">File Name</span>
        <span class="pinfo-val">${file.name}</span>
      </div>
      <div class="pinfo-row">
        <span class="pinfo-label">Dimensions</span>
        <span class="pinfo-val">1920 × 1080 px</span>
      </div>
      <div class="pinfo-row">
        <span class="pinfo-label">File Size</span>
        <span class="pinfo-val">${file.size}</span>
      </div>
      <div class="pinfo-row">
        <span class="pinfo-label">Date Taken</span>
        <span class="pinfo-val">${file.date}</span>
      </div>
      <div class="pinfo-row">
        <span class="pinfo-label">Camera</span>
        <span class="pinfo-val">Sony Alpha 7 IV (35mm, f/2.8)</span>
      </div>
      <div class="pinfo-row">
        <span class="pinfo-label">Integrity</span>
        <span class="pinfo-val" style="color:#00e676">✓ Clean JFIF/EXIF Header</span>
      </div>`;
  }

  openApp('imageviewer');
  focusWindow('imageviewer');
  showToast(`🖼️ Opened "${file.name}" in Photos.`, 'success');
}

function imgViewerZoomIn() {
  imgViewerScale = Math.min(3, imgViewerScale + 0.25);
  _applyImgTransform();
}
function imgViewerZoomOut() {
  imgViewerScale = Math.max(0.5, imgViewerScale - 0.25);
  _applyImgTransform();
}
function imgViewerZoomReset() {
  imgViewerScale = 1;
  imgViewerRotation = 0;
  _applyImgTransform();
}
function imgViewerRotateLeft() {
  imgViewerRotation -= 90;
  _applyImgTransform();
}
function imgViewerRotateRight() {
  imgViewerRotation += 90;
  _applyImgTransform();
}
function _applyImgTransform() {
  const imgEl = document.getElementById('imgviewer-display');
  const zoomStatus = document.getElementById('photos-status-zoom');
  if (imgEl) {
    imgEl.style.transform = `scale(${imgViewerScale}) rotate(${imgViewerRotation}deg)`;
  }
  if (zoomStatus) zoomStatus.textContent = `Zoom: ${Math.round(imgViewerScale * 100)}%`;
}
function toggleImageInfoDrawer() {
  const drawer = document.getElementById('photos-info-drawer');
  const btn = document.getElementById('btn-toggle-img-info');
  if (drawer) drawer.classList.toggle('hidden');
  if (btn) btn.classList.toggle('active', !drawer?.classList.contains('hidden'));
}
function scanCurrentImageInAV() {
  if (gameState.selectedFolderFileId) {
    scanFileInAntivirus(gameState.selectedFolderFileId);
  } else {
    showToast('Photo asset verified clean by ShieldAV.', 'success');
  }
}

// ─── 3. MEDIA / VIDEO PLAYER ────────────────────────────────
function openVideoPlayer(file) {
  const titleText = document.getElementById('videoplayer-title-text');
  if (titleText) titleText.textContent = `Media Player — ${file.name}`;

  const audioStage = document.getElementById('vp-audio-stage');
  if (audioStage) {
    audioStage.classList.remove('vp-audio-playing');
    audioStage.classList.add('hidden');
  }

  const vid = document.getElementById('videoplayer-video');
  if (vid) {
    vid.style.display = 'block';
    vid.src = file.mediaSrc || 'assets/video/video3.mp4';
    vid.currentTime = 0;
    vid.volume = 1;

    // Wire up events once
    if (!vid._vpWired) {
      vid._vpWired = true;
      vid.addEventListener('timeupdate', _vpOnTimeUpdate);
      vid.addEventListener('ended', _vpOnEnded);
      vid.addEventListener('play', () => {
        const btn = document.getElementById('vp-play-btn');
        if (btn) btn.textContent = '⏸';
        document.getElementById('vp-center-overlay')?.classList.add('hidden');
        document.getElementById('vp-audio-stage')?.classList.add('vp-audio-playing');
      });
      vid.addEventListener('pause', () => {
        const btn = document.getElementById('vp-play-btn');
        if (btn) btn.textContent = '▶';
        document.getElementById('vp-center-overlay')?.classList.remove('hidden');
        document.getElementById('vp-audio-stage')?.classList.remove('vp-audio-playing');
      });
    }

    vid.play().catch(() => {});
  }

  openApp('videoplayer');
  focusWindow('videoplayer');
  showToast(`🎬 Playing "${file.name}" in Media Player.`, 'success');
}

// ─── 4. MEDIA / AUDIO PLAYER (MP3 & MUSIC FILES) ────────────
function openAudioPlayer(file) {
  const titleText = document.getElementById('videoplayer-title-text');
  if (titleText) titleText.textContent = `Media Player — ${file.name}`;

  const vid = document.getElementById('videoplayer-video');
  const audioStage = document.getElementById('vp-audio-stage');
  const trackTitle = document.getElementById('vp-audio-track-title');
  const artistName = document.getElementById('vp-audio-artist-name');

  if (audioStage) {
    audioStage.classList.remove('hidden');
  }
  if (trackTitle) trackTitle.textContent = file.name;
  if (artistName) artistName.textContent = file.artist || 'CyberZero Audio Deck • 320 kbps MP3';

  if (vid) {
    vid.style.display = 'none';
    vid.src = file.mediaSrc || 'assets/sounds/Hi - Wii.mp3';
    vid.currentTime = 0;
    vid.volume = 1;

    if (!vid._vpWired) {
      vid._vpWired = true;
      vid.addEventListener('timeupdate', _vpOnTimeUpdate);
      vid.addEventListener('ended', _vpOnEnded);
      vid.addEventListener('play', () => {
        const btn = document.getElementById('vp-play-btn');
        if (btn) btn.textContent = '⏸';
        document.getElementById('vp-center-overlay')?.classList.add('hidden');
        document.getElementById('vp-audio-stage')?.classList.add('vp-audio-playing');
      });
      vid.addEventListener('pause', () => {
        const btn = document.getElementById('vp-play-btn');
        if (btn) btn.textContent = '▶';
        document.getElementById('vp-center-overlay')?.classList.remove('hidden');
        document.getElementById('vp-audio-stage')?.classList.remove('vp-audio-playing');
      });
    }

    vid.play().catch(() => {
      // Autoplay with user gesture
    });
  }

  openApp('videoplayer');
  focusWindow('videoplayer');
  showToast(`🎵 Playing "${file.name}" in Media Player.`, 'success');
}

function vpTogglePlay() {
  const vid = document.getElementById('videoplayer-video');
  if (!vid) return;
  if (vid.paused || vid.ended) {
    vid.play().catch(() => {});
  } else {
    vid.pause();
  }
}

function vpSkip(secs) {
  const vid = document.getElementById('videoplayer-video');
  if (!vid) return;
  vid.currentTime = Math.max(0, Math.min(vid.duration || 0, vid.currentTime + secs));
}

function vpSeek(e) {
  const vid = document.getElementById('videoplayer-video');
  if (!vid || !vid.duration) return;
  const container = document.getElementById('vp-progress-container');
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  vid.currentTime = pct * vid.duration;
}

function _vpOnTimeUpdate() {
  const vid = document.getElementById('videoplayer-video');
  if (!vid) return;
  const cur = vid.currentTime;
  const dur = vid.duration || 0;

  const timeEl = document.getElementById('vp-time-display');
  if (timeEl) timeEl.textContent = `${_avFmtTime(cur)} / ${_avFmtTime(dur)}`;

  const pct = dur > 0 ? (cur / dur) * 100 : 0;
  const fillEl = document.getElementById('vp-progress-fill');
  const thumbEl = document.getElementById('vp-progress-thumb');
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (thumbEl) thumbEl.style.left = `${pct}%`;
}

function _vpOnEnded() {
  const btn = document.getElementById('vp-play-btn');
  if (btn) btn.textContent = '▶';
  document.getElementById('vp-center-overlay')?.classList.remove('hidden');
}

function vpToggleMute() {
  const vid = document.getElementById('videoplayer-video');
  if (!vid) return;
  vid.muted = !vid.muted;
  const btn = document.getElementById('vp-mute-btn');
  if (btn) btn.textContent = vid.muted ? '🔇' : '🔊';
}

function vpSetVolume(val) {
  const vid = document.getElementById('videoplayer-video');
  if (!vid) return;
  vid.volume = parseFloat(val);
  vid.muted = false;
  const btn = document.getElementById('vp-mute-btn');
  if (btn) btn.textContent = vid.volume === 0 ? '🔇' : '🔊';
}

function vpSetSpeed(speed) {
  const vid = document.getElementById('videoplayer-video');
  if (vid) vid.playbackRate = parseFloat(speed);
}

function vpToggleFullscreen() {
  const stage = document.getElementById('vp-stage');
  if (!stage) return;
  if (!document.fullscreenElement) {
    stage.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function scanCurrentVideoInAV() {
  if (gameState.selectedFolderFileId) {
    scanFileInAntivirus(gameState.selectedFolderFileId);
  } else {
    showToast('Video file verified clean by ShieldAV.', 'success');
  }
}

// ─── 4. WINDOWS DEFENDER SMARTSCREEN MODAL ──────────────────
function showSmartScreenWarning(file) {
  smartscreenTargetFile = file;

  const modal = document.getElementById('modal-smartscreen');
  const nameEl = document.getElementById('smartscreen-app-name');
  const fmtEl = document.getElementById('smartscreen-app-format');
  const sigEl = document.getElementById('smartscreen-app-sig');

  if (nameEl) nameEl.textContent = file.name;
  if (fmtEl) fmtEl.textContent = `${file.type} (.${file.realExt})`;
  if (sigEl) sigEl.textContent = file.threatName || 'Unsigned Executable Binary';

  if (modal) modal.classList.remove('hidden');
  if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
}

function closeSmartScreenModal() {
  const modal = document.getElementById('modal-smartscreen');
  if (modal) modal.classList.add('hidden');
  smartscreenTargetFile = null;
}

function smartscreenScan() {
  const file = smartscreenTargetFile;
  closeSmartScreenModal();
  if (file) {
    scanFileInAntivirus(file.id);
  }
}

function smartscreenQuarantine() {
  const file = smartscreenTargetFile;
  closeSmartScreenModal();
  if (file) {
    quarantineFile(file.id);
  }
}


function toggleAntiVirusProtection() {
  gameState.antivirusProtection = !gameState.antivirusProtection;
  updateAntiVirusProtectionUI();
  if (gameState.antivirusProtection) {
    showToast('🛡️ Real-Time Protection ENABLED. Threat scanner active.', 'success');
  } else {
    showToast('⚠️ Real-Time Protection DISABLED. Turn ON to scan files.', 'warning');
  }
}

function updateAntiVirusProtectionUI() {
  const toggleBtn = document.getElementById('av-realtime-toggle');
  const toggleText = document.getElementById('av-toggle-text');
  const banner = document.getElementById('av-status-banner');
  const shieldIcon = document.getElementById('av-shield-icon');
  const title = document.getElementById('av-status-title');
  const sub = document.getElementById('av-status-sub');

  if (gameState.antivirusProtection) {
    if (toggleBtn) toggleBtn.classList.add('active');
    if (toggleText) toggleText.textContent = 'ON';
    if (banner) banner.classList.remove('disabled');
    if (shieldIcon) shieldIcon.textContent = '🛡️';
    if (title) title.textContent = 'DEFENSE ENGINE ACTIVE';
    if (sub) sub.textContent = 'Definitions v2026.09 • Real-Time Protection Online';
  } else {
    if (toggleBtn) toggleBtn.classList.remove('active');
    if (toggleText) toggleText.textContent = 'OFF';
    if (banner) banner.classList.add('disabled');
    if (shieldIcon) shieldIcon.textContent = '⚠️';
    if (title) title.textContent = 'DEFENSE ENGINE DISABLED';
    if (sub) sub.textContent = '⚠️ Real-Time Protection is OFF • Turn ON to scan threats';
  }

  // Synchronize Quick Settings Anti-Virus Tile
  const tileAv = document.getElementById('tile-antivirus');
  const tileAvStatus = document.getElementById('tile-antivirus-status');
  const tileAvBadge = document.getElementById('tile-antivirus-badge');
  if (tileAv) {
    if (gameState.antivirusProtection) {
      tileAv.classList.add('active');
      if (tileAvStatus) tileAvStatus.textContent = 'Real-Time On';
      if (tileAvBadge) tileAvBadge.textContent = 'ON';
    } else {
      tileAv.classList.remove('active');
      if (tileAvStatus) tileAvStatus.textContent = 'Turned Off';
      if (tileAvBadge) tileAvBadge.textContent = 'OFF';
    }
  }
}

let scanInProgress = false;
function startActiveScan() {
  if (scanInProgress) return;
  if (!gameState.antivirusProtection) {
    showToast('⚠️ Anti-Virus Real-Time Protection is OFF! Turn it ON to scan files.', 'warning');
    const toggleBtn = document.getElementById('av-realtime-toggle');
    if (toggleBtn) {
      toggleBtn.classList.add('highlight-pulse');
      setTimeout(() => toggleBtn.classList.remove('highlight-pulse'), 1200);
    }
    return;
  }
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

  if (!gameState.antivirusProtection) {
    showToast('⚠️ Anti-Virus Real-Time Protection is OFF! Turn it ON to quarantine threats.', 'warning');
    const toggleBtn = document.getElementById('av-realtime-toggle');
    if (toggleBtn) {
      toggleBtn.classList.add('highlight-pulse');
      setTimeout(() => toggleBtn.classList.remove('highlight-pulse'), 1200);
    }
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
    if (typeof AudioManager !== 'undefined') AudioManager.playCorrect();

    if (gameState.malwareQuarantined >= TOTAL_MALWARE_COUNT) {
      setTimeout(finishMalwareMission, 1000);
    }
  } else {
    gameState.malwareFalsePositives++;
    gameState.score = Math.max(0, gameState.score - 25);
    updateHUD();
    if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
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

  completeCategory('malware', gameState.score, rank);
  showOverlay('overlay-malware-results');
  if (typeof AudioManager !== 'undefined') AudioManager.playMissionComplete();
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 3: SOCIAL ENGINEERING LAB (PHILLIP)
// ═══════════════════════════════════════════════════════════

const COMMS_ITEMS = [
  {
    id: 'vishing_1',
    type: 'vishing',
    icon: '📞',
    channel: 'Voice Call',
    sender: 'Academy IT Support',
    address: 'Internal Ext 9921',
    time: '2:15 PM',
    subject: 'Emergency Server Migration — Password Verification',
    audioTranscript: '"Hello Phillip, this is Academy IT Support. We are performing an emergency server migration right now. We need you to state your account password and read out the 6-digit MFA code sent to your phone immediately so we can preserve your profile."',
    isSocialEngineering: true,
    threatVector: 'Vishing (Voice Call Impersonation)',
    tactic: 'Fake Authority & Urgent Credential Harvesting',
    explanation: 'Legitimate IT support will NEVER call asking for your password or SMS verification code. Attackers use phone calls to create urgent psychological pressure.',
    resolved: false,
    playerVerdict: null
  },
  {
    id: 'smishing_1',
    type: 'smishing',
    icon: '💬',
    channel: 'SMS Alert',
    sender: 'BPI Security Alerts',
    address: '+63-917-000-8812',
    time: '2:30 PM',
    subject: 'Unusual Sign-in Detected',
    messageText: 'BPI SECURITY ALERT: Unusual sign-in attempt from Cebu. Your mobile banking access will be closed in 15 mins. Reactivate now at https://bpi-mobile-verify.cc/login',
    isSocialEngineering: true,
    threatVector: 'Smishing (SMS Phishing Link)',
    tactic: 'False Urgency & Spoofed Shortcode',
    explanation: 'Banks do not send SMS texts with urgent login links from generic mobile numbers. The link domain (.cc) is deceptive.',
    resolved: false,
    playerVerdict: null
  },
  {
    id: 'impersonate_1',
    type: 'impersonation',
    icon: '👥',
    channel: 'Direct Message',
    sender: 'Nishren (Backup)',
    address: 'nishren.backup@tempmail.io',
    time: '2:45 PM',
    subject: 'Lost Project Files — Send Login',
    messageText: 'Hey Phillip! My PC crashed and I lost our project files. Can you send me your student portal password real quick so I can copy the research slides before class?',
    isSocialEngineering: true,
    threatVector: 'Pretexting & Identity Impersonation',
    tactic: 'Friend Impersonation & Credential Sharing',
    explanation: 'Attackers create fake lookalike accounts of classmates or friends using temporary email services (@tempmail.io) to trick victims into sharing credentials.',
    resolved: false,
    playerVerdict: null
  },
  {
    id: 'legit_comm_1',
    type: 'legitimate',
    icon: '🛡️',
    channel: 'Official Notice',
    sender: 'Cyber Academy Registrar',
    address: '292900 (Verified Shortcode)',
    time: '3:00 PM',
    subject: 'Midterm Submission Schedule',
    messageText: 'Official Notice: The midterm project submission portal opens next Monday at 8:00 AM on the official school portal. No login credentials will ever be requested via SMS.',
    isSocialEngineering: false,
    threatVector: 'Safe Communication',
    tactic: 'Standard Information Broadcast',
    explanation: 'Contains no urgent threats, asks for zero credentials, and includes standard security disclaimers.',
    resolved: false,
    playerVerdict: null
  }
];

let selectedCommId = 'vishing_1';

// ═══════════════════════════════════════════════════════════
// GROUP 4 MISSION ENGINE — Wi-Fi / Social Eng / Malicious Download
// ═══════════════════════════════════════════════════════════

const G4_WIFI_NETWORKS = [
  {
    id: 'coffeeshop_guest',
    name: 'CoffeeShop_Guest',
    security: 'Open',
    signal: 3,
    password: 'None',
    deviceVisibility: 'Available',
    tag: 'Open — No Password',
    tagClass: 'wifi-tag-open',
    risk: 'high',
    note: 'Open network with no encryption. All traffic is visible to anyone on this network.'
  },
  {
    id: 'sjshs_free',
    name: 'SJSHS_FREE_WIFI',
    security: 'Open',
    signal: 4,
    password: 'None',
    deviceVisibility: 'Available',
    tag: 'Open — No Password',
    tagClass: 'wifi-tag-open',
    risk: 'high',
    note: 'School name does not guarantee legitimacy. Anyone can create a network with any name.'
  },
  {
    id: 'coffeeshop_secure',
    name: 'CoffeeShop_Secure',
    security: 'WPA2-Personal',
    signal: 4,
    password: 'Staff-provided',
    deviceVisibility: 'Hidden',
    tag: 'Password Protected',
    tagClass: 'wifi-tag-secure',
    risk: 'low',
    note: 'Password-protected network provided by the establishment. Reduced risk.'
  }
];

const G4_SECURITY_SETTINGS = [
  { id: 'file_sharing', label: 'File Sharing', icon: '📂', state: true, risky: true, hint: 'Allows other devices to access your files over the network.' },
  { id: 'device_discovery', label: 'Device Discovery', icon: '📡', state: true, risky: true, hint: 'Makes your laptop visible to other devices on the network.' },
  { id: 'firewall', label: 'Firewall', icon: '🔥', state: true, risky: false, hint: 'Blocks unauthorized access from the network. Keep this ON.' },
  { id: 'auto_updates', label: 'Automatic Updates', icon: '🔄', state: true, risky: false, hint: 'Keeps your software patched against vulnerabilities. Keep ON.' }
];

const G4_PROCESSES = [
  { pid: '1284', name: 'explorer.exe', cpu: '0.5%', mem: '32 MB', status: 'Running', suspicious: false },
  { pid: '2048', name: 'chrome.exe', cpu: '3.2%', mem: '180 MB', status: 'Running', suspicious: false },
  { pid: '3104', name: 'OneDrive.exe', cpu: '0.1%', mem: '24 MB', status: 'Running', suspicious: false },
  { pid: '4092', name: 'PremiumDesignTool.exe', cpu: '38.7%', mem: '412 MB', status: '⚠️ Suspicious', suspicious: true }
];

const g4State = {
  stage: 0,          // 1-5
  wifiChoice: null,  // network id chosen
  securedLaptop: false,
  fileSharingOff: false,
  deviceDiscoveryOff: false,
  miaAction: null,   // 'reported' | 'sent' | 'ignored'
  fileDecision: null, // 'delete' | 'report' | 'open'
  infectionInvestigated: false,
  wifiDisconnected: false,
  processKilled: false,
  scannerRan: false,
  score: 0
};

let g4ActiveTab = 'messages';
let g4SelectedNetwork = null;
let g4InfectionSymptoms = 0;
let g4InfectionTimer = null;

// ── REAL VIDEO AWARENESS CONTROLLER ──────────────────────────

function _avGetVideo() {
  return document.getElementById('awareness-real-video');
}

function startAwarenessVideo() {
  hideAllOverlays();
  const ov = document.getElementById('overlay-awareness-video');
  if (ov) {
    ov.classList.remove('hidden');
    ov.classList.add('active');
  }

  const vid = _avGetVideo();
  if (!vid) return;

  // Reset finished overlay
  const finEl = document.getElementById('av-finished-overlay');
  if (finEl) finEl.classList.add('hidden');

  // Wire up events once
  if (!vid._avWired) {
    vid._avWired = true;

    vid.addEventListener('timeupdate', _avOnTimeUpdate);
    vid.addEventListener('ended', _avOnEnded);
    vid.addEventListener('play', () => {
      const btn = document.getElementById('av-play-btn');
      if (btn) btn.textContent = '⏸';
    });
    vid.addEventListener('pause', () => {
      const btn = document.getElementById('av-play-btn');
      if (btn) btn.textContent = '▶';
    });
  }

  vid.currentTime = 0;
  vid.volume = 1;
  vid.play().catch(() => {});
}

function _avFmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function _avOnTimeUpdate() {
  const vid = _avGetVideo();
  if (!vid) return;
  const cur = vid.currentTime;
  const dur = vid.duration || 0;

  const timeEl = document.getElementById('av-time');
  if (timeEl) timeEl.textContent = `${_avFmtTime(cur)} / ${_avFmtTime(dur)}`;

  const pct = dur > 0 ? (cur / dur) * 100 : 0;
  const fillEl = document.getElementById('av-progress-fill');
  if (fillEl) fillEl.style.width = `${pct}%`;
  const thumbEl = document.getElementById('av-progress-thumb');
  if (thumbEl) thumbEl.style.left = `${pct}%`;
}

function _avOnEnded() {
  const finEl = document.getElementById('av-finished-overlay');
  if (finEl) finEl.classList.remove('hidden');
  const btn = document.getElementById('av-play-btn');
  if (btn) btn.textContent = '▶';
}

function avTogglePlay() {
  const vid = _avGetVideo();
  if (!vid) return;
  if (vid.paused || vid.ended) { vid.play().catch(() => {}); }
  else { vid.pause(); }
}

function avSeek(e) {
  const vid = _avGetVideo();
  if (!vid || !vid.duration) return;
  const bar = document.getElementById('av-progress-bar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  vid.currentTime = pct * vid.duration;
}

function avToggleMute() {
  const vid = _avGetVideo();
  if (!vid) return;
  vid.muted = !vid.muted;
  const btn = document.getElementById('av-mute-btn');
  if (btn) btn.textContent = vid.muted ? '🔇' : '🔊';
}

function avSetVolume(val) {
  const vid = _avGetVideo();
  if (!vid) return;
  vid.volume = parseFloat(val);
  vid.muted = false;
  const btn = document.getElementById('av-mute-btn');
  if (btn) btn.textContent = vid.volume === 0 ? '🔇' : '🔊';
}

function closeAwarenessVideo() {
  const vid = _avGetVideo();
  if (vid) { vid.pause(); vid.currentTime = 0; }
  const ov = document.getElementById('overlay-awareness-video');
  if (ov) { ov.classList.add('hidden'); ov.classList.remove('active'); }
}

function skipAwarenessVideo() {
  const vid = _avGetVideo();
  if (vid) { vid.pause(); }
  const ov = document.getElementById('overlay-awareness-video');
  if (ov) { ov.classList.add('hidden'); ov.classList.remove('active'); }
  startGroup4Mission();
}

function startSocialEngineeringMission() {
  startGroup4Mission();
}


function startGroup4Mission() {
  // Reset state
  Object.assign(g4State, {
    stage: 1, wifiChoice: null, securedLaptop: false,
    fileSharingOff: false, deviceDiscoveryOff: false,
    miaAction: null, fileDecision: null,
    infectionInvestigated: false, wifiDisconnected: false,
    processKilled: false, scannerRan: false, score: 0
  });
  G4_SECURITY_SETTINGS.forEach(s => { s.state = true; });
  g4InfectionSymptoms = 0;
  if (g4InfectionTimer) { clearInterval(g4InfectionTimer); g4InfectionTimer = null; }

  gameState.phase = 'social_engineering';
  updateDesktopBackgroundForPhase('social_engineering');

  // Show desktop and open Wi-Fi Settings for Stage 1
  hideAllOverlays();
  showToast('📶 Stage 1: Open Wi-Fi Settings and inspect the available networks before connecting.', 'info');
  setTimeout(() => {
    openApp('wifi-settings');
    renderG4WiFiSettings();
    const win = document.getElementById('win-wifi-settings');
    if (win) { win.style.left = '100px'; win.style.top = '60px'; win.style.width = '700px'; win.style.height = '480px'; }
    // Also open Phone app for context
    setTimeout(() => {
      renderPhoneLinkApp();
    }, 400);
  }, 300);
}

// ── STAGE 1: WI-FI SETTINGS ──────────────────────────────────

function renderG4WiFiSettings() {
  const list = document.getElementById('wifi-networks-settings-list');
  const narTip = document.getElementById('wifi-narrator-tip');
  if (narTip) narTip.style.display = 'flex';

  if (!list) return;

  // Always-visible base networks (same as the flyout panel)
  const baseNetworks = `
    <div class="wifi-net-item connected" id="ws-wifi-item-cybernet">
      <div class="wifi-net-icon"><img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:20px;height:20px;"></div>
      <div class="wifi-net-details">
        <div class="wifi-net-name">CYBER-NET (WPA3-Enterprise)</div>
        <div class="wifi-net-meta">Connected, secured • 5.0 GHz • 1200 Mbps</div>
      </div>
      <button class="wifi-net-action-btn disconnect" onclick="toggleCybernetConnect()">Disconnect</button>
    </div>
    <div class="wifi-net-item" onclick="showToast('🔒 HQ-CyberAcademy-Internal requires a Student Key to connect.','info')">
      <div class="wifi-net-icon"><img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:20px;height:20px;"></div>
      <div class="wifi-net-details">
        <div class="wifi-net-name">HQ-CyberAcademy-Internal</div>
        <div class="wifi-net-meta">Secured (802.1X Student Key)</div>
      </div>
      <button class="wifi-net-action-btn connect" onclick="event.stopPropagation();showToast('🔒 Requires Student Key authentication.','info')">Connect</button>
    </div>
    <div class="wifi-net-item" onclick="showToast('🔬 Lab-Investigation-Mesh is a forensic sandbox network.','info')">
      <div class="wifi-net-icon"><img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:20px;height:20px;"></div>
      <div class="wifi-net-details">
        <div class="wifi-net-name">Lab-Investigation-Mesh</div>
        <div class="wifi-net-meta">Secured • Isolated Forensic Sandbox</div>
      </div>
      <button class="wifi-net-action-btn connect" onclick="event.stopPropagation();showToast('🔬 Lab network — forensic use only.','info')">Connect</button>
    </div>
    <div class="wifi-net-item warning-net" onclick="warnPublicWifi()">
      <div class="wifi-net-icon"><img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:20px;height:20px;"></div>
      <div class="wifi-net-details">
        <div class="wifi-net-name">Free_Public_Unsecured</div>
        <div class="wifi-net-meta" style="color:var(--accent-red,#f87171)">⚠️ Open • High Risk of Phishing / MITM!</div>
      </div>
      <button class="wifi-net-action-btn warn-btn" onclick="event.stopPropagation();warnPublicWifi()">Inspect</button>
    </div>
  `;

  // Scenario-specific networks (G4 mission networks) with inspect/connect
  const scenarioNetworks = G4_WIFI_NETWORKS.map(net => `
    <div class="wifi-net-item ${net.risk === 'high' ? 'warning-net' : ''} ${g4SelectedNetwork === net.id ? 'connected' : ''}" onclick="g4SelectNetwork('${net.id}')">
      <div class="wifi-net-icon"><img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:20px;height:20px;"></div>
      <div class="wifi-net-details">
        <div class="wifi-net-name">${net.name}</div>
        <div class="wifi-net-meta" style="${net.risk === 'high' ? 'color:var(--accent-red,#f87171)' : ''}">${net.risk === 'high' ? '⚠️ ' : ''}${net.tag}</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="wifi-net-action-btn ${net.risk === 'high' ? 'warn-btn' : 'connect'}" onclick="event.stopPropagation(); g4InspectNetwork('${net.id}')">🔍 Inspect</button>
        <button class="wifi-net-action-btn connect" onclick="event.stopPropagation(); g4ConnectNetwork('${net.id}')">Connect</button>
      </div>
    </div>
  `).join('');

  list.innerHTML = baseNetworks + scenarioNetworks;
}

function g4SelectNetwork(netId) {
  g4SelectedNetwork = netId;
  renderG4WiFiSettings();
}

function g4InspectNetwork(netId) {
  const net = G4_WIFI_NETWORKS.find(n => n.id === netId);
  if (!net) return;
  g4SelectedNetwork = netId;
  renderG4WiFiSettings();

  const panel = document.getElementById('wifi-props-panel');
  if (!panel) return;
  panel.classList.remove('hidden');

  const signalBars = '●'.repeat(net.signal) + '<span style="opacity:0.25">' + '●'.repeat(4 - net.signal) + '</span>';

  panel.innerHTML = `
    <div class="wifi-props-header">
      <div class="wifi-props-icon">📶</div>
      <div>
        <div class="wifi-props-name">${net.name}</div>
        <div style="font-size:11px;color:var(--text-muted)">Network Properties</div>
      </div>
      <button class="btn-ghost btn-sm" onclick="document.getElementById('wifi-props-panel').classList.add('hidden')">✕ Close</button>
    </div>
    <div class="wifi-props-table">
      <div class="wifi-props-row"><span class="wifi-props-label">Network Name (SSID)</span><span class="wifi-props-val">${net.name}</span></div>
      <div class="wifi-props-row"><span class="wifi-props-label">Security</span><span class="wifi-props-val ${net.security === 'Open' ? 'text-danger' : 'text-safe'}">${net.security}</span></div>
      <div class="wifi-props-row"><span class="wifi-props-label">Password</span><span class="wifi-props-val ${net.password === 'None' ? 'text-danger' : 'text-safe'}">${net.password}</span></div>
      <div class="wifi-props-row"><span class="wifi-props-label">Device Visibility</span><span class="wifi-props-val">${net.deviceVisibility}</span></div>
      <div class="wifi-props-row"><span class="wifi-props-label">Signal Strength</span><span class="wifi-props-val">${signalBars}</span></div>
    </div>
    <div class="wifi-props-note ${net.risk === 'high' ? 'note-warning' : 'note-safe'}">
      ${net.risk === 'high' ? '⚠️' : '✓'} ${net.note}
    </div>
    <div class="wifi-props-actions">
      <button class="btn-ghost btn-sm" onclick="document.getElementById('wifi-props-panel').classList.add('hidden')">Cancel</button>
      <button class="btn-primary btn-sm" onclick="g4ConnectNetwork('${net.id}')">Connect to ${net.name}</button>
    </div>
  `;
}

function g4ConnectNetwork(netId) {
  const net = G4_WIFI_NETWORKS.find(n => n.id === netId);
  if (!net) return;
  g4State.wifiChoice = netId;

  const panel = document.getElementById('wifi-props-panel');
  if (panel) {
    panel.classList.remove('hidden');
    panel.innerHTML = `
      <div style="text-align:center;padding:20px;display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="font-size:32px">📶</div>
        <div style="font-weight:700;color:var(--text-primary)">Connected to ${net.name}</div>
        <div class="g4-status-badge" style="background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);padding:8px 16px;border-radius:8px;font-size:12px;">
          <div>Status: <strong style="color:var(--accent-cyan)">Connected</strong></div>
          <div>Network Type: <strong style="color:${net.risk === 'high' ? 'var(--accent-orange)' : 'var(--accent-green)'}">Public${net.risk === 'high' ? ' (Open)' : ' (Secured)'}</strong></div>
        </div>
        <button class="btn-primary" onclick="g4ProceedToStage2()">Continue → Check Laptop Security</button>
      </div>
    `;
  }

  const wifiIcon = document.getElementById('tray-wifi-icon');
  if (wifiIcon) wifiIcon.innerHTML = `<img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:18px;height:18px;vertical-align:middle;">`;

  if (net.risk === 'high') {
    showToast(`⚠️ Connected to ${net.name} — Open network. Check your security settings!`, 'warning');
  } else {
    showToast(`✓ Connected to ${net.name} — Password-protected network.`, 'success');
  }

  // Update phone signal
  const phoneSignal = document.getElementById('pl-phone-signal');
  if (phoneSignal) phoneSignal.textContent = '📶';
}

function g4ProceedToStage2() {
  g4State.stage = 2;
  closeApp('wifi-settings');
  setTimeout(() => {
    openApp('security-settings');
    renderG4SecuritySettings();
    const win = document.getElementById('win-security-settings');
    if (win) { win.style.left = '120px'; win.style.top = '70px'; win.style.width = '700px'; win.style.height = '480px'; }
    showToast('🛡️ Stage 2: Check your sharing settings. Disable unnecessary exposure on public networks.', 'info');
  }, 300);
}

// ── STAGE 2: SECURITY SETTINGS ───────────────────────────────

function renderG4SecuritySettings() {
  const list = document.getElementById('security-settings-list');
  if (!list) return;

  list.innerHTML = G4_SECURITY_SETTINGS.map(s => `
    <div class="g4-setting-row" id="g4-setting-${s.id}">
      <div class="g4-setting-icon">${s.icon}</div>
      <div class="g4-setting-info">
        <div class="g4-setting-name">${s.label}</div>
        <div class="g4-setting-hint">${s.hint}</div>
      </div>
      <div class="g4-toggle-wrap" onclick="g4ToggleSetting('${s.id}')">
        <div class="g4-toggle ${s.state ? 'on' : 'off'}" id="g4-toggle-${s.id}">
          <div class="g4-toggle-knob"></div>
        </div>
        <span class="g4-toggle-label" id="g4-tlabel-${s.id}">${s.state ? 'ON' : 'OFF'}</span>
      </div>
    </div>
  `).join('');
}

function g4ToggleSetting(settingId) {
  const setting = G4_SECURITY_SETTINGS.find(s => s.id === settingId);
  if (!setting) return;
  setting.state = !setting.state;

  const toggle = document.getElementById(`g4-toggle-${settingId}`);
  const label = document.getElementById(`g4-tlabel-${settingId}`);
  if (toggle) { toggle.classList.toggle('on', setting.state); toggle.classList.toggle('off', !setting.state); }
  if (label) label.textContent = setting.state ? 'ON' : 'OFF';

  // Track risky settings
  if (settingId === 'file_sharing') g4State.fileSharingOff = !setting.state;
  if (settingId === 'device_discovery') g4State.deviceDiscoveryOff = !setting.state;

  if (typeof AudioManager !== 'undefined') AudioManager.playClickSound();

  // Show feedback when both risky ones are disabled
  const bothDisabled = g4State.fileSharingOff && g4State.deviceDiscoveryOff;
  const feedback = document.getElementById('sec-feedback');
  const stageNav = document.getElementById('sec-stage-nav');

  if (bothDisabled && !g4State.securedLaptop) {
    g4State.securedLaptop = true;
    g4State.score += 100;
    if (feedback) {
      feedback.classList.remove('hidden');
      feedback.innerHTML = `
        <div class="g4-success-box">
          <span style="font-size:20px">✅</span>
          <div>
            <div style="font-weight:700;color:var(--accent-green)">Security Action Completed</div>
            <div style="font-size:12px;color:var(--text-secondary)">File Sharing and Device Discovery are now OFF. Device Protected. (+100 pts)</div>
          </div>
        </div>
      `;
    }
    if (stageNav) stageNav.style.display = 'flex';
    showToast('✅ Laptop secured! File Sharing and Device Discovery disabled.', 'success');
  } else if (!bothDisabled && stageNav) {
    stageNav.style.display = 'none';
    if (feedback) {
      feedback.classList.remove('hidden');
      feedback.innerHTML = `<div class="g4-warning-box">⚠️ Some risky settings are still enabled. Disable File Sharing and Device Discovery to protect your laptop on a public network.</div>`;
    }
  }
}

function group4NextStage() {
  g4ProceedToStage3();
}

function g4ProceedToStage3() {
  g4State.stage = 3;
  closeApp('security-settings');
  showToast('💬 Stage 3: You received a new chat message. Open Phone Link to investigate.', 'info');
  setTimeout(() => {
    openApp('comms');
    renderPhoneLinkApp();
    const win = document.getElementById('win-comms');
    if (win) { win.style.left = '90px'; win.style.top = '50px'; win.style.width = '720px'; win.style.height = '500px'; }
    // Show Mia chat notification
    setTimeout(() => {
      showToast('📱 New message from "Mia — New Account". Open Phone Link to investigate.', 'warning');
      const badge = document.getElementById('pl-notif-badge');
      if (badge) badge.classList.remove('hidden');
    }, 600);
  }, 300);
}

// ── PHONELINK APP ─────────────────────────────────────────────

const G4_CONTACTS = [
  { id: 'mia_fake', name: 'Mia — New Account', avatar: '👤', joined: 'Today', type: 'suspicious', isGroup4: true },
  { id: 'carlo', name: 'Carlo', avatar: '👦', joined: '2 years ago', type: 'known', isGroup4: true },
  { id: 'group4', name: 'Group 4 Chat', avatar: '👥', joined: '1 year ago', type: 'group', isGroup4: true },
  { id: 'real_mia', name: 'Mia (Verified)', avatar: '👧', joined: '1 year ago', type: 'known', isGroup4: true }
];

const G4_MESSAGES = {
  mia_fake: [
    { from: 'them', text: 'Hey, can you send me your student number and birthday? I need them to recover our project account. Please hurry.', time: '2:47 PM', urgent: true }
  ],
  carlo: [
    { from: 'them', text: 'I found a free premium design tool. Download this so we can finish the presentation faster.', time: '3:05 PM', link: 'canva-premium-free.example' }
  ],
  group4: [
    { from: 'them', sender: 'Mia', text: "That's not me. Don't send anything.", time: '2:49 PM', verified: true },
    { from: 'them', sender: 'Carlo', text: 'What happened? Is everything ok?', time: '2:50 PM' }
  ],
  real_mia: [
    { from: 'them', text: "Hey! Did someone contact you pretending to be me? That account isn't mine.", time: '2:48 PM', verified: true }
  ]
};

let g4ActiveConvo = null;
let g4MiaInspected = false;
let g4GroupChecked = false;

function renderPhoneLinkApp() {
  renderPhoneFrame();
  switchPhoneTab('messages');
}

function renderPhoneFrame() {
  const timeEl = document.getElementById('pl-phone-time');
  if (timeEl) {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

function switchPhoneTab(tab) {
  g4ActiveTab = tab;
  const tabs = document.querySelectorAll('.pl-tab');
  tabs.forEach(t => {
    const id = t.id.replace('pl-tab-', '');
    t.classList.toggle('active', id === tab);
  });

  const content = document.getElementById('pl-tab-content');
  if (!content) return;

  if (tab === 'messages') {
    renderPhoneMessages(content);
  } else if (tab === 'calls') {
    content.innerHTML = `
      <div class="pl-empty-state">
        <div class="pl-empty-state-icon">📞</div>
        <div class="pl-empty-state-title">No recent calls</div>
        <div class="pl-empty-state-sub">Recent phone and audio calls will appear here.</div>
      </div>
    `;
  } else if (tab === 'contacts') {
    renderPhoneContacts(content);
  }
}

function renderPhoneMessages(container) {
  const unreadCount = g4State.stage >= 3 ? (g4State.miaAction ? 0 : 2) : 0;
  const badge = document.getElementById('pl-msg-badge');
  if (badge) badge.textContent = unreadCount > 0 ? unreadCount : '';

  const convos = [
    { id: 'mia_fake', name: 'Mia — New Account', preview: 'Hey, can you send me your student...', time: '2:47 PM', unread: g4State.stage >= 3 && !g4State.miaAction, suspicious: true, showIf: g4State.stage >= 3 },
    { id: 'carlo', name: 'Carlo', preview: 'I found a free premium design tool...', time: '3:05 PM', unread: g4State.stage >= 4 && !g4State.fileDecision, showIf: g4State.stage >= 4 },
    { id: 'group4', name: 'Group 4 Chat', preview: 'Mia: That\'s not me. Don\'t send...', time: '2:49 PM', showIf: true },
    { id: 'real_mia', name: 'Mia (Verified)', preview: 'Did someone contact you pretending...', time: '2:48 PM', showIf: g4State.stage >= 3 }
  ].filter(c => c.showIf);

  container.innerHTML = `
    <div class="pl-msg-list">
      ${convos.map(c => `
        <div class="pl-msg-row ${c.unread ? 'unread' : ''} ${c.suspicious ? 'suspicious' : ''} ${g4ActiveConvo === c.id ? 'active' : ''}" onclick="openPhoneConversation('${c.id}')">
          <div class="pl-msg-avatar">${c.suspicious ? '⚠️' : G4_CONTACTS.find(x => x.id === c.id)?.avatar || '👤'}</div>
          <div class="pl-msg-info">
            <div class="pl-msg-name">${c.name}${c.suspicious ? ' <span class="pl-suspicious-tag">New Account</span>' : ''}</div>
            <div class="pl-msg-preview">${c.preview}</div>
          </div>
          <div class="pl-msg-meta">
            <div class="pl-msg-time">${c.time}</div>
            ${c.unread ? '<div class="pl-unread-dot"></div>' : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Also update phone screen preview
  const phoneContent = document.getElementById('pl-phone-content');
  if (phoneContent) {
    phoneContent.innerHTML = `
      <div style="padding:8px;display:flex;flex-direction:column;gap:6px;">
        ${convos.slice(0, 3).map(c => `
          <div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;font-size:10px;display:flex;align-items:center;gap:6px;border:1px solid ${c.suspicious ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.1)'};">
            <span style="font-size:14px">${c.suspicious ? '⚠️' : '💬'}</span>
            <div style="min-width:0;flex:1;">
              <div style="font-weight:800;color:${c.suspicious ? '#fbbf24' : '#f8fafc'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(c.name.slice(0, 16))}</div>
              <div style="color:#cbd5e1;font-size:9.5px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(c.preview.slice(0, 22))}...</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

function renderPhoneContacts(container) {
  container.innerHTML = `
    <div class="pl-contacts-list">
      ${G4_CONTACTS.map(c => `
        <div class="pl-contact-row" onclick="openPhoneConversation('${c.id}')">
          <div class="pl-contact-avatar ${c.type === 'suspicious' ? 'avatar-suspicious' : ''}">${c.avatar}</div>
          <div class="pl-contact-info">
            <div class="pl-contact-name">${c.name}</div>
            <div class="pl-contact-meta">Member since: ${c.joined} ${c.type === 'suspicious' ? '• <span style="color:var(--accent-orange)">⚠️ New Account</span>' : ''}</div>
          </div>
          ${c.type === 'suspicious' ? '<span style="font-size:10px;color:var(--accent-orange);font-weight:700;padding:3px 6px;border:1px solid currentColor;border-radius:4px">INSPECT</span>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function openPhoneConversation(contactId) {
  g4ActiveConvo = contactId;
  switchPhoneTab('messages');

  const content = document.getElementById('pl-tab-content');
  if (!content) return;

  const msgs = G4_MESSAGES[contactId] || [];
  const contact = G4_CONTACTS.find(c => c.id === contactId);

  // Track investigation
  if (contactId === 'mia_fake') g4MiaInspected = true;
  if (contactId === 'group4' || contactId === 'real_mia') g4GroupChecked = true;

  const actionHtml = buildPhoneActionHtml(contactId);

  content.innerHTML = `
    <div class="pl-convo-view">
      <div class="pl-convo-header">
        <button class="pl-back-btn" onclick="switchPhoneTab('messages')">← Back</button>
        <div class="pl-convo-name">${contact?.name || contactId}</div>
        <button class="pl-inspect-btn" onclick="g4InspectProfile('${contactId}')">🔍 Inspect Profile</button>
      </div>
      <div class="pl-convo-messages">
        ${msgs.map(m => `
          <div class="pl-msg-bubble ${m.from === 'me' ? 'mine' : 'theirs'}">
            ${m.sender ? `<div class="pl-msg-sender">${m.sender}</div>` : ''}
            <div class="pl-msg-text ${m.urgent ? 'urgent-msg' : ''} ${m.verified ? 'verified-msg' : ''}">
              ${m.text}
              ${m.link ? `<div class="pl-msg-link" onclick="g4OpenCarloLink()">🔗 ${m.link} <span style="color:var(--accent-cyan);font-size:10px">→ Open</span></div>` : ''}
            </div>
            <div class="pl-msg-time">${m.time} ${m.verified ? '✓ Verified' : ''}</div>
          </div>
        `).join('')}
      </div>
      ${actionHtml}
    </div>
  `;
}

function buildPhoneActionHtml(contactId) {
  if (contactId === 'mia_fake' && !g4State.miaAction) {
    return `
      <div class="pl-action-bar">
        <div class="pl-action-header">🎙️ <em>"A familiar name does not guarantee a legitimate request. Verify through another trusted method."</em></div>
        <div class="pl-action-btns">
          <button class="pl-action-btn pl-btn-danger" onclick="g4MiaDecision('sent')">📤 Send Info (Student ID + Birthday)</button>
          <button class="pl-action-btn pl-btn-report" onclick="g4MiaDecision('reported')">🚩 Stop & Report Account</button>
          <button class="pl-action-btn pl-btn-ghost" onclick="g4MiaDecision('ignored')">🚫 Ignore & Warn Group</button>
        </div>
      </div>
    `;
  } else if (contactId === 'carlo' && !g4State.fileDecision) {
    return `
      <div class="pl-action-bar">
        <button class="pl-action-btn pl-btn-primary" onclick="g4OpenCarloLink()">🌐 Open Browser to Investigate</button>
      </div>
    `;
  }
  return '';
}

function g4InspectProfile(contactId) {
  if (contactId !== 'mia_fake') {
    showToast(`ℹ️ ${G4_CONTACTS.find(c => c.id === contactId)?.name}: Known contact. Account verified.`, 'info');
    return;
  }
  showToast('⚠️ Profile "Mia — New Account" was created TODAY. Different from the real Mia\'s account. Investigate further!', 'warning');
  g4MiaInspected = true;
}

function g4MiaDecision(action) {
  g4State.miaAction = action;
  const badge = document.getElementById('pl-notif-badge');
  if (badge) badge.classList.add('hidden');

  if (action === 'reported') {
    g4State.score += 100;
    showToast('✅ Threat Identified: Social Engineering. Personal Information Protected. (+100 pts)', 'success');
    openPhoneConversation('mia_fake');
    setTimeout(() => g4ProceedToStage4(), 1500);
  } else if (action === 'ignored') {
    g4State.score += 50;
    showToast('⚠️ Smart to ignore — but reporting would help protect others too. (+50 pts)', 'info');
    openPhoneConversation('mia_fake');
    setTimeout(() => g4ProceedToStage4(), 1500);
  } else if (action === 'sent') {
    showToast('⚠️ You shared personal information! This was a social engineering attack. Be cautious next time.', 'warning');
    openPhoneConversation('mia_fake');
    setTimeout(() => g4ProceedToStage4(), 1500);
  }
}

function g4ProceedToStage4() {
  g4State.stage = 4;
  showToast('⬇️ Stage 4: Carlo sent a download link. Open Browser to investigate the file.', 'info');
  // Show Carlo message
  setTimeout(() => {
    openPhoneConversation('carlo');
  }, 500);
}

function g4OpenCarloLink() {
  openApp('browser');
  const win = document.getElementById('win-browser');
  if (win) { win.style.left = '160px'; win.style.top = '80px'; }
  setTimeout(() => {
    browserGo('canva-premium-free.example');
    renderG4MaliciousSite();
  }, 300);
}

// ── STAGE 4: MALICIOUS DOWNLOAD ───────────────────────────────

function renderG4MaliciousSite() {
  const contentEl = document.getElementById('browser-content');
  if (!contentEl) return;

  const urlBar = document.getElementById('browser-url-input');
  if (urlBar) urlBar.value = 'http://canva-premium-free.example/download';

  const secIndicator = document.getElementById('browser-security');
  if (secIndicator) {
    secIndicator.textContent = '⚠️ Not Secure';
    secIndicator.style.color = 'var(--accent-red)';
  }

  contentEl.innerHTML = `
    <div class="g4-malsite-wrap">
      <div class="g4-malsite-header">
        <div class="g4-malsite-logo">Canva<span style="color:#ff5252">-premium</span>-free</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px">⚠️ Unofficial — Not affiliated with Canva</div>
      </div>
      <div class="g4-malsite-hero">
        <div class="g4-malsite-title">FREE PREMIUM DESIGN TOOL</div>
        <div class="g4-malsite-bullets">
          <div>✓ Premium Features — FREE</div>
          <div>✓ No Registration Required!</div>
          <div>✓ Unlimited Templates &amp; Exports</div>
        </div>
        <button class="g4-download-btn" onclick="g4TriggerDownload()">⬇ DOWNLOAD NOW</button>
        <div class="g4-malsite-counter">Downloaded by 4,892 users today!</div>
      </div>

      <!-- Narrator practice tip -->
      <div class="g4-narrator-tip" style="max-width:600px;margin:16px auto 0;">
        <span class="g4-narrator-icon">🎙️</span>
        <p>"A useful-looking file can still be unsafe. Check the source, file type, and publisher before opening it."</p>
      </div>
    </div>
  `;
}

function g4TriggerDownload() {
  const contentEl = document.getElementById('browser-content');
  if (!contentEl) return;

  contentEl.innerHTML += `
    <div class="g4-download-complete" id="g4-download-complete">
      <div style="font-size:16px;font-weight:700;color:var(--text-primary)">⬇️ Download Complete</div>
      <div class="g4-file-props">
        <div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px">📄 File Properties — Inspection Required</div>
        <table class="g4-props-table">
          <tr><td class="g4-prop-label">File Name</td><td class="g4-prop-val">PremiumDesignTool.exe</td></tr>
          <tr><td class="g4-prop-label">File Type</td><td class="g4-prop-val" style="color:var(--accent-orange)">Application (.exe) ⚠️</td></tr>
          <tr><td class="g4-prop-label">Publisher</td><td class="g4-prop-val" style="color:var(--accent-red)">Unknown ⚠️</td></tr>
          <tr><td class="g4-prop-label">Source</td><td class="g4-prop-val" style="color:var(--accent-red)">Unverified — canva-premium-free.example</td></tr>
          <tr><td class="g4-prop-label">Size</td><td class="g4-prop-val">3.4 MB</td></tr>
          <tr><td class="g4-prop-label">SHA-256</td><td class="g4-prop-val" style="font-family:var(--font-mono);font-size:11px">f7e4b2c1a0d8e9f3...</td></tr>
        </table>
      </div>
      <div class="g4-file-decision-btns">
        <button class="btn-success btn-sm" onclick="g4FileDecision('delete')">🗑️ Delete File</button>
        <button class="btn-ghost btn-sm" onclick="g4FileDecision('report')">🚩 Report File</button>
        <button class="btn-danger btn-sm" onclick="g4FileDecision('open')">▶ Open File</button>
      </div>
    </div>
  `;
}

function g4FileDecision(decision) {
  g4State.fileDecision = decision;

  if (decision === 'delete') {
    g4State.score += 100;
    showToast('✅ Correct! Deleted unknown .exe from unverified source. (+100 pts)', 'success');
    setTimeout(() => g4ShowConsequences(), 1200);
  } else if (decision === 'report') {
    g4State.score += 75;
    showToast('✅ Good decision! Reported the suspicious file. (+75 pts)', 'success');
    setTimeout(() => g4ShowConsequences(), 1200);
  } else if (decision === 'open') {
    showToast('⚠️ You opened an unknown .exe! Watch what happens next...', 'warning');
    setTimeout(() => g4StartInfection(), 1000);
  }
}

// ── STAGE 5: INFECTION SIMULATION ─────────────────────────────

const G4_SYMPTOMS = [
  { icon: '📁', text: 'Project Folder is responding slowly...', delay: 800 },
  { icon: '⚙️', text: 'Unknown process "PremiumDesignTool.exe" is running at high CPU...', delay: 2000 },
  { icon: '🌐', text: 'Browser opened unexpected tab: "ads.malware-domain.ru"', delay: 3500 },
  { icon: '🔒', text: 'Project files are becoming difficult to access...', delay: 5000 }
];

function g4StartInfection() {
  g4State.stage = 5;
  const contentEl = document.getElementById('browser-content');
  if (contentEl) {
    contentEl.innerHTML = `
      <div class="g4-infection-wrap" id="g4-infection-wrap">
        <div class="g4-infection-header">
          <div class="g4-infection-alert">⚠️ UNKNOWN APPLICATION RUNNING...</div>
          <div class="g4-narrator-box">🎙️ "Something isn't behaving normally."</div>
        </div>
        <div class="g4-symptom-list" id="g4-symptom-list"></div>
        <div class="g4-investigation-tools hidden" id="g4-investigation-tools">
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:10px;">🔧 Investigation Tools</div>
          <div class="g4-tools-grid">
            <button class="g4-tool-btn" onclick="openApp('taskmanager'); renderG4TaskManager()">📊 Task Manager</button>
            <button class="g4-tool-btn" onclick="g4CheckDownloads()">📁 Downloads</button>
            <button class="g4-tool-btn" onclick="g4CheckProjectFolder()">📂 Project Folder</button>
            <button class="g4-tool-btn" onclick="g4DisconnectWifi()">📶 Disconnect Wi-Fi</button>
            <button class="g4-tool-btn" onclick="openApp('scanner'); renderG4Scanner()">🔍 Security Scanner</button>
          </div>
        </div>
      </div>
    `;
  }

  // Apply visual glitch effect
  document.body.classList.add('g4-infected');

  // Reveal symptoms one by one
  let shown = 0;
  G4_SYMPTOMS.forEach((s, i) => {
    setTimeout(() => {
      const list = document.getElementById('g4-symptom-list');
      if (list) {
        const div = document.createElement('div');
        div.className = 'g4-symptom-row';
        div.innerHTML = `<span class="g4-sym-icon">${s.icon}</span><span>${s.text}</span>`;
        div.style.animation = 'g4-sym-appear 400ms ease';
        list.appendChild(div);
        shown++;
        if (shown === G4_SYMPTOMS.length) {
          setTimeout(() => {
            const tools = document.getElementById('g4-investigation-tools');
            if (tools) tools.classList.remove('hidden');
          }, 600);
        }
      }
    }, s.delay);
  });
}

function renderG4TaskManager() {
  const list = document.getElementById('tm-process-list');
  if (!list) return;

  list.innerHTML = G4_PROCESSES.map(p => `
    <div class="tm-process-row ${p.suspicious ? 'suspicious-process' : ''}">
      <span class="tm-col-name">${p.suspicious ? '⚠️ ' : ''}${p.name}</span>
      <span class="tm-col-cpu ${p.suspicious ? 'text-danger' : ''}">${p.cpu}</span>
      <span class="tm-col-mem">${p.mem}</span>
      <span class="tm-col-status">${p.status}</span>
      ${p.suspicious ? `<button class="btn-danger btn-sm" onclick="g4KillProcess('${p.pid}')">End Task</button>` : '<span style="width:80px"></span>'}
    </div>
  `).join('');
}

function g4KillProcess(pid) {
  g4State.processKilled = true;
  g4State.infectionInvestigated = true;
  g4State.score += 75;
  showToast('✅ Suspicious process terminated! (+75 pts)', 'success');
  const list = document.getElementById('tm-process-list');
  if (list) {
    renderG4TaskManager();
    const rows = list.querySelectorAll('.suspicious-process');
    rows.forEach(r => { r.style.opacity = '0.3'; r.style.textDecoration = 'line-through'; });
    setTimeout(() => {
      list.innerHTML = list.innerHTML.replace('suspicious-process', '') + `<div style="padding:8px;color:var(--accent-green);font-size:12px">✓ PremiumDesignTool.exe (PID 4092) terminated.</div>`;
    }, 400);
  }
  g4CheckAllInfectionSteps();
}

function g4CheckDownloads() {
  g4State.infectionInvestigated = true;
  showToast('📁 Downloads folder: Found "PremiumDesignTool.exe" — source: canva-premium-free.example (Unverified)', 'warning');
}

function g4CheckProjectFolder() {
  showToast('📂 Project Folder: Files responding slowly. 2 files show access errors. Disconnect network to limit damage.', 'warning');
}

function g4DisconnectWifi() {
  g4State.wifiDisconnected = true;
  g4State.score += 50;
  showToast('📶 Wi-Fi disconnected. Network communication limited. (+50 pts)', 'success');

  // Update tray icon
  const wifiIcon = document.getElementById('tray-wifi-icon');
  if (wifiIcon) wifiIcon.innerHTML = `<img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:18px;height:18px;vertical-align:middle;opacity:0.4;filter:grayscale(1)">`;

  showToast('🎙️ "Disconnecting the laptop can help limit further network communication while the incident is investigated."', 'info');
  g4CheckAllInfectionSteps();
}

function renderG4Scanner() {
  const title = document.getElementById('scanner-title');
  const sub = document.getElementById('scanner-sub');
  if (title) title.textContent = 'Security Scanner — Threat Analysis';
  if (sub) sub.textContent = g4State.fileDecision === 'open' ? '⚠️ Suspicious activity detected. Run a full scan.' : 'No active threat. Run scan to verify.';
}

function runSecurityScan() {
  const btn = document.getElementById('scanner-run-btn');
  const progress = document.getElementById('scanner-progress');
  const fill = document.getElementById('scanner-progress-fill');
  const text = document.getElementById('scanner-progress-text');
  const pct = document.getElementById('scanner-progress-pct');
  const results = document.getElementById('scanner-results');

  if (btn) btn.disabled = true;
  if (progress) progress.classList.remove('hidden');
  if (results) results.innerHTML = '';

  let p = 0;
  const scanSteps = ['Checking startup programs...', 'Scanning running processes...', 'Inspecting downloaded files...', 'Analyzing network connections...'];
  const interval = setInterval(() => {
    p += 4;
    if (fill) fill.style.width = p + '%';
    if (pct) pct.textContent = p + '%';
    if (text) text.textContent = scanSteps[Math.floor(p / 25)] || 'Finalizing scan...';
    if (p >= 100) {
      clearInterval(interval);
      g4State.scannerRan = true;
      g4State.score += 50;
      if (progress) progress.classList.add('hidden');
      if (results) {
        results.innerHTML = g4State.fileDecision === 'open' ? `
          <div class="scanner-threat-found">
            <div style="font-weight:700;color:var(--accent-red)">⚠️ THREAT DETECTED</div>
            <div class="scanner-threat-item">
              <strong>PremiumDesignTool.exe</strong><br>
              Threat: Trojan.Downloader.Unknown<br>
              Action: <button class="btn-danger btn-sm" onclick="g4ScannerQuarantine()">Quarantine</button>
            </div>
          </div>
        ` : `<div class="scanner-clean"><span>✅</span> No threats found. Device appears clean.</div>`;
      }
      g4CheckAllInfectionSteps();
    }
  }, 60);
}

function g4ScannerQuarantine() {
  g4State.score += 50;
  showToast('✅ Threat quarantined by Security Scanner! (+50 pts)', 'success');
  const results = document.getElementById('scanner-results');
  if (results) results.innerHTML = `<div class="scanner-clean">🛡️ Threat quarantined. File removed from system.</div>`;
  document.body.classList.remove('g4-infected');
  g4CheckAllInfectionSteps();
}

function g4CheckAllInfectionSteps() {
  const allDone = g4State.wifiDisconnected || g4State.scannerRan || g4State.processKilled;
  if (allDone && g4State.fileDecision === 'open') {
    setTimeout(() => {
      showToast('🔍 Investigation complete. Proceeding to results...', 'info');
      setTimeout(() => g4ShowConsequences(), 2000);
    }, 1000);
  }
}

// ── CONSEQUENCES & RESULTS ─────────────────────────────────────

function g4ShowConsequences() {
  document.body.classList.remove('g4-infected');
  if (g4InfectionTimer) { clearInterval(g4InfectionTimer); g4InfectionTimer = null; }

  // Compute result tier
  const saferDecisions = [
    !!g4State.wifiChoice, // connected (any)
    g4State.securedLaptop,
    g4State.miaAction === 'reported' || g4State.miaAction === 'ignored',
    g4State.fileDecision === 'delete' || g4State.fileDecision === 'report'
  ];
  const saferCount = saferDecisions.filter(Boolean).length;
  const isSaferPath = saferCount >= 3;

  const rank = isSaferPath ? (g4State.score >= 300 ? 'S' : 'A') : 'B';
  completeCategory('social_engineering', g4State.score, rank);

  const overlay = document.getElementById('overlay-social-results');
  if (overlay) {
    // Update results content
    const blockedEl = document.getElementById('res-social-blocked');
    const scoreEl = document.getElementById('res-social-score');
    const rankEl = document.getElementById('social-results-rank');
    const labelEl = document.getElementById('social-results-rank-label');

    if (blockedEl) blockedEl.textContent = `${saferCount} / 4 Safer Decisions`;
    if (scoreEl) scoreEl.textContent = g4State.score;
    if (rankEl) rankEl.textContent = rank;
    if (labelEl) labelEl.textContent = isSaferPath ? 'CYBER AWARE INVESTIGATOR' : 'LEARNING SECURITY BASICS';

    // Inject consequence summary into overlay
    const card = overlay.querySelector('.results-card');
    if (card) {
      const existing = card.querySelector('.g4-consequence-card');
      if (existing) existing.remove();

      const conseq = document.createElement('div');
      conseq.className = 'g4-consequence-card';
      conseq.innerHTML = isSaferPath ? `
        <div class="g4-conseq-safer">
          <div class="g4-conseq-title">✅ Project Progress Maintained</div>
          <div class="g4-conseq-body">Threats identified and handled. Project files secure. Good investigation!</div>
          <div class="g4-conseq-steps">
            ${g4State.wifiChoice ? '✓ Verified network before connecting' : '✗ Chose a network'}<br>
            ${g4State.securedLaptop ? '✓ Secured laptop settings' : '✗ Left sharing enabled'}<br>
            ${g4State.miaAction !== 'sent' ? '✓ Verified Mia\'s identity' : '✗ Sent personal information'}<br>
            ${g4State.fileDecision !== 'open' ? '✓ Rejected unknown file' : '✗ Opened unknown file'}
          </div>
        </div>
      ` : `
        <div class="g4-conseq-risky">
          <div class="g4-conseq-title">⚠️ Security Risk Increased</div>
          <div class="g4-conseq-body">Some decisions increased exposure. Laptop potentially compromised. Project files affected.</div>
          <div class="g4-conseq-steps">
            ${g4State.securedLaptop ? '✓ Secured laptop settings' : '✗ Left File Sharing / Discovery enabled'}<br>
            ${g4State.miaAction !== 'sent' ? '✓ Protected personal information' : '✗ Shared student ID and birthday'}<br>
            ${g4State.fileDecision !== 'open' ? '✓ Handled unknown file safely' : '✗ Opened unknown .exe — Infection triggered'}
          </div>
        </div>
      `;
      card.insertBefore(conseq, card.querySelector('.results-actions') || card.lastChild);
    }

    showOverlay('overlay-social-results');
    if (typeof AudioManager !== 'undefined') AudioManager.playMissionComplete();
  }
}


function renderCommsFeed() {
  const listEl = document.getElementById('comms-msg-list');
  if (!listEl) return;

  const resolvedCount = COMMS_ITEMS.filter(c => c.resolved).length;
  const badgeEl = document.getElementById('comms-badge-count');
  const filterBadge = document.getElementById('comms-filter-badge');
  if (badgeEl) badgeEl.textContent = 4 - resolvedCount;
  if (filterBadge) filterBadge.textContent = `${resolvedCount} / 4 Resolved`;

  listEl.innerHTML = COMMS_ITEMS.map(item => {
    const isActive = item.id === selectedCommId;
    let statusPill = '<span class="comm-status-pill comm-pill-pending">⏳ Pending</span>';
    if (item.resolved) {
      statusPill = item.playerVerdict === 'flagged'
        ? '<span class="comm-status-pill comm-pill-blocked">🚩 Blocked (Threat)</span>'
        : '<span class="comm-status-pill comm-pill-safe">✓ Verified Safe</span>';
    }

    const preview = item.audioTranscript || item.messageText || item.subject;

    return `
      <div class="comm-item-row ${isActive ? 'active' : ''} ${item.resolved ? 'resolved' : ''}" onclick="selectCommItem('${item.id}')">
        <div class="comm-item-icon">${item.icon}</div>
        <div class="comm-item-content">
          <div class="comm-item-top">
            <span class="comm-item-sender">${item.sender}</span>
            <span class="comm-item-time">${item.time}</span>
          </div>
          <div class="comm-item-preview">${preview}</div>
          ${statusPill}
        </div>
      </div>
    `;
  }).join('');
}

function selectCommItem(commId) {
  selectedCommId = commId;
  renderCommsFeed();

  const item = COMMS_ITEMS.find(c => c.id === commId);
  const emptyState = document.getElementById('comms-empty-state');
  const detailView = document.getElementById('comms-detail-view');

  if (!item || !detailView) return;
  if (emptyState) emptyState.classList.add('hidden');
  detailView.classList.remove('hidden');

  let bodyContent = '';
  if (item.type === 'vishing') {
    bodyContent = `
      <div class="comm-audio-box">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:12px;font-weight:700;color:#ea80fc">🎙️ VOICE CALL RECORDING • DURATION: 0:42</span>
          <span style="font-size:11px;color:var(--text-muted)">AUDIO PLAYBACK</span>
        </div>
        <div class="comm-audio-wave">
          <span class="comm-audio-bar"></span>
          <span class="comm-audio-bar"></span>
          <span class="comm-audio-bar"></span>
          <span class="comm-audio-bar"></span>
          <span class="comm-audio-bar"></span>
          <span class="comm-audio-bar"></span>
          <span class="comm-audio-bar"></span>
          <span class="comm-audio-bar"></span>
        </div>
        <div class="comm-transcript-box">
          <strong>Automated Transcript:</strong><br>${item.audioTranscript}
        </div>
      </div>
    `;
  } else {
    bodyContent = `
      <div class="comm-sms-bubble">
        <strong>${item.channel}:</strong><br>
        ${item.messageText}
      </div>
    `;
  }

  let actionHtml = '';
  if (!item.resolved) {
    actionHtml = `
      <div class="comm-actions-bar">
        <button class="comm-btn-flag" onclick="flagCommItem('${item.id}', true)">
          🚩 FLAG AS SOCIAL ENGINEERING ATTACK (+100)
        </button>
        <button class="comm-btn-safe" onclick="flagCommItem('${item.id}', false)">
          ✓ VERIFY AS SAFE COMMUNICATION (+50)
        </button>
      </div>
    `;
  } else {
    actionHtml = `
      <div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;border:1px solid ${item.isSocialEngineering ? 'rgba(255,82,82,0.3)' : 'rgba(0,230,118,0.3)'};font-size:12px">
        <strong style="color:${item.isSocialEngineering ? '#ff5252' : '#00e676'}">${item.isSocialEngineering ? '⚠️ Threat Analysis Verdict:' : '✓ Safe Verification Verdict:'}</strong>
        <p style="margin:4px 0 0;color:#b0bec5">${item.explanation}</p>
      </div>
    `;
  }

  detailView.innerHTML = `
    <div class="comm-header-card">
      <div class="comm-header-badge">${item.channel} • INTERCEPT ID: ${item.id.toUpperCase()}</div>
      <div class="comm-header-title">${item.subject}</div>
      <div class="comm-meta-grid">
        <div><span>FROM:</span> <strong>${item.sender}</strong></div>
        <div><span>ADDRESS:</span> <strong>${item.address}</strong></div>
        <div><span>TIME:</span> <strong>${item.time}</strong></div>
        <div><span>TACTIC:</span> <strong>${item.tactic}</strong></div>
      </div>
    </div>

    ${bodyContent}
    ${actionHtml}
  `;
}

function flagCommItem(commId, playerFlaggedThreat) {
  const item = COMMS_ITEMS.find(c => c.id === commId);
  if (!item || item.resolved) return;

  item.resolved = true;
  item.playerVerdict = playerFlaggedThreat ? 'flagged' : 'verified';

  if (playerFlaggedThreat === item.isSocialEngineering) {
    gameState.score += 100;
    if (typeof AudioManager !== 'undefined') AudioManager.playCorrect();
    showToast(`🎯 Correct! ${item.threatVector} identified (+100 pts).`, 'success');
  } else {
    gameState.score = Math.max(0, gameState.score - 25);
    if (typeof AudioManager !== 'undefined') AudioManager.playWrong();
    showToast(`⚠️ Incorrect assessment! Review the CyberZerØ analysis (-25 pts).`, 'warning');
  }

  renderCommsFeed();
  selectCommItem(commId);
  updateHUD();

  // Check if all 4 communications resolved
  if (COMMS_ITEMS.every(c => c.resolved)) {
    setTimeout(finishSocialEngineeringMission, 1200);
  }
}

function finishSocialEngineeringMission() {
  const blocked = COMMS_ITEMS.filter(c => c.isSocialEngineering && c.playerVerdict === 'flagged').length;
  document.getElementById('res-social-blocked').textContent = `${blocked} / 3 Threats Blocked`;
  document.getElementById('res-social-score').textContent = gameState.score;

  const rank = blocked >= 3 ? 'S' : 'A';
  const rankEl = document.getElementById('social-results-rank');
  const labelEl = document.getElementById('social-results-rank-label');
  if (rankEl) rankEl.textContent = rank;
  if (labelEl) labelEl.textContent = rank === 'S' ? 'SOCIAL DEFENSE MASTER' : 'COMMUNICATIONS GUARDIAN';

  completeCategory('social_engineering', gameState.score, rank);
  showOverlay('overlay-social-results');
  if (typeof AudioManager !== 'undefined') AudioManager.playMissionComplete();
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 4: RANSOMWARE INCIDENT CONSOLE (JONALD)
// ═══════════════════════════════════════════════════════════

const RANSOMWARE_NODES = [
  {
    id: 'node_db',
    name: 'Shared Project Database (NAS-01)',
    icon: '🗄️',
    path: '/mnt/vault/project_db.enc',
    status: 'infected',
    threatName: 'Crypto.Locky.Payload',
    details: 'Files encrypted with .locky extension. Extortion demand left on volume.',
    actionPhase: 'isolate' // isolate -> restore -> clean
  },
  {
    id: 'node_dropper',
    name: 'Presentation Assets (Drive E:)',
    icon: '📊',
    path: '/srv/assets/crypt_dropper.exe',
    status: 'infected',
    threatName: 'Ransom.Dropper.Process (PID 4092)',
    details: 'Active malicious process detected attempting lateral network infection.',
    actionPhase: 'kill' // kill -> clean
  },
  {
    id: 'node_repo',
    name: 'Source Code Repository (Git-Srv)',
    icon: '💻',
    path: '/var/git/cyberzero_core.locked',
    status: 'infected',
    threatName: 'Ransom.Crypt.Payload',
    details: 'Repository volume locked by ransomware key. Encryption active.',
    actionPhase: 'isolate' // isolate -> restore -> clean
  },
  {
    id: 'node_logs',
    name: 'System Security Audit Logs (SysLog-04)',
    icon: '📜',
    path: '/var/log/audit.log',
    status: 'clean',
    threatName: 'Clean & Verified',
    details: 'Write-once immutable audit log stream. Uncompromised.',
    actionPhase: 'verify'
  }
];

function startRansomwareMission() {
  closeOverlay('overlay-results');
  closeOverlay('overlay-malware-results');
  closeOverlay('overlay-social-results');
  closeOverlay('overlay-ransomware-results');
  gameState.phase = 'ransomware';
  updateDesktopBackgroundForPhase('ransomware');

  RANSOMWARE_NODES.forEach((n, idx) => {
    if (idx === 3) {
      n.status = 'clean';
      n.actionPhase = 'verify';
    } else {
      n.status = 'infected';
      n.actionPhase = idx === 1 ? 'kill' : 'isolate';
    }
  });

  openApp('ransomware');
  const winRw = document.getElementById('win-ransomware');
  if (winRw) {
    winRw.style.left = '60px';
    winRw.style.top = '50px';
  }

  const logsEl = document.getElementById('rw-term-logs');
  if (logsEl) {
    logsEl.innerHTML = `
      <div class="rw-log-line rw-log-alert">[ALERT] Ransomware signature detected in project storage subsystem!</div>
      <div class="rw-log-line rw-log-warn">[WARN] Immediate action required: Isolate nodes and kill malicious payload droppers.</div>
      <div class="rw-log-line">[SYS] Emergency Immutable Cloud Backup connected at time.cyberacademy.gov</div>
    `;
  }

  renderRansomwareNodes();
  showToast('🔒 Chapter 4: Respond to ransomware, isolate infected drives, and restore the vault!', 'warning');
}

function renderRansomwareNodes() {
  const grid = document.getElementById('rw-nodes-grid');
  if (!grid) return;

  const restoredCount = RANSOMWARE_NODES.filter(n => n.status === 'clean' || n.status === 'restored').length;
  const pct = Math.round((restoredCount / RANSOMWARE_NODES.length) * 100);
  const healthEl = document.getElementById('rw-health-pct');
  if (healthEl) healthEl.textContent = `${pct}%`;

  grid.innerHTML = RANSOMWARE_NODES.map(node => {
    let statusClass = 'rw-status-infected';
    let statusText = '🚨 INFECTED / ENCRYPTED';
    let cardClass = 'infected';
    let buttonsHtml = '';

    if (node.status === 'clean' || node.status === 'restored') {
      statusClass = 'rw-status-restored';
      statusText = '✓ SECURED & RESTORED';
      cardClass = 'restored';
      buttonsHtml = '<span style="font-size:10px;color:#00e676;font-weight:700">✓ Immutable Snapshot Live</span>';
    } else if (node.status === 'isolated') {
      statusClass = 'rw-status-isolated';
      statusText = '⚠️ ISOLATED FROM NETWORK';
      cardClass = 'isolated';
      buttonsHtml = `
        <button class="rw-btn-action" onclick="executeNodeAction('${node.id}', 'restore')">
          📦 RESTORE FROM IMMUTABLE BACKUP (+100)
        </button>
      `;
    } else {
      if (node.actionPhase === 'kill') {
        buttonsHtml = `
          <button class="rw-btn-action" style="border-color:#ff5252;color:#ff5252" onclick="executeNodeAction('${node.id}', 'kill')">
            ⛔ TERMINATE PROCESS PID 4092 (+100)
          </button>
        `;
      } else if (node.actionPhase === 'verify') {
        buttonsHtml = `
          <button class="rw-btn-action" onclick="executeNodeAction('${node.id}', 'verify')">
            🔍 VERIFY AUDIT SIGNATURE (+50)
          </button>
        `;
      } else {
        buttonsHtml = `
          <button class="rw-btn-action" onclick="executeNodeAction('${node.id}', 'isolate')">
            🔒 ISOLATE COMPROMISED NODE
          </button>
        `;
      }
    }

    return `
      <div class="rw-node-card ${cardClass}">
        <div>
          <div class="rw-node-header">
            <span class="rw-node-icon">${node.icon}</span>
            <span class="rw-node-name">${node.name}</span>
          </div>
          <div class="rw-node-status ${statusClass}">${statusText}</div>
          <p style="font-size:10px;color:#90a4ae;margin:0 0 6px">${node.details}</p>
        </div>
        <div class="rw-node-actions">
          ${buttonsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function executeNodeAction(nodeId, action) {
  const node = RANSOMWARE_NODES.find(n => n.id === nodeId);
  if (!node) return;

  if (action === 'isolate') {
    node.status = 'isolated';
    node.actionPhase = 'restore';
    appendRwTerminalLog(`[CONTAINMENT] Node ${node.name} successfully severed from network.`, 'warn');
    if (typeof AudioManager !== 'undefined') AudioManager.playExamChoice();
    showToast(`🔒 Node isolated! Now deploy clean backup restoration.`, 'info');
  } else if (action === 'restore') {
    node.status = 'restored';
    gameState.score += 100;
    appendRwTerminalLog(`[RECOVERY] Immutable snapshot deployed to ${node.name}. 100% data integrity verified.`, 'success');
    if (typeof AudioManager !== 'undefined') AudioManager.playCorrect();
    showToast(`🎉 Clean snapshot restored without paying any ransom (+100 pts)!`, 'success');
  } else if (action === 'kill') {
    node.status = 'restored';
    gameState.score += 100;
    appendRwTerminalLog(`[KILL-SWITCH] Process PID 4092 (crypt_dropper.exe) terminated. Threat neutralized.`, 'success');
    if (typeof AudioManager !== 'undefined') AudioManager.playCorrect();
    showToast(`⛔ Malicious dropper process neutralized (+100 pts)!`, 'success');
  } else if (action === 'verify') {
    node.status = 'restored';
    gameState.score += 50;
    appendRwTerminalLog(`[AUDIT] Audit logs signature cryptographic SHA-256 verified. No tampering detected.`, 'success');
    if (typeof AudioManager !== 'undefined') AudioManager.playCorrect();
    showToast(`✓ Audit logs verified clean (+50 pts)!`, 'success');
  }

  renderRansomwareNodes();
  updateHUD();

  if (RANSOMWARE_NODES.every(n => n.status === 'clean' || n.status === 'restored')) {
    appendRwTerminalLog(`[SUCCESS] 100% System Vault Recovery Achieved! ZERO dollars paid in ransom!`, 'success');
    setTimeout(finishRansomwareMission, 1400);
  }
}

function appendRwTerminalLog(msg, type = 'info') {
  const logs = document.getElementById('rw-term-logs');
  if (!logs) return;
  const line = document.createElement('div');
  line.className = `rw-log-line ${type === 'alert' ? 'rw-log-alert' : type === 'warn' ? 'rw-log-warn' : type === 'success' ? 'rw-log-success' : ''}`;
  line.textContent = msg;
  logs.appendChild(line);
  logs.scrollTop = logs.scrollHeight;
}

function finishRansomwareMission() {
  document.getElementById('res-rw-recovered').textContent = `100% (4 / 4 Nodes)`;
  document.getElementById('res-rw-score').textContent = gameState.score;

  const rank = 'S';
  const rankEl = document.getElementById('ransomware-results-rank');
  const labelEl = document.getElementById('ransomware-results-rank-label');
  if (rankEl) rankEl.textContent = rank;
  if (labelEl) labelEl.textContent = 'RANSOMWARE INCIDENT COMMANDER';

  completeCategory('ransomware', gameState.score, rank);
  showOverlay('overlay-ransomware-results');
  if (typeof AudioManager !== 'undefined') AudioManager.playMissionComplete();
}

// ═══════════════════════════════════════════════════════════
// GRAND VICTORY & ALL-MODULES MASTER CERTIFICATION
// ═══════════════════════════════════════════════════════════

function showGrandCertificate() {
  hideAllOverlays();

  const nameEl = document.getElementById('grand-cert-name');
  if (nameEl) nameEl.textContent = gameState.playerName || 'Ace';

  const totalScore = CATEGORIES.reduce((sum, c) => sum + (c.score || 0), 0) + gameState.score;
  const scoreEl = document.getElementById('grand-total-score');
  if (scoreEl) scoreEl.textContent = `${totalScore} pts`;

  showOverlay('overlay-grand-results');
  if (typeof AudioManager !== 'undefined') {
    AudioManager.playMissionComplete();
  }
  showToast('🏆 CONGRATULATIONS! You completed all 4 CyberZerØ Threat Chapters!', 'success');
}

function restartEntireGame() {
  hideAllOverlays();
  retakePreAssessment();
  playAgain();
  showOverlay('overlay-title-menu');
}

// ═══════════════════════════════════════════════════════════
// MAIN MENU / TITLE SCREEN CONTROLS
// ═══════════════════════════════════════════════════════════


// ── LOADING SCREEN KNOWLEDGE TIPS ──
const LOADING_TIPS = [
  {
    category: 'PHISHING THREAT',
    icon: '🎣',
    title: 'Check the Sender\'s Email Domain',
    body: 'Phishing emails often use free domains like Gmail or misspelled company names. A real bank like BPI will always use @bpi.com.ph — never @gmail.com or @bpi-support.com.'
  },
  {
    category: 'PHISHING THREAT',
    icon: '⏰',
    title: 'Urgency Is a Red Flag',
    body: '"You have 30 minutes before your account is locked!" Scammers create panic to stop you from thinking clearly. Legitimate organizations never threaten immediate account closures via email.'
  },
  {
    category: 'PHISHING THREAT',
    icon: '🔗',
    title: 'Hover Before You Click Any Link',
    body: 'A button may say "Verify My Account" but link to a fake site. Always check where a link actually leads — the real PayPal is paypal.com, not paypal-account-check.com or any lookalike domain.'
  },
  {
    category: 'MALWARE DEFENSE',
    icon: '🦠',
    title: 'Malware Hides in Ordinary File Names',
    body: 'Files like "Invoice_Final.pdf.exe" or "ResumeUpdate.docx" can secretly be malware. Always check real file extensions and never open attachments from unknown or unexpected senders.'
  },
  {
    category: 'MALWARE DEFENSE',
    icon: '🛡️',
    title: 'Keep Your Anti-Virus Updated',
    body: 'Malware databases are updated daily to catch new threats. An anti-virus with outdated definitions is like a lock with a missing key. Run regular scans and always keep your security software current.'
  },
  {
    category: 'MALWARE DEFENSE',
    icon: '📂',
    title: 'Ransomware Encrypts Your Files for Money',
    body: 'Ransomware is a type of malware that locks your files and demands payment to restore them. Never pay — there\'s no guarantee your files will be returned. Always maintain offline backups.'
  },
  {
    category: 'SOCIAL ENGINEERING',
    icon: '🎭',
    title: 'Social Engineering Exploits Human Trust',
    body: 'Attackers often impersonate IT support, HR, or authority figures to trick people into giving credentials. Always verify callers through official channels — never give your password over the phone.'
  },
  {
    category: 'CYBER HYGIENE',
    icon: '🔐',
    title: 'Use Multi-Factor Authentication (MFA)',
    body: 'Even if a phisher steals your password, MFA adds a second barrier. Enable it on all important accounts — email, banking, and social media. It\'s your best defense against credential theft.'
  },
  {
    category: 'CYBER HYGIENE',
    icon: '📱',
    title: 'Never Share OTPs or MPINs on Websites',
    body: 'GCash, BPI, and all legitimate services will NEVER ask for your 4-digit MPIN or 6-digit OTP through a website link. Any site that asks is a phishing scam — close it immediately.'
  },
  {
    category: 'TYPOSQUAT ATTACK',
    icon: '🔍',
    title: 'Typosquatting Swaps Letters to Fool You',
    body: 'Fake domains like "paypa1.com" (using digit 1 instead of letter l) look almost identical to real ones. Always read URLs carefully character by character before entering any sensitive information.'
  }
];

// Simple beep for loading screen — bypasses AudioManager (may not be unlocked yet)
function _playLoadingBeep(freq, gain, delay) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ac = new AudioCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
    g.gain.setValueAtTime(gain, ac.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + 0.18);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + 0.2);
    setTimeout(() => { try { ac.close(); } catch(e){} }, (delay + 0.3) * 1000);
  } catch(e) {}
}

function startFromTitleMenu() {
  // Hide desktop immediately — prevents any flash of desktop behind overlays
  const desktop = document.getElementById('desktop');
  if (desktop) desktop.style.visibility = 'hidden';

  // Show the loading screen immediately
  const ls = document.getElementById('overlay-loading-screen');
  if (!ls) {
    _doStartFromTitleMenu();
    return;
  }

  // Activate loading overlay smoothly FIRST, then close title menu
  ls.classList.remove('ls-leaving');
  ls.classList.add('ls-active');

  // Play start-of-loading beep
  _playLoadingBeep(320, 0.12, 0);

  // Now safely close title menu — loading screen is already covering everything
  closeOverlay('overlay-title-menu');

  const titleEl = document.getElementById('ls-pixel-title');
  if (titleEl) {
    titleEl.innerHTML = 'LOADING<span class="ls-ellipsis">...</span>';
  }

  // ── Build pixel block bar ──
  const BAR_BLOCKS = 28; // number of segments
  const barInner = document.getElementById('ls-pixel-bar-inner');
  if (barInner) {
    barInner.innerHTML = '';
    for (let i = 0; i < BAR_BLOCKS; i++) {
      const block = document.createElement('div');
      block.className = 'ls-pixel-block';
      block.dataset.index = i;
      barInner.appendChild(block);
    }
  }

  // ── Live percent + pixel block animation (10 seconds) ──
  const pctEl = document.getElementById('ls-pixel-pct');
  const DURATION = 10000; // 10 seconds
  let startTime = null;
  let barAnimId = null;
  let halfwayBeepFired = false;

  function animateBar(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / DURATION, 1); // 0 → 1
    const pct = Math.round(progress * 100);

    // Update percentage text
    if (pctEl) pctEl.textContent = pct + '%';

    // Midway beep at 50%
    if (!halfwayBeepFired && pct >= 50) {
      halfwayBeepFired = true;
      _playLoadingBeep(520, 0.1, 0);
    }

    // Animate pixel blocks
    if (barInner) {
      const litCount = Math.round(progress * BAR_BLOCKS);
      const blocks = barInner.querySelectorAll('.ls-pixel-block');
      blocks.forEach((b, i) => {
        if (i < litCount - 1) {
          b.classList.add('lit');
          b.classList.remove('lit-edge');
        } else if (i === litCount - 1 && litCount > 0) {
          // Leading edge block = bright white flash
          b.classList.add('lit', 'lit-edge');
        } else {
          b.classList.remove('lit', 'lit-edge');
        }
      });
    }

    if (progress < 1) {
      barAnimId = requestAnimationFrame(animateBar);
    }
  }
  barAnimId = requestAnimationFrame(animateBar);

  // ── Select 1 random note for this loading session (rotates every new load) ──
  let tipIdx = Math.floor(Math.random() * LOADING_TIPS.length);
  if (typeof window._lastLoadingTipIdx === 'number' && LOADING_TIPS.length > 1) {
    while (tipIdx === window._lastLoadingTipIdx) {
      tipIdx = Math.floor(Math.random() * LOADING_TIPS.length);
    }
  }
  window._lastLoadingTipIdx = tipIdx;
  const tip = LOADING_TIPS[tipIdx];

  const catEl = document.getElementById('ls-tip-category');
  const iconEl = document.getElementById('ls-tip-icon');
  const tipTitleEl = document.getElementById('ls-tip-title');
  const bodyEl = document.getElementById('ls-tip-body');

  if (catEl) catEl.textContent = tip.category;
  if (iconEl) iconEl.textContent = tip.icon;
  if (tipTitleEl) tipTitleEl.textContent = tip.title;
  if (bodyEl) bodyEl.textContent = tip.body;

  // ── After 10 seconds: complete & smooth fade transition into game ──
  setTimeout(() => {
    if (barAnimId) cancelAnimationFrame(barAnimId);

    // Final state: 100% full glow
    if (pctEl) pctEl.textContent = '100%';
    if (titleEl) {
      titleEl.innerHTML = 'READY<span class="ls-ellipsis">!</span>';
    }
    if (barInner) {
      barInner.querySelectorAll('.ls-pixel-block').forEach(b => {
        b.classList.add('lit');
        b.classList.remove('lit-edge');
      });
    }

    // Play success chime: three ascending beeps
    _playLoadingBeep(440, 0.12, 0);
    _playLoadingBeep(660, 0.12, 0.12);
    _playLoadingBeep(880, 0.18, 0.24);

    // Launch game prologue
    _doStartFromTitleMenu();

    // Smoothly dissolve loading screen over 800ms
    // Desktop is revealed by hideAllOverlays() when the game reaches desktop mode
    setTimeout(() => {
      ls.classList.add('ls-leaving');
      setTimeout(() => {
        ls.classList.remove('ls-active', 'ls-leaving');
      }, 800);
    }, 300);

  }, DURATION);
}

function _doStartFromTitleMenu() {
  // Don't call closeOverlay here — it would briefly show the desktop.
  // The title menu is already closed by startFromTitleMenu().
  const titleMenu = document.getElementById('overlay-title-menu');
  if (titleMenu) titleMenu.classList.remove('active');
  updateDesktopBackgroundForPhase('prologue');
  if (typeof AudioManager !== 'undefined') {
    AudioManager.playNotification();
  }
  // Launch the Visual Novel Prologue with AI Guide Zero
  playCategoryStory('prologue');
  showToast('🤖 AI Guide Zero: Welcome to CyberZerØ.', 'info');
}


function replayPrologueVN() {
  closeOverlay('overlay-category-select');
  playCategoryStory('prologue');
  showToast('🎬 Replaying CyberZerØ Visual Novel Orientation.', 'info');
}

function proceedFromIntroToExam() {
  closeOverlay('overlay-game-intro');
  closeOverlay('overlay-welcome');
  showOverlay('overlay-pre-assessment');

  const shell = document.getElementById('exam-paper-shell');
  if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Dynamically set today's date on the paper
  const dateEl = document.getElementById('exam-paper-date');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  // Focus the name input on the exam paper
  setTimeout(() => {
    const nameInput = document.getElementById('exam-input-name');
    if (nameInput) {
      nameInput.focus();
    }
  }, 200);

  showToast('📝 Step 1: Write your name and complete the Pre-Assessment Exam.', 'info');
}

function openExitModal() {
  const modal = document.getElementById('title-exit-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeExitModal() {
  const modal = document.getElementById('title-exit-modal');
  if (modal) modal.classList.add('hidden');
}

function confirmExitGame() {
  closeExitModal();
  const discScreen = document.getElementById('title-disconnected-screen');
  if (discScreen) discScreen.classList.remove('hidden');
  try {
    window.close();
  } catch (e) {
    // Modern browsers prevent scripts from closing unscripted tabs; disconnected screen acts as fallback
  }
}

function reconnectTerminal() {
  const discScreen = document.getElementById('title-disconnected-screen');
  if (discScreen) discScreen.classList.add('hidden');
  closeExitModal();
  showOverlay('overlay-title-menu');
  showToast('⚡ Terminal reconnected. Welcome back, Student.', 'success');
}

function initTitleParticles() {
  const container = document.getElementById('title-particles');
  if (!container) return;
  container.innerHTML = '';
  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'vn-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = Math.random() * 20 + '%';
    p.style.animationDelay = (Math.random() * 5) + 's';
    p.style.animationDuration = (4 + Math.random() * 6) + 's';
    p.style.opacity = (0.2 + Math.random() * 0.5).toString();
    container.appendChild(p);
  }
}

// ═══════════════════════════════════════════════════════════
// AUDIO ENGINE (Web Audio API Synthesizer & Sound System)
// ═══════════════════════════════════════════════════════════

const AudioManager = (() => {
  let ctx = null;

  // Settings with defaults
  const settings = {
    masterVolume: 80,
    clicksVolume: 85,
    sfxVolume: 80,
    typingVolume: 75,
    masterMuted: false,
    clicksMuted: false,
    sfxMuted: false,
    typingMuted: false
  };

  // Load persisted settings
  try {
    const saved = localStorage.getItem('cyberzero_audio_settings');
    if (saved) {
      Object.assign(settings, JSON.parse(saved));
    }
  } catch (e) {
    console.warn('Audio settings localStorage access failed:', e);
  }

  function saveSettings() {
    try {
      localStorage.setItem('cyberzero_audio_settings', JSON.stringify(settings));
    } catch (e) {}
  }

  function getContext() {
    if (!ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        ctx = new AudioContextClass();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function unlock() {
    getContext();
  }

  function getEffectiveClickGain() {
    if (settings.masterMuted || settings.clicksMuted) return 0;
    return (settings.masterVolume / 100) * (settings.clicksVolume / 100);
  }

  function getEffectiveSfxGain() {
    if (settings.masterMuted || settings.sfxMuted) return 0;
    return (settings.masterVolume / 100) * (settings.sfxVolume / 100);
  }

  function getEffectiveTypingGain() {
    if (settings.masterMuted || settings.typingMuted) return 0;
    return (settings.masterVolume / 100) * (settings.typingVolume / 100);
  }

  // Realistic mechanical mouse click sound
  function playMouseClick() {
    const effGain = getEffectiveClickGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      // Slight pitch variance for natural organic feel
      const pitchVariance = 0.96 + Math.random() * 0.08;

      // 1. High transient snap (contact click)
      const osc = ac.createOscillator();
      const oscGain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2600 * pitchVariance, now);
      osc.frequency.exponentialRampToValueAtTime(320 * pitchVariance, now + 0.009);

      oscGain.gain.setValueAtTime(0.38 * effGain, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.011);

      const highpass = ac.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(1400, now);

      osc.connect(highpass);
      highpass.connect(oscGain);
      oscGain.connect(ac.destination);

      osc.start(now);
      osc.stop(now + 0.012);

      // 2. Plastic casing resonant body "thump"
      const bodyOsc = ac.createOscillator();
      const bodyGain = ac.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(190 * pitchVariance, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(65 * pitchVariance, now + 0.018);

      bodyGain.gain.setValueAtTime(0.2 * effGain, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ac.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.021);

      // 3. Crisp white noise micro-impulse
      const bufferSize = Math.floor(ac.sampleRate * 0.005);
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ac.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ac.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3400, now);
      noiseFilter.Q.setValueAtTime(2.2, now);

      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.24 * effGain, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ac.destination);

      noise.start(now);
      noise.stop(now + 0.007);
    } catch (err) {}
  }

  // Brief slider tick
  function playSliderTick() {
    const effGain = getEffectiveClickGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      gain.gain.setValueAtTime(0.08 * effGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.007);
    } catch (e) {}
  }

  // Window Open/Close Cyber Swoosh
  function playWindowSound(isOpen) {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';

      if (isOpen) {
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18 * effGain, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      } else {
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.15 * effGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      }

      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  // Flag Chirp / Radar Ping
  function playFlagChirp() {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      [880, 1320].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.18 * effGain, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.08);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.09);
      });
    } catch (e) {}
  }

  // Toast / System Notification Chime
  function playNotification() {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      [587.33, 880].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15 * effGain, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.16);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.18);
      });
    } catch (e) {}
  }

  // Cyber Victory / Pass Chime
  function playChime(isPositive = true) {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      const notes = isPositive ? [523.25, 659.25, 783.99, 1046.50] : [587.33, 440];
      notes.forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.18 * effGain, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.24);
      });
    } catch (e) {}
  }

  // Warning / Wrong Verdict Alert Sound
  function playAlert() {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.16);

      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);

      gain.gain.setValueAtTime(0.16 * effGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch (e) {}
  }

  // Keyboard / input field typing sound — mechanical clatter
  function playTypingKey() {
    const effGain = getEffectiveTypingGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;
    try {
      const now = ac.currentTime;
      // Randomise pitch slightly so rapid typing sounds natural
      const pitchVar = 0.90 + Math.random() * 0.22;

      // Sharp high-click transient
      const osc = ac.createOscillator();
      const oscGain = ac.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(3200 * pitchVar, now);
      osc.frequency.exponentialRampToValueAtTime(480 * pitchVar, now + 0.007);
      oscGain.gain.setValueAtTime(0.22 * effGain, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.009);
      const hp = ac.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(1800, now);
      osc.connect(hp); hp.connect(oscGain); oscGain.connect(ac.destination);
      osc.start(now); osc.stop(now + 0.01);

      // Soft body thud
      const body = ac.createOscillator();
      const bodyGain = ac.createGain();
      body.type = 'sine';
      body.frequency.setValueAtTime(160 * pitchVar, now);
      body.frequency.exponentialRampToValueAtTime(55 * pitchVar, now + 0.014);
      bodyGain.gain.setValueAtTime(0.12 * effGain, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
      body.connect(bodyGain); bodyGain.connect(ac.destination);
      body.start(now); body.stop(now + 0.016);
    } catch (e) {}
  }

  // Narrator / typewriter text animation sound — soft electronic taptap
  function playNarratorTyping() {
    const effGain = getEffectiveTypingGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const pitchVar = 0.92 + Math.random() * 0.18;

      // Soft sine blip — like an old terminal cursor blink
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900 * pitchVar, now);
      osc.frequency.exponentialRampToValueAtTime(560 * pitchVar, now + 0.008);
      gain.gain.setValueAtTime(0.07 * effGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);
      osc.connect(gain); gain.connect(ac.destination);
      osc.start(now); osc.stop(now + 0.011);
    } catch (e) {}
  }

  // Correct Answer / Verdict Sound — Uplifting Cyber Chime
  function playCorrect() {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      // Dual-oscillator chime: G5 (783.99Hz) -> C6 (1046.50Hz) -> E6 (1318.51Hz)
      const notes = [
        { freq: 783.99, delay: 0.0, duration: 0.25 },
        { freq: 1046.50, delay: 0.08, duration: 0.35 },
        { freq: 1318.51, delay: 0.16, duration: 0.50 }
      ];

      notes.forEach(note => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        gain.gain.setValueAtTime(0.22 * effGain, now + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.delay + note.duration);

        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + note.delay);
        osc.stop(now + note.delay + note.duration + 0.02);
      });
    } catch (e) {}
  }

  // Wrong Answer / Verdict Sound — Harsh Error Buzz
  function playWrong() {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      // Double low saw-pulse drop: Eb3 (155.56Hz) -> C3 (130.81Hz)
      const pulses = [
        { freq: 185.00, endFreq: 130.81, delay: 0.0, duration: 0.16 },
        { freq: 155.56, endFreq: 110.00, delay: 0.18, duration: 0.22 }
      ];

      pulses.forEach(p => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        const filter = ac.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(p.freq, now + p.delay);
        osc.frequency.exponentialRampToValueAtTime(p.endFreq, now + p.delay + p.duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, now + p.delay);

        gain.gain.setValueAtTime(0.22 * effGain, now + p.delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.delay + p.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);

        osc.start(now + p.delay);
        osc.stop(now + p.delay + p.duration + 0.02);
      });
    } catch (e) {}
  }

  // Mission Complete Fanfare Sound — Triumphant Victory Arpeggio
  function playMissionComplete() {
    const effGain = getEffectiveSfxGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      // Triumphant cyber arpeggio: C5, E5, G5, C6, G5, C6, E6 sustain chord
      const seq = [
        { freq: 523.25, time: 0.0, dur: 0.15 },
        { freq: 659.25, time: 0.10, dur: 0.15 },
        { freq: 783.99, time: 0.20, dur: 0.15 },
        { freq: 1046.50, time: 0.30, dur: 0.22 },
        { freq: 783.99, time: 0.42, dur: 0.15 },
        { freq: 1046.50, time: 0.52, dur: 0.25 },
        { freq: 1318.51, time: 0.65, dur: 0.85 },
        { freq: 1567.98, time: 0.65, dur: 0.85 }
      ];

      seq.forEach(s => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();

        osc.type = s.time >= 0.65 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(s.freq, now + s.time);

        const vol = s.time >= 0.65 ? 0.25 : 0.20;
        gain.gain.setValueAtTime(vol * effGain, now + s.time);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + s.time + s.dur);

        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + s.time);
        osc.stop(now + s.time + s.dur + 0.02);
      });
    } catch (e) {}
  }

  // Exam Paper Option Selection Sound — Tactile Pencil Mark / Bubble Pop
  function playExamChoice() {
    const effGain = getEffectiveClickGain();
    if (effGain <= 0.001) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const now = ac.currentTime;
      const pitchVar = 0.95 + Math.random() * 0.10;

      // Soft paper-pencil bubble pop
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(860 * pitchVar, now);
      osc.frequency.exponentialRampToValueAtTime(430 * pitchVar, now + 0.04);
      gain.gain.setValueAtTime(0.20 * effGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.05);

      // Light pencil graphite scratch transient
      const click = ac.createOscillator();
      const clickGain = ac.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(2600 * pitchVar, now);
      click.frequency.exponentialRampToValueAtTime(1100 * pitchVar, now + 0.016);
      clickGain.gain.setValueAtTime(0.12 * effGain, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
      click.connect(clickGain);
      clickGain.connect(ac.destination);
      click.start(now);
      click.stop(now + 0.02);
    } catch (e) {}
  }

  return {
    settings,
    unlock,
    saveSettings,
    playMouseClick,
    playSliderTick,
    playWindowSound,
    playFlagChirp,
    playNotification,
    playChime,
    playAlert,
    playCorrect,
    playWrong,
    playMissionComplete,
    playTypingKey,
    playNarratorTyping,
    playExamChoice
  };
})();

// ═══════════════════════════════════════════════════════════
// DESKTOP VOLUME FLYOUT CONTROLS
// ═══════════════════════════════════════════════════════════

function getVolumeSpeakerIcon(volume, isMuted) {
  if (isMuted || volume === 0) return '🔇';
  if (volume < 25) return '🔈';
  if (volume <= 60) return '🔉';
  return '🔊';
}

function updateVolumeUI() {
  const s = AudioManager.settings;
  const masterIcon = getVolumeSpeakerIcon(s.masterVolume, s.masterMuted);

  // Sliders
  const masterSlider = document.getElementById('slider-master-volume');
  const clicksSlider = document.getElementById('slider-clicks-volume');
  const sfxSlider = document.getElementById('slider-sfx-volume');

  if (masterSlider) {
    masterSlider.value = s.masterVolume;
    masterSlider.style.setProperty('--fill-pct', `${s.masterVolume}%`);
  }
  if (clicksSlider) {
    clicksSlider.value = s.clicksVolume;
    clicksSlider.style.setProperty('--fill-pct', `${s.clicksVolume}%`);
  }
  if (sfxSlider) {
    sfxSlider.value = s.sfxVolume;
    sfxSlider.style.setProperty('--fill-pct', `${s.sfxVolume}%`);
  }
  const typingSlider = document.getElementById('slider-typing-volume');
  if (typingSlider) {
    typingSlider.value = s.typingVolume;
    typingSlider.style.setProperty('--fill-pct', `${s.typingVolume}%`);
  }

  // Numeric text
  const masterVal = document.getElementById('volume-master-val');
  const clicksVal = document.getElementById('volume-clicks-val');
  const sfxVal = document.getElementById('volume-sfx-val');
  const typingVal = document.getElementById('volume-typing-val');

  if (masterVal) masterVal.textContent = s.masterMuted ? 'Muted' : `${s.masterVolume}%`;
  if (clicksVal) clicksVal.textContent = s.clicksMuted ? 'Muted' : `${s.clicksVolume}%`;
  if (sfxVal) sfxVal.textContent = s.sfxMuted ? 'Muted' : `${s.sfxVolume}%`;
  if (typingVal) typingVal.textContent = s.typingMuted ? 'Muted' : `${s.typingVolume}%`;

  // Master mute icon and tray icons
  const muteMasterIcon = document.getElementById('mute-master-icon');
  const trayVolIcon = document.getElementById('tray-volume-icon');
  const flyoutHeaderIcon = document.getElementById('flyout-header-icon');
  const masterMuteBtn = document.getElementById('btn-master-mute');

  if (muteMasterIcon) muteMasterIcon.textContent = masterIcon;
  // Keep SVG img in tray — only apply muted visual state via CSS class
  if (trayVolIcon) {
    const isMuted = s.masterMuted || s.masterVolume === 0;
    trayVolIcon.innerHTML = `<img src="assets/icons/networks/audio.svg" alt="Sound" style="width:18px;height:18px;vertical-align:middle;${isMuted ? 'opacity:0.4;' : ''}">`;
  }
  if (flyoutHeaderIcon) flyoutHeaderIcon.textContent = masterIcon;

  // Close volume flyout and start menu when clicking outside
  document.addEventListener('click', (e) => {
    const flyout = document.getElementById('desktop-volume-flyout');
    const trayBtn = document.getElementById('tray-volume-btn');
    if (flyout && !flyout.contains(e.target) && trayBtn && !trayBtn.contains(e.target)) {
      closeVolumeFlyout();
    }

    const startMenu = document.getElementById('desktop-start-menu');
    const startBtn = document.getElementById('start-btn');
    if (startMenu && !startMenu.contains(e.target) && startBtn && !startBtn.contains(e.target)) {
      closeStartMenu();
    }
  });

  if (masterMuteBtn) {
    if (s.masterMuted || s.masterVolume === 0) masterMuteBtn.classList.add('muted');
    else masterMuteBtn.classList.remove('muted');
  }

  // Clicks mute button
  const clicksMuteBtn = document.getElementById('btn-clicks-mute');
  const clicksMuteIcon = document.getElementById('mute-clicks-icon');
  if (clicksMuteBtn) {
    if (s.clicksMuted) {
      clicksMuteBtn.classList.add('muted');
      if (clicksMuteIcon) clicksMuteIcon.textContent = '🔇';
    } else {
      clicksMuteBtn.classList.remove('muted');
      if (clicksMuteIcon) clicksMuteIcon.textContent = '🖱️';
    }
  }

  // SFX mute button
  const sfxMuteBtn = document.getElementById('btn-sfx-mute');
  const sfxMuteIcon = document.getElementById('mute-sfx-icon');
  if (sfxMuteBtn) {
    if (s.sfxMuted) {
      sfxMuteBtn.classList.add('muted');
      if (sfxMuteIcon) sfxMuteIcon.textContent = '🔇';
    } else {
      sfxMuteBtn.classList.remove('muted');
      if (sfxMuteIcon) sfxMuteIcon.textContent = '⚡';
    }
  }

  // Typing mute button
  const typingMuteBtn = document.getElementById('btn-typing-mute');
  const typingMuteIcon = document.getElementById('mute-typing-icon');
  if (typingMuteBtn) {
    if (s.typingMuted) {
      typingMuteBtn.classList.add('muted');
      if (typingMuteIcon) typingMuteIcon.textContent = '🔇';
    } else {
      typingMuteBtn.classList.remove('muted');
      if (typingMuteIcon) typingMuteIcon.textContent = '⌨️';
    }
  }

  // Update tray button tooltip
  const trayBtn = document.getElementById('tray-volume-btn');
  if (trayBtn) {
    trayBtn.title = s.masterMuted ? 'Sound (Muted)' : `Sound (${s.masterVolume}%)`;
  }
}

function toggleVolumeFlyout(event) {
  if (event) event.stopPropagation();
  AudioManager.unlock();
  const flyout = document.getElementById('desktop-volume-flyout');
  const trayBtn = document.getElementById('tray-volume-btn');
  if (!flyout) return;

  const isHidden = flyout.classList.contains('hidden');

  if (isHidden) {
    closeNetworkFlyout();
    closeCalendarFlyout();
    const startMenu = document.getElementById('desktop-start-menu');
    if (startMenu && !startMenu.classList.contains('hidden')) toggleStartMenu();

    flyout.classList.remove('flyout-global', 'hidden');
    if (trayBtn) trayBtn.classList.add('active');
    updateVolumeUI();
    AudioManager.playMouseClick();
  } else {
    closeVolumeFlyout();
  }
}

function closeVolumeFlyout(event) {
  if (event) event.stopPropagation();
  const flyout = document.getElementById('desktop-volume-flyout');
  const trayBtn = document.getElementById('tray-volume-btn');
  if (flyout) flyout.classList.add('hidden');
  if (trayBtn) trayBtn.classList.remove('active');
}

// ═══════════════════════════════════════════════════════════
// NETWORK & QUICK SETTINGS FLYOUT CONTROLS
// ═══════════════════════════════════════════════════════════

let networkSettings = {
  wifi: true,
  bluetooth: true,
  airplane: false,
  guard: true,
  currentSsid: 'CYBER-NET (WPA3-Enterprise)'
};

function toggleNetworkFlyout(event) {
  if (event) event.stopPropagation();
  if (typeof AudioManager !== 'undefined') AudioManager.unlock();
  const flyout = document.getElementById('desktop-network-flyout');
  const trayBtn = document.getElementById('tray-wifi-btn');
  if (!flyout) return;

  const isHidden = flyout.classList.contains('hidden');
  if (isHidden) {
    closeVolumeFlyout();
    closeCalendarFlyout();
    const startMenu = document.getElementById('desktop-start-menu');
    if (startMenu && !startMenu.classList.contains('hidden')) toggleStartMenu();

    flyout.classList.remove('hidden');
    if (trayBtn) trayBtn.classList.add('active');
    updateNetworkUI();
    if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  } else {
    closeNetworkFlyout();
  }
}

function closeNetworkFlyout(event) {
  if (event) event.stopPropagation();
  const flyout = document.getElementById('desktop-network-flyout');
  const trayBtn = document.getElementById('tray-wifi-btn');
  if (flyout) flyout.classList.add('hidden');
  if (trayBtn) trayBtn.classList.remove('active');
}

function openWifiSettingsFromFlyout(event) {
  if (event) event.stopPropagation();
  closeNetworkFlyout();
  openApp('wifi-settings');
  renderG4WiFiSettings();
  switchWifiSettingsTab('wifi');
  showToast('⚙️ Opened Wi-Fi Settings.', 'info');
}

// ── WIFI SETTINGS WINDOW TAB SWITCHING ──────────────────────────────────────

function switchWifiSettingsTab(tab) {
  const tabs = ['wifi', 'bluetooth', 'airplane'];
  tabs.forEach(t => {
    const tabEl = document.getElementById('wstab-' + t);
    const navEl = document.getElementById('wsnav-' + t);
    if (tabEl) tabEl.style.display = (t === tab) ? '' : 'none';
    if (navEl) {
      navEl.classList.toggle('active', t === tab);
    }
  });
  // Sync airplane tab state with current networkSettings
  if (tab === 'airplane') wsUpdateAirplaneTab();
  if (tab === 'bluetooth') wsUpdateBluetoothTab();
}

function wsUpdateBluetoothTab() {
  const label = document.getElementById('ws-bt-state-label');
  const btn = document.getElementById('ws-bt-toggle-btn');
  const isOn = networkSettings.bluetooth;
  if (label) label.textContent = isOn ? 'On — Student Headset connected' : 'Off — No devices connected';
  if (btn) {
    btn.textContent = isOn ? 'Turn Off' : 'Turn On';
    btn.style.background = isOn ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.08)';
    btn.style.borderColor = isOn ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.15)';
    btn.style.color = isOn ? '#38bdf8' : 'var(--text-secondary)';
  }
}

function wsToggleBluetooth() {
  if (networkSettings.airplane) {
    showToast('✈️ Turn off Airplane Mode first to enable Bluetooth.', 'warning');
    return;
  }
  networkSettings.bluetooth = !networkSettings.bluetooth;
  updateNetworkUI();
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast(networkSettings.bluetooth ? '📡 Bluetooth On • Student Headset Connected.' : '📡 Bluetooth Off.', networkSettings.bluetooth ? 'success' : 'info');
  wsUpdateBluetoothTab();
}

function wsUpdateAirplaneTab() {
  const label = document.getElementById('ws-air-state-label');
  const btn = document.getElementById('ws-air-toggle-btn');
  const wifiStatus = document.getElementById('ws-air-wifi-status');
  const btStatus = document.getElementById('ws-air-bt-status');
  const isOn = networkSettings.airplane;
  if (label) {
    label.textContent = isOn ? 'On — All wireless transmitters suspended' : 'Off — All wireless transmitters active';
    label.style.color = isOn ? '#fb923c' : '#94a3b8';
  }
  if (btn) {
    btn.textContent = isOn ? 'Turn Off' : 'Turn On';
    btn.style.background = isOn ? 'rgba(251,146,60,0.2)' : 'rgba(56,189,248,0.15)';
    btn.style.borderColor = isOn ? '#fb923c' : '#38bdf8';
    btn.style.color = isOn ? '#ffedd5' : '#e0f2fe';
  }
  const statusText = isOn ? 'Suspended' : 'Active';
  if (wifiStatus) {
    wifiStatus.textContent = statusText;
    wifiStatus.style.color = isOn ? '#fb923c' : '#4ade80';
    wifiStatus.style.background = isOn ? 'rgba(251,146,60,0.15)' : 'rgba(74,222,128,0.12)';
    wifiStatus.style.borderColor = isOn ? 'rgba(251,146,60,0.4)' : 'rgba(74,222,128,0.3)';
  }
  if (btStatus) {
    btStatus.textContent = statusText;
    btStatus.style.color = isOn ? '#fb923c' : '#4ade80';
    btStatus.style.background = isOn ? 'rgba(251,146,60,0.15)' : 'rgba(74,222,128,0.12)';
    btStatus.style.borderColor = isOn ? 'rgba(251,146,60,0.4)' : 'rgba(74,222,128,0.3)';
  }
}

function wsToggleAirplane() {
  networkSettings.airplane = !networkSettings.airplane;
  updateNetworkUI();
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast(networkSettings.airplane ? '✈️ Airplane Mode Activated — Wireless transmitters suspended.' : '✈️ Airplane Mode Disabled — Wireless restored.', networkSettings.airplane ? 'warning' : 'success');
  wsUpdateAirplaneTab();
}

function updateNetworkUI() {
  const tileWifi = document.getElementById('tile-wifi');
  const tileWifiStatus = document.getElementById('tile-wifi-status');
  const tileWifiBadge = document.getElementById('tile-wifi-badge');
  const trayWifiIcon = document.getElementById('tray-wifi-icon');
  const wifiList = document.getElementById('wifi-networks-list');

  const tileBt = document.getElementById('tile-bluetooth');
  const tileBtStatus = document.getElementById('tile-bt-status');
  const tileBtBadge = document.getElementById('tile-bt-badge');

  const tileAir = document.getElementById('tile-airplane');
  const tileAirStatus = document.getElementById('tile-airplane-status');
  const tileAirBadge = document.getElementById('tile-airplane-badge');

  const tileGuard = document.getElementById('tile-guard');
  const tileGuardStatus = document.getElementById('tile-guard-status');
  const tileGuardBadge = document.getElementById('tile-guard-badge');

  if (networkSettings.airplane) {
    if (trayWifiIcon) trayWifiIcon.innerHTML = '<img src="assets/icons/networks/airlane mode.svg" alt="Airplane Mode" style="width:18px;height:18px;vertical-align:middle;">';
    if (tileAir) tileAir.classList.add('active');
    if (tileAirStatus) tileAirStatus.textContent = 'Active (Transmitters off)';
    if (tileAirBadge) tileAirBadge.textContent = 'ON';

    if (tileWifi) tileWifi.classList.remove('active');
    if (tileWifiStatus) tileWifiStatus.textContent = 'Disabled by Airplane Mode';
    if (tileWifiBadge) tileWifiBadge.textContent = 'OFF';

    if (tileBt) tileBt.classList.remove('active');
    if (tileBtStatus) tileBtStatus.textContent = 'Disabled';
    if (tileBtBadge) tileBtBadge.textContent = 'OFF';

    if (wifiList) wifiList.style.opacity = '0.35';
    return;
  }

  // Airplane is OFF
  if (tileAir) tileAir.classList.remove('active');
  if (tileAirStatus) tileAirStatus.textContent = 'Off';
  if (tileAirBadge) tileAirBadge.textContent = 'OFF';

  if (wifiList) wifiList.style.opacity = '1';

  // Wi-Fi
  if (networkSettings.wifi) {
    if (trayWifiIcon) trayWifiIcon.innerHTML = '<img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:18px;height:18px;vertical-align:middle;">';
    if (tileWifi) tileWifi.classList.add('active');
    if (tileWifiStatus) tileWifiStatus.textContent = networkSettings.currentSsid ? networkSettings.currentSsid.split(' ')[0] : 'Connected';
    if (tileWifiBadge) tileWifiBadge.textContent = 'ON';
  } else {
    if (trayWifiIcon) trayWifiIcon.innerHTML = '<img src="assets/icons/networks/wi-fi.svg" alt="Wi-Fi" style="width:18px;height:18px;vertical-align:middle;opacity:0.35;">';
    if (tileWifi) tileWifi.classList.remove('active');
    if (tileWifiStatus) tileWifiStatus.textContent = 'Turned Off';
    if (tileWifiBadge) tileWifiBadge.textContent = 'OFF';
  }

  // Bluetooth
  if (networkSettings.bluetooth) {
    if (tileBt) tileBt.classList.add('active');
    if (tileBtStatus) tileBtStatus.textContent = 'Student Headset';
    if (tileBtBadge) tileBtBadge.textContent = 'ON';
  } else {
    if (tileBt) tileBt.classList.remove('active');
    if (tileBtStatus) tileBtStatus.textContent = 'Off';
    if (tileBtBadge) tileBtBadge.textContent = 'OFF';
  }

  // Guard
  if (networkSettings.guard) {
    if (tileGuard) tileGuard.classList.add('active');
    if (tileGuardStatus) tileGuardStatus.textContent = 'Secured';
    if (tileGuardBadge) tileGuardBadge.textContent = 'ON';
  } else {
    if (tileGuard) tileGuard.classList.remove('active');
    if (tileGuardStatus) tileGuardStatus.textContent = 'Paused';
    if (tileGuardBadge) tileGuardBadge.textContent = 'OFF';
  }

  // Anti-Virus Quick Tile
  const tileAv = document.getElementById('tile-antivirus');
  const tileAvStatus = document.getElementById('tile-antivirus-status');
  const tileAvBadge = document.getElementById('tile-antivirus-badge');
  if (tileAv) {
    if (gameState.antivirusProtection) {
      tileAv.classList.add('active');
      if (tileAvStatus) tileAvStatus.textContent = 'Real-Time On';
      if (tileAvBadge) tileAvBadge.textContent = 'ON';
    } else {
      tileAv.classList.remove('active');
      if (tileAvStatus) tileAvStatus.textContent = 'Turned Off';
      if (tileAvBadge) tileAvBadge.textContent = 'OFF';
    }
  }

  // Live sync open browser with network status
  if (typeof appState !== 'undefined' && appState.browser && appState.browser.open) {
    if (typeof renderActiveTab === 'function') {
      renderActiveTab();
    }
  }
}

function toggleWifiSetting() {
  if (networkSettings.airplane) {
    showToast('✈️ Turn off Airplane Mode first to enable Wi-Fi.', 'warning');
    return;
  }
  networkSettings.wifi = !networkSettings.wifi;
  updateNetworkUI();
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast(networkSettings.wifi ? '📶 Wi-Fi turned On. Connected to CYBER-NET.' : '📶 Wi-Fi turned Off.', networkSettings.wifi ? 'success' : 'info');
}

function toggleBluetoothSetting() {
  if (networkSettings.airplane) {
    showToast('✈️ Turn off Airplane Mode first to enable Bluetooth.', 'warning');
    return;
  }
  networkSettings.bluetooth = !networkSettings.bluetooth;
  updateNetworkUI();
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast(networkSettings.bluetooth ? '📡 Bluetooth On • Student Headset Connected.' : '📡 Bluetooth Off.', networkSettings.bluetooth ? 'success' : 'info');
}

function toggleAirplaneSetting() {
  networkSettings.airplane = !networkSettings.airplane;
  updateNetworkUI();
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast(networkSettings.airplane ? '✈️ Airplane Mode Activated — Wireless transmitters suspended.' : '✈️ Airplane Mode Disabled — Wireless restored.', networkSettings.airplane ? 'warning' : 'success');
}

function toggleAntiVirusSetting() {
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  toggleAntiVirusProtection();
}

function toggleGuardSetting() {
  networkSettings.guard = !networkSettings.guard;
  updateNetworkUI();
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast(networkSettings.guard ? '🛡️ Cyber Defense Shield Active.' : '⚠️ Cyber Defense Shield Paused.', networkSettings.guard ? 'success' : 'warning');
}

function toggleCybernetConnect() {
  const btn = document.getElementById('btn-cybernet-action');
  const cyberItem = document.getElementById('wifi-item-cybernet');
  if (networkSettings.currentSsid === 'CYBER-NET (WPA3-Enterprise)') {
    networkSettings.currentSsid = null;
    if (btn) { btn.textContent = 'Connect'; btn.className = 'wifi-net-action-btn connect'; }
    if (cyberItem) cyberItem.classList.remove('connected');
    showToast('🔌 Disconnected from CYBER-NET.', 'info');
  } else {
    networkSettings.currentSsid = 'CYBER-NET (WPA3-Enterprise)';
    if (btn) { btn.textContent = 'Disconnect'; btn.className = 'wifi-net-action-btn disconnect'; }
    if (cyberItem) cyberItem.classList.add('connected');
    showToast('📶 Connected to CYBER-NET (WPA3-Enterprise).', 'success');
  }
  updateNetworkUI();
}

function connectToWifi(ssid) {
  networkSettings.currentSsid = ssid;
  showToast(`📶 Connected to ${ssid}. Encrypted gateway established.`, 'success');
  updateNetworkUI();
}

function warnPublicWifi() {
  if (typeof AudioManager !== 'undefined') AudioManager.playAlert();
  showToast('⚠️ SECURITY WARNING: Free_Public_Unsecured lacks encryption! Man-in-the-Middle (MITM) attacks can intercept passwords. Never connect without a VPN.', 'warning');
}

function refreshWifiNetworks() {
  const btn = document.querySelector('.flyout-refresh-btn');
  if (btn) btn.textContent = '⏳ Scanning...';
  if (typeof AudioManager !== 'undefined') AudioManager.playSliderTick();
  setTimeout(() => {
    if (btn) btn.textContent = '🔄 Scan';
    showToast('📡 Wi-Fi scan complete. 4 access points in range.', 'info');
  }, 600);
}

// ═══════════════════════════════════════════════════════════
// CALENDAR & NOTIFICATIONS FLYOUT CONTROLS
// ═══════════════════════════════════════════════════════════

let calCurrentDate = new Date();
let calSelectedDay = calCurrentDate.getDate();

function toggleCalendarFlyout(event) {
  if (event) event.stopPropagation();
  if (typeof AudioManager !== 'undefined') AudioManager.unlock();
  const flyout = document.getElementById('desktop-calendar-flyout');
  const clockBtn = document.getElementById('taskbar-clock-btn');
  if (!flyout) return;

  const isHidden = flyout.classList.contains('hidden');
  if (isHidden) {
    closeVolumeFlyout();
    closeNetworkFlyout();
    const startMenu = document.getElementById('desktop-start-menu');
    if (startMenu && !startMenu.classList.contains('hidden')) toggleStartMenu();

    flyout.classList.remove('hidden');
    if (clockBtn) clockBtn.classList.add('active');
    updateClock();
    renderCalendar(calCurrentDate.getFullYear(), calCurrentDate.getMonth());
    if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  } else {
    closeCalendarFlyout();
  }
}

function closeCalendarFlyout(event) {
  if (event) event.stopPropagation();
  const flyout = document.getElementById('desktop-calendar-flyout');
  const clockBtn = document.getElementById('taskbar-clock-btn');
  if (flyout) flyout.classList.add('hidden');
  if (clockBtn) clockBtn.classList.remove('active');
}

function renderCalendar(year, month) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const titleEl = document.getElementById('cal-nav-month-year');
  if (titleEl) titleEl.textContent = `${monthNames[month]} ${year}`;

  const gridEl = document.getElementById('cal-grid');
  if (!gridEl) return;
  gridEl.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const realToday = new Date();
  const isCurrentMonth = (realToday.getFullYear() === year && realToday.getMonth() === month);

  // Previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day other-month';
    dayEl.textContent = dayNum;
    gridEl.appendChild(dayEl);
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';
    if (isCurrentMonth && d === realToday.getDate()) {
      dayEl.classList.add('today');
    } else if (d === calSelectedDay) {
      dayEl.classList.add('selected');
    }
    dayEl.textContent = d;
    dayEl.onclick = () => {
      calSelectedDay = d;
      renderCalendar(year, month);
      if (typeof AudioManager !== 'undefined') AudioManager.playSliderTick();
    };
    gridEl.appendChild(dayEl);
  }

  // Next month padding days to fill full week rows
  const totalSlots = firstDayIndex + daysInMonth;
  const remaining = (7 - (totalSlots % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day other-month';
    dayEl.textContent = n;
    gridEl.appendChild(dayEl);
  }
}

function navCalendar(delta) {
  calCurrentDate.setMonth(calCurrentDate.getMonth() + delta);
  renderCalendar(calCurrentDate.getFullYear(), calCurrentDate.getMonth());
  if (typeof AudioManager !== 'undefined') AudioManager.playSliderTick();
}

function resetCalendarToToday() {
  calCurrentDate = new Date();
  calSelectedDay = calCurrentDate.getDate();
  renderCalendar(calCurrentDate.getFullYear(), calCurrentDate.getMonth());
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast('📅 Jumped to today\'s date.', 'info');
}

// Notifications handling
function dismissNotification(id) {
  const card = document.getElementById(id);
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
    setTimeout(() => {
      card.remove();
      updateNotifCount();
    }, 200);
  }
}

function clearAllNotifications() {
  const list = document.getElementById('notif-list');
  if (list) {
    list.innerHTML = `
      <div style="text-align:center;padding:24px 10px;color:var(--text-muted);font-size:12px;">
        <div style="font-size:24px;margin-bottom:6px;">🛡️</div>
        <div>No new notifications</div>
        <div style="font-size:10px;margin-top:2px;color:var(--accent-cyan);">Cyber Crime Bureau terminal secure</div>
      </div>`;
  }
  const badge = document.getElementById('notif-count-badge');
  if (badge) badge.textContent = '0';
  if (typeof AudioManager !== 'undefined') AudioManager.playMouseClick();
  showToast('🧹 All notifications cleared.', 'info');
}

function updateNotifCount() {
  const list = document.getElementById('notif-list');
  const count = list ? list.querySelectorAll('.notif-card').length : 0;
  const badge = document.getElementById('notif-count-badge');
  if (badge) badge.textContent = count;
  if (count === 0) {
    clearAllNotifications();
  }
}

// ═══════════════════════════════════════════════════════════
// WINDOWS START MENU CONTROLS
// ═══════════════════════════════════════════════════════════

function toggleStartMenu(event) {
  if (event) event.stopPropagation();
  if (typeof AudioManager !== 'undefined') AudioManager.unlock();
  const menu = document.getElementById('desktop-start-menu');
  const startBtn = document.getElementById('start-btn');
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    closeVolumeFlyout();
    closeNetworkFlyout();
    closeCalendarFlyout();
    menu.classList.remove('hidden');
    if (startBtn) startBtn.classList.add('active');
    if (typeof AudioManager !== 'undefined') AudioManager.playWindowSound();

    const input = document.getElementById('start-search-input');
    if (input) {
      input.value = '';
      filterStartMenuApps('');
      setTimeout(() => input.focus(), 60);
    }
    const nameInput = document.getElementById('exam-input-name');
    const nameDisplay = document.getElementById('start-user-name');
    if (nameDisplay && nameInput && nameInput.value.trim()) {
      nameDisplay.textContent = nameInput.value.trim();
    }
  } else {
    closeStartMenu();
  }
}

function closeStartMenu(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('desktop-start-menu');
  const startBtn = document.getElementById('start-btn');
  if (menu) menu.classList.add('hidden');
  if (startBtn) startBtn.classList.remove('active');

  const pMenu = document.getElementById('start-power-dropdown');
  if (pMenu) pMenu.classList.add('hidden');
}

function filterStartMenuApps(query) {
  const q = query.toLowerCase().trim();
  const tiles = document.querySelectorAll('.start-app-tile');
  tiles.forEach(tile => {
    const text = tile.textContent.toLowerCase();
    tile.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
  });
}

function startMenuOpenApp(appName) {
  closeStartMenu();
  if (typeof AudioManager !== 'undefined') {
    AudioManager.unlock();
    if (!isAppLocked(appName)) {
      AudioManager.playWindowSound(true);
    } else {
      AudioManager.playWrong();
    }
  }
  taskbarClick(appName);
}

function startMenuAction(action) {
  closeStartMenu();
  if (typeof AudioManager !== 'undefined') {
    AudioManager.unlock();
    AudioManager.playWindowSound(true);
  }
  if (action === 'exam') {
    showOverlay('overlay-pre-assessment');
  } else if (action === 'volume') {
    toggleVolumeFlyout();
  } else if (action === 'notes' || action === 'sticky_note') {
    toggleStickyNote();
  }
}

function startMenuFileClick(fileType) {
  closeStartMenu();
  if (typeof AudioManager !== 'undefined') {
    AudioManager.unlock();
    AudioManager.playWindowSound(true);
  }
  if (fileType === 'malware_sample') {
    showToast('📄 Opened suspicious_invoice.pdf.exe in analysis buffer!', 'info');
  } else if (fileType === 'case_log') {
    showToast('📋 Case 001 log loaded.', 'info');
  }
}

function togglePowerMenu(event) {
  if (event) event.stopPropagation();
  const pMenu = document.getElementById('start-power-dropdown');
  if (pMenu) pMenu.classList.toggle('hidden');
}

function startMenuPower(action) {
  closeStartMenu();
  if (action === 'restart') {
    restartEntireGame();
  } else if (action === 'lock') {
    showOverlay('overlay-title-menu');
    showToast('🔒 Terminal Locked.', 'info');
  } else if (action === 'title') {
    showOverlay('overlay-title-menu');
  }
}

function onMasterVolumeInput(val) {
  const num = parseInt(val, 10);
  AudioManager.settings.masterVolume = num;
  if (AudioManager.settings.masterMuted && num > 0) {
    AudioManager.settings.masterMuted = false;
  }
  AudioManager.saveSettings();
  updateVolumeUI();
  AudioManager.playSliderTick();
}

function onClicksVolumeInput(val) {
  const num = parseInt(val, 10);
  AudioManager.settings.clicksVolume = num;
  if (AudioManager.settings.clicksMuted && num > 0) {
    AudioManager.settings.clicksMuted = false;
  }
  AudioManager.saveSettings();
  updateVolumeUI();
  AudioManager.playMouseClick();
}

function onSfxVolumeInput(val) {
  const num = parseInt(val, 10);
  AudioManager.settings.sfxVolume = num;
  if (AudioManager.settings.sfxMuted && num > 0) {
    AudioManager.settings.sfxMuted = false;
  }
  AudioManager.saveSettings();
  updateVolumeUI();
  AudioManager.playSliderTick();
}

function toggleMasterMute() {
  AudioManager.settings.masterMuted = !AudioManager.settings.masterMuted;
  AudioManager.saveSettings();
  updateVolumeUI();
  if (!AudioManager.settings.masterMuted) {
    AudioManager.playMouseClick();
  }
}

function toggleClicksMute() {
  AudioManager.settings.clicksMuted = !AudioManager.settings.clicksMuted;
  AudioManager.saveSettings();
  updateVolumeUI();
  if (!AudioManager.settings.clicksMuted) {
    AudioManager.playMouseClick();
  }
}

function toggleSfxMute() {
  AudioManager.settings.sfxMuted = !AudioManager.settings.sfxMuted;
  AudioManager.saveSettings();
  updateVolumeUI();
  if (!AudioManager.settings.sfxMuted) {
    AudioManager.playChime(true);
  }
}

function onTypingVolumeInput(val) {
  const num = parseInt(val, 10);
  AudioManager.settings.typingVolume = num;
  if (AudioManager.settings.typingMuted && num > 0) {
    AudioManager.settings.typingMuted = false;
  }
  AudioManager.saveSettings();
  updateVolumeUI();
  AudioManager.playTypingKey();
}

function toggleTypingMute() {
  AudioManager.settings.typingMuted = !AudioManager.settings.typingMuted;
  AudioManager.saveSettings();
  updateVolumeUI();
  if (!AudioManager.settings.typingMuted) {
    AudioManager.playTypingKey();
  }
}

function testMouseClickSound() {
  AudioManager.unlock();
  AudioManager.playMouseClick();
}

function testChimeSound() {
  AudioManager.unlock();
  AudioManager.playChime(true);
}

function testTypingSound() {
  AudioManager.unlock();
  AudioManager.playTypingKey();
}

function testCorrectSound() {
  AudioManager.unlock();
  AudioManager.playCorrect();
}

function testWrongSound() {
  AudioManager.unlock();
  AudioManager.playWrong();
}

function testMissionCompleteSound() {
  AudioManager.unlock();
  AudioManager.playMissionComplete();
}

// Close flyouts when clicking outside
document.addEventListener('click', (e) => {
  // Volume flyout
  const flyout = document.getElementById('desktop-volume-flyout');
  const trayBtn = document.getElementById('tray-volume-btn');
  if (flyout && !flyout.classList.contains('hidden')) {
    if (!flyout.contains(e.target) && (!trayBtn || !trayBtn.contains(e.target))) {
      closeVolumeFlyout();
    }
  }

  // Network & Quick Settings flyout
  const netFlyout = document.getElementById('desktop-network-flyout');
  const wifiBtn = document.getElementById('tray-wifi-btn');
  if (netFlyout && !netFlyout.classList.contains('hidden')) {
    if (!netFlyout.contains(e.target) && (!wifiBtn || !wifiBtn.contains(e.target))) {
      closeNetworkFlyout();
    }
  }

  // Calendar & Notifications flyout
  const calFlyout = document.getElementById('desktop-calendar-flyout');
  const clockBtn = document.getElementById('taskbar-clock-btn');
  if (calFlyout && !calFlyout.classList.contains('hidden')) {
    if (!calFlyout.contains(e.target) && (!clockBtn || !clockBtn.contains(e.target))) {
      closeCalendarFlyout();
    }
  }

  // Start Power Dropdown
  const pMenu = document.getElementById('start-power-dropdown');
  const pWrap = document.querySelector('.start-power-wrap');
  if (pMenu && !pMenu.classList.contains('hidden')) {
    if (!pWrap || !pWrap.contains(e.target)) {
      pMenu.classList.add('hidden');
    }
  }
});

// Automatic tactile mouse click sound on interactive elements
document.addEventListener('pointerdown', (e) => {
  if (typeof AudioManager !== 'undefined') {
    AudioManager.unlock();

    // Prevent double clicking inside the volume slider thumb itself during drag
    if (e.target && e.target.classList && e.target.classList.contains('cyber-slider')) {
      return;
    }

    const interactive = e.target.closest(
      'button, a, input, select, textarea, label, [role="button"], ' +
      '.desktop-icon, .taskbar-app-btn, .tray-btn, .tray-icon, .win-btn, .tab-item, ' +
      '.browser-tab, .email-item, .email-row, .choice-card, .btn-primary, ' +
      '.btn-ghost, .btn-danger, .btn-success, .btn-title-play, .btn-title-exit, ' +
      '.vn-btn, .sn-action-btn, .sticky-note-tape, .custom-checkbox, .flag-pill, ' +
      '.flag-opt, .link-hover-btn, .vol-test-btn, .file-item, .av-btn'
    );

    if (interactive) {
      AudioManager.playMouseClick();
    }
  }
}, true);

// Keyboard typing sound on input/textarea keydown
document.addEventListener('keydown', (e) => {
  if (typeof AudioManager === 'undefined') return;
  const tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') {
    // Ignore modifier-only keys, arrows, shift, ctrl, alt, meta, tab, escape
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
      AudioManager.playTypingKey();
    }
  }
}, true);

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

// Start game with Title Menu on load
window.addEventListener('DOMContentLoaded', () => {
  initTitleParticles();
  initPreAssessment();
  showOverlay('overlay-title-menu');
  renderEmailList();
  initStickyNote();
  updateAppLockStates();
  updateVolumeUI();
});

