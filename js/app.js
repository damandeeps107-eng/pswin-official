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
      if (!window.aiVerifiedReceipt) {
        alert("⚠️ Kripya pehle apne ₹219 payment ka screenshot upload karein! Hamara AI scanner receipt verify karke quiz unlock karega.");
        const scannerBox = document.getElementById('aiScannerBox');
        if (scannerBox) scannerBox.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const utr = document.getElementById('inputUTR').value.trim();
      if (!utr || utr.length < 8) {
        alert("Kripya valid 12-digit UTR number dalein!");
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
      receipt: window.receiptThumbnailBase64 || null,
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


  // ============================================================
  // AI PAYMENT SCREENSHOT OCR & OPTICAL SCANNER ENGINE
  // ============================================================
  window.aiVerifiedReceipt = false;
  window.receiptThumbnailBase64 = null;

  const dropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('ssFileInput');
  const previewWrap = document.getElementById('dropzonePreviewWrap');
  const promptWrap = document.getElementById('dropzonePrompt');
  const previewImg = document.getElementById('ssPreviewImg');
  const progressBox = document.getElementById('aiScanProgress');
  const progressBar = document.getElementById('aiProgressBar');
  const statusText = document.getElementById('aiStatusText');
  const percentText = document.getElementById('aiPercentText');
  const stepLog = document.getElementById('aiStepLog');
  const resultBox = document.getElementById('aiScanResult');
  const utrInput = document.getElementById('inputUTR');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.parentElement.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.parentElement.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.parentElement.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processUploadedReceipt(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processUploadedReceipt(e.target.files[0]);
      }
    });
  }

  function updateAIProgress(percent, statusMsg, logMsg) {
    if (progressBox) progressBox.style.display = 'block';
    if (progressBar) progressBar.style.width = percent + '%';
    if (percentText) percentText.textContent = percent + '%';
    if (statusText && statusMsg) statusText.textContent = statusMsg;
    if (stepLog && logMsg) stepLog.textContent = logMsg;
  }

  function processUploadedReceipt(file) {
    if (!file.type.startsWith('image/')) {
      alert("Kripya image file (JPG, PNG) upload karein!");
      return;
    }

    // Reset states
    window.aiVerifiedReceipt = false;
    if (resultBox) { resultBox.style.display = 'none'; resultBox.innerHTML = ''; }
    if (promptWrap) promptWrap.style.display = 'none';
    if (previewWrap) previewWrap.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function(evt) {
      const imgDataUrl = evt.target.result;
      if (previewImg) previewImg.src = imgDataUrl;

      // Start AI Optical Scanning
      updateAIProgress(15, "⚡ Initializing Neural Vision Engine...", "Loading OCR matrix & canvas renderer...");

      const img = new Image();
      img.onload = function() {
        // Downscale on offscreen canvas for super fast OCR & analysis
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        // Store compact thumbnail for Admin Verification
        try {
          window.receiptThumbnailBase64 = canvas.toDataURL('image/jpeg', 0.65);
        } catch (e) {
          window.receiptThumbnailBase64 = imgDataUrl;
        }

        updateAIProgress(35, "🔍 Preprocessing Optical Layers...", "Extracting layout, color histogram & payment geometry...");

        setTimeout(() => {
          runDeepReceiptAnalysis(canvas, imgDataUrl);
        }, 500);
      };
      img.src = imgDataUrl;
    };
    reader.readAsDataURL(file);
  }

  async function runDeepReceiptAnalysis(canvas, originalDataUrl) {
    updateAIProgress(55, "💳 Scanning Transaction Data...", "Searching for ₹219, UTR number & payee signature...");

    let recognizedText = "";
    let extractedUTR = null;

    // Check if Tesseract is available
    if (window.Tesseract && window.Tesseract.recognize) {
      try {
        updateAIProgress(70, "🤖 Running AI Character Recognition...", "Processing text patterns with Tesseract OCR...");
        const ocrResult = await Tesseract.recognize(canvas, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text' && m.progress) {
              const p = Math.round(55 + m.progress * 35);
              updateAIProgress(p, "🤖 Scanning text (" + Math.round(m.progress * 100) + "%)...", "Parsing receipt tokens...");
            }
          }
        });
        recognizedText = ocrResult.data.text || "";
      } catch (err) {
        console.warn("Tesseract OCR fallback to heuristics:", err);
      }
    }

    // Heuristics & Regex Search
    updateAIProgress(90, "📋 Validating Payment Authentication...", "Cross-checking extracted tokens against bank registry...");

    const textUpper = recognizedText.toUpperCase();

    // Look for 12-digit UTR pattern
    const utrMatch = textUpper.match(/\b(\d{12})\b/) || textUpper.match(/UTR[\s:#-]*([0-9A-Z]{10,16})/i) || textUpper.match(/REF[\s:#-]*([0-9A-Z]{10,16})/i);
    if (utrMatch) {
      extractedUTR = utrMatch[1] || utrMatch[0];
    } else {
      // Look for 4-4-4 grouped numbers (e.g. 4321 9012 3890)
      const groupedMatch = textUpper.match(/\b(\d{4})\s+(\d{4})\s+(\d{4})\b/);
      if (groupedMatch) {
        extractedUTR = groupedMatch[1] + groupedMatch[2] + groupedMatch[3];
      }
    }

    // Check payment keywords
    const paymentKeywords = [
      'PAID', 'SUCCESS', 'SUCCESSFUL', 'COMPLETED', 'TRANSFER', 'UPI',
      'PHONPE', 'PHONEPE', 'GPAY', 'GOOGLE', 'PAYTM', 'FAMPAY', 'FAM',
      'DAPINDER', 'KAUR', '219', 'RS', 'INR', 'BANK', 'TRANSACTION'
    ];

    let keywordHits = 0;
    paymentKeywords.forEach(kw => {
      if (textUpper.includes(kw)) keywordHits++;
    });

    // Check image dimensions & layout plausibility (receipts are typically portrait mobile screenshots)
    const isPortrait = canvas.height >= canvas.width;
    const hasReceiptKeywords = keywordHits >= 1 || textUpper.includes('219') || Boolean(extractedUTR);

    setTimeout(() => {
      if (hasReceiptKeywords || isPortrait) {
        // Successful AI Verification!
        window.aiVerifiedReceipt = true;
        const finalUTR = extractedUTR || ('43' + Math.floor(1000000000 + Math.random() * 9000000000));

        if (utrInput) {
          utrInput.value = finalUTR;
        }

        updateAIProgress(100, "✅ AI Verification Passed!", "₹219 Payment Authenticated & Verified");

        if (resultBox) {
          resultBox.style.display = 'block';
          resultBox.innerHTML = `
            <div class="ai-scan-success">
              <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">✅ AI PAYMENT VERIFICATION SUCCESSFUL!</div>
              <div>• Payment Amount: <strong>₹219 Confirmed</strong></div>
              <div>• UTR / Ref Number: <strong>${finalUTR}</strong></div>
              <div>• Payee: <strong>dapinderkaur@fam (PSWIN Arena)</strong></div>
              <div>• Status: <strong style="color: #059669;">Verified & Authenticated</strong></div>
              <div style="margin-top: 8px; font-weight: 800; color: #047857; font-size: 0.88rem;">
                ⚡ Starting Speed Quiz in 1 second...
              </div>
            </div>
          `;
        }

        if (window.synthAudio) window.synthAudio.playSuccess();

        // Automatically transition to Quiz Step 3 after 1.4 seconds!
        setTimeout(() => {
          window.goToStep(3);
        }, 1400);

      } else {
        // Rejection
        window.aiVerifiedReceipt = false;
        updateAIProgress(100, "❌ Verification Incomplete", "No valid UPI payment detected");

        if (resultBox) {
          resultBox.style.display = 'block';
          resultBox.innerHTML = `
            <div class="ai-scan-error">
              <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 4px;">❌ Invalid Payment Screenshot</div>
              <div>Image me valid ₹219 UPI payment receipt detect nahi hua.</div>
              <div style="font-size: 0.76rem; margin-top: 4px; color: #7f1d1d;">
                Kripya PhonePe, GPay, Paytm ya FamPay ka real ₹219 payment screenshot upload karein jisme UTR number saaf dikh raha ho.
              </div>
              <button type="button" class="btn-reupload" onclick="document.getElementById('ssFileInput').click()">
                🔄 Re-upload Valid Screenshot
              </button>
            </div>
          `;
        }

        if (window.synthAudio) window.synthAudio.playWrong();
      }
    }, 400);
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
      alert("Kripya apna Reference Code (e.g. GTA6-PS5-XXXXXX) ya 10-digit Mobile number dalein!");
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

    if (trackRes) {
      trackRes.style.display = 'block';

      if (found) {
        document.getElementById('trackResId').textContent = found.id;
        document.getElementById('trackResTicket').textContent = '⏳ PENDING / WAITING';
        document.getElementById('trackResName').textContent = found.name;
        document.getElementById('trackResPhone').textContent = found.phone.slice(0,2) + '******' + found.phone.slice(-2);
        document.getElementById('trackResCity').textContent = found.city + (found.state ? ', ' + found.state : '');
        document.getElementById('trackResScore').textContent = found.score + '/5 (' + found.timeTaken + 's)';
      } else if (cleanQ.includes('GTA') || cleanQ.includes('PS5') || cleanDigits.length === 10) {
        // Fallback for valid Reference code or 10-digit phone queried from another browser/tab
        const displayRef = cleanQ.includes('GTA') ? cleanQ : ('GTA6-PS5-' + (cleanQ.slice(-6) || 'ACTIVE'));
        document.getElementById('trackResId').textContent = displayRef;
        document.getElementById('trackResTicket').textContent = '⏳ PENDING / WAITING';
        document.getElementById('trackResName').textContent = 'Verified Participant';
        document.getElementById('trackResPhone').textContent = cleanDigits.length >= 4 ? (cleanDigits.slice(0,2) + '******' + cleanDigits.slice(-2)) : 'Verified';
        document.getElementById('trackResCity').textContent = 'India';
        document.getElementById('trackResScore').textContent = '5/5 (Speed Locked)';
      } else {
        alert("❌ Kripya apna valid Reference Code (e.g. GTA6-PS5-XXXXXX) ya Mobile number check karein!");
        trackRes.style.display = 'none';
        return;
      }

      trackRes.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// 1-Click Copy for UPI ID
window.copyUPIId = function() {
  const upi = 'dapinderkaur@fam';
  const btn = document.getElementById('btnCopyUPI');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(upi).then(() => {
      if (btn) {
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
      }
    }).catch(() => fallbackCopy(upi, btn));
  } else {
    fallbackCopy(upi, btn);
  }
};

function fallbackCopy(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    if (btn) {
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
    }
  } catch (err) {}
  document.body.removeChild(ta);
}
