// PSWIN INDIA - CLEAN WHITE FORM CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  // Visitor Counter
  try {
    const curVisits = parseInt(localStorage.getItem('pswin_total_visits') || '0', 10) + 1;
    localStorage.setItem('pswin_total_visits', curVisits);
  } catch(e){}

  const stepIndicators = [
    document.getElementById('stepInd1'),
    document.getElementById('stepInd2'),
    document.getElementById('stepInd3'),
    document.getElementById('stepInd4')
  ];

  const stepSections = [
    document.getElementById('stepSection1'),
    document.getElementById('stepSection2'),
    document.getElementById('stepSection3'),
    document.getElementById('stepSection4')
  ];

  let currentStep = 1;

  // 5 GTA Lore Questions
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
      options: ["California", "Texas", "Florida", "Nevada"],
      correct: 2
    },
    {
      q: "Rockstar Games ne GTA VI ka first official trailer kis saal launch kiya tha?",
      options: ["2021", "2022", "2023", "2024"],
      correct: 2
    },
    {
      q: "GTA Franchise ka developer aur publisher kaunsa studio hai?",
      options: ["Ubisoft", "Rockstar Games", "Electronic Arts", "Bethesda"],
      correct: 1
    }
  ];

  let currentQIndex = 0;
  let quizScore = 0;
  let questionTimeLeft = 15;
  let questionTimerInterval = null;
  let quizStartTime = null;
  let quizTotalTimeSeconds = 0;

  // Step Navigation
  window.goToStep = function(step) {
    if (step < 1 || step > 4) return;

    // Step 1 Validation (Details & Address)
    if (step === 2 && currentStep === 1) {
      const name = document.getElementById('inputName').value.trim();
      const phone = document.getElementById('inputPhone').value.trim();
      const address = document.getElementById('inputAddress').value.trim();
      const city = document.getElementById('inputCity').value.trim();
      const state = document.getElementById('inputState').value.trim();
      const pincode = document.getElementById('inputPincode').value.trim();

      if (!name || name.length < 2) {
        alert("Kripya apna pura naam enter karein!");
        document.getElementById('inputName').focus();
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        alert("Kripya 10-digit ka valid mobile number dalein!");
        document.getElementById('inputPhone').focus();
        return;
      }
      if (!address || address.length < 4) {
        alert("Kripya shipping delivery address dalein!");
        document.getElementById('inputAddress').focus();
        return;
      }
      if (!city || !state) {
        alert("Kripya City aur State enter karein!");
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        alert("Kripya 6-digit ka area pincode dalein!");
        document.getElementById('inputPincode').focus();
        return;
      }
    }

    // Step 2 Validation (Payment UTR)
    if (step === 3 && currentStep === 2) {
      const utr = document.getElementById('inputUTR').value.trim();
      if (!utr || utr.length < 8) {
        alert("Kripya payment complete karke UPI app se 12-digit UTR number dalein!");
        document.getElementById('inputUTR').focus();
        return;
      }
      // Start Speed Quiz
      startQuizChallenge();
    }

    currentStep = step;

    // Update Indicators
    stepIndicators.forEach((ind, i) => {
      if (!ind) return;
      ind.classList.remove('active', 'done');
      if (i + 1 < step) ind.classList.add('done');
      if (i + 1 === step) ind.classList.add('active');
    });

    // Update Sections
    stepSections.forEach((sec, i) => {
      if (!sec) return;
      if (i + 1 === step) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    const formCard = document.getElementById('formCard');
    if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
  };

  // Start Speed Quiz
  function startQuizChallenge() {
    try {
      const qz = parseInt(localStorage.getItem('pswin_total_quizzes') || '0', 10) + 1;
      localStorage.setItem('pswin_total_quizzes', qz);
    } catch(e){}

    quizScore = 0;
    currentQIndex = 0;
    quizStartTime = Date.now();
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    if (currentQIndex >= quizQuestions.length) {
      finishQuizAndSubmit();
      return;
    }

    const qData = quizQuestions[currentQIndex];
    const qNumEl = document.getElementById('quizQNum');
    const qTextEl = document.getElementById('quizQText');
    const timerSecEl = document.getElementById('quizTimerSec');

    if (qNumEl) qNumEl.textContent = `Question ${currentQIndex + 1} of ${quizQuestions.length}`;
    if (qTextEl) qTextEl.textContent = qData.q;

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
      btn.innerHTML = `<span><strong style="color:var(--accent-primary); margin-right:8px;">${letters[idx]}.</strong> ${opt}</span>`;
      btn.onclick = () => chooseOption(idx);
      optionsContainer.appendChild(btn);
    });
  }

  function chooseOption(chosenIdx) {
    clearInterval(questionTimerInterval);
    const qData = quizQuestions[currentQIndex];
    const optionsContainer = document.getElementById('quizOptionsContainer');
    const buttons = optionsContainer ? optionsContainer.querySelectorAll('.quiz-opt-btn') : [];

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';

      if (idx === qData.correct) {
        btn.classList.add('correct-ans');
        btn.innerHTML += ' <span style="color:#059669; font-weight:800;">✓</span>';
      } else if (idx === chosenIdx) {
        btn.classList.add('wrong-ans');
        btn.innerHTML += ' <span style="color:#dc2626; font-weight:800;">✗</span>';
      }
    });

    if (chosenIdx === qData.correct) {
      quizScore++;
      if (window.synthAudio) window.synthAudio.playSuccess();
    } else {
      if (window.synthAudio) window.synthAudio.playWrong();
    }

    setTimeout(() => {
      currentQIndex++;
      renderCurrentQuestion();
    }, 1000);
  }

  // Quiz Finished -> Submit & Show Ticket
  function finishQuizAndSubmit() {
    const totalTimeMs = Date.now() - quizStartTime;
    quizTotalTimeSeconds = parseFloat((totalTimeMs / 1000).toFixed(1));

    const name = document.getElementById('inputName').value.trim();
    const phone = document.getElementById('inputPhone').value.trim();
    const address = document.getElementById('inputAddress').value.trim();
    const city = document.getElementById('inputCity').value.trim();
    const state = document.getElementById('inputState').value.trim();
    const pincode = document.getElementById('inputPincode').value.trim();
    const utr = document.getElementById('inputUTR').value.trim();

    const saved = JSON.parse(localStorage.getItem('gta6_challenge_entries') || '[]');
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const refId = `GTA6-PS5-${randomHex}`;

    const newEntry = {
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
      timestamp: new Date().toISOString()
    };

    saved.push(newEntry);
    localStorage.setItem('gta6_challenge_entries', JSON.stringify(saved));
    localStorage.setItem('last_registered_ref', refId);

    showSuccessTicket(newEntry);
  }

  function showSuccessTicket(entry) {
    if (window.synthAudio) window.synthAudio.playSuccess();

    const refEl = document.getElementById('ticketPassRef');
    const noEl = document.getElementById('ticketPassNo');
    const nameEl = document.getElementById('ticketPassName');
    const cityEl = document.getElementById('ticketPassCity');
    const scoreEl = document.getElementById('ticketPassScore');

    if (refEl) refEl.textContent = entry.id;
    if (noEl) noEl.textContent = `#VIP-${String(entry.ticketNo).padStart(4, '0')}`;
    if (nameEl) nameEl.textContent = entry.name;
    if (cityEl) cityEl.textContent = `${entry.city}, ${entry.state || ''}`;
    if (scoreEl) scoreEl.textContent = `${entry.score}/5 (${entry.timeTaken}s)`;

    window.goToStep(4);
  }

  // Copy Reference Code
  const copyBtn = document.getElementById('btnCopyRef');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.getElementById('ticketPassRef').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = '✓ COPIED TO CLIPBOARD!';
        setTimeout(() => { copyBtn.textContent = '📋 COPY REFERENCE CODE'; }, 2000);
      });
    });
  }

  // Print Pass
  const printBtn = document.getElementById('btnPrintPass');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Input Sanitization
  const phoneInp = document.getElementById('inputPhone');
  if (phoneInp) {
    phoneInp.addEventListener('input', () => {
      phoneInp.value = phoneInp.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
  }

  const pincodeInp = document.getElementById('inputPincode');
  if (pincodeInp) {
    pincodeInp.addEventListener('input', () => {
      pincodeInp.value = pincodeInp.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
  }

  const utrInp = document.getElementById('inputUTR');
  if (utrInp) {
    utrInp.addEventListener('input', () => {
      utrInp.value = utrInp.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase().slice(0, 16);
    });
  }

  // Track Function
  const trackBtn = document.getElementById('btnTrackSearch');
  const trackInp = document.getElementById('trackInput');
  const trackRes = document.getElementById('trackResultCard');

  if (trackBtn) trackBtn.addEventListener('click', performTrackSearch);
  if (trackInp) {
    trackInp.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performTrackSearch();
    });
  }

  function performTrackSearch() {
    const q = (trackInp.value || '').trim();
    if (!q) {
      alert("Kripya 10-digit mobile number ya Reference Code dalein!");
      return;
    }

    const cleanQ = q.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
    const cleanDigits = q.replace(/[^0-9]/g, '');

    const saved = JSON.parse(localStorage.getItem('gta6_challenge_entries') || '[]');
    const found = saved.find(s => {
      const matchId = s.id && s.id.replace(/[^0-9a-zA-Z]/g, '').toUpperCase().includes(cleanQ);
      const matchPhone = cleanDigits.length >= 6 && s.phone && s.phone.includes(cleanDigits);
      return matchId || matchPhone;
    });

    if (found) {
      if (trackRes) {
        trackRes.style.display = 'block';
        document.getElementById('trackResId').textContent = found.id;
        document.getElementById('trackResTicket').textContent = `#VIP-${String(found.ticketNo).padStart(4, '0')}`;
        document.getElementById('trackResName').textContent = found.name;
        document.getElementById('trackResPhone').textContent = found.phone.slice(0,2) + '******' + found.phone.slice(-2);
        document.getElementById('trackResCity').textContent = `${found.city}, ${found.state || ''}`;
        document.getElementById('trackResScore').textContent = `${found.score}/5 (${found.timeTaken}s)`;
        trackRes.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    alert("❌ Koi entry nahi mili. Kripya apna valid Reference Code ya Mobile number check karein!");
  }
});
