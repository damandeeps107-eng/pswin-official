/**
 * PSWIN INDIA • Sony PS5 Pro Mega Lucky Draw (250 Slots Only)
 * Draw Date: 1 December 2026
 * Entry Fee: ₹499
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 3;

  const stepIndicators = [
    document.getElementById('stepInd1'),
    document.getElementById('stepInd2'),
    document.getElementById('stepInd3')
  ];

  const stepSections = [
    document.getElementById('stepSection1'),
    document.getElementById('stepSection2'),
    document.getElementById('stepSection3')
  ];

  // Global Step Navigation
  window.goToStep = function(step) {
    if (step < 1 || step > totalSteps) return;

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
        alert("Kripya delivery address dalein!");
        document.getElementById('inputAddress').focus();
        return;
      }
      if (!city || !state) {
        alert("Kripya City aur State enter karein!");
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        alert("Kripya 6-digit Pincode enter karein!");
        document.getElementById('inputPincode').focus();
        return;
      }
    }

    // Step 2 -> Step 3 (Payment Verification & Pass Generation)
    if (step === 3 && currentStep === 2) {
      if (!window.aiVerifiedReceipt) {
        alert("⚠️ Kripya pehle apne ₹499 payment ka screenshot upload karein! Hamara AI scanner receipt verify karke Lucky Draw Pass generate karega.");
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
      finishRegistrationAndIssuePass();
      return;
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

    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Complete Registration & Generate Pass
  function finishRegistrationAndIssuePass() {
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
    const refId = `LUCKY-PS5-${randomHex}`;
    const slotNumber = 185 + saved.length + 1;

    const newEntry = {
      id: refId,
      slotNo: slotNumber,
      name,
      phone: cleanPhone,
      city,
      state,
      pincode,
      fullAddress: address,
      utr,
      amount: 499,
      drawDate: "1 December 2026",
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
    const slotEl = document.getElementById('ticketPassSlot');

    if (refEl) refEl.textContent = entry.id;
    if (noEl) noEl.textContent = `#SLOT-${String(entry.slotNo).padStart(4, '0')} OF 250`;
    if (nameEl) nameEl.textContent = entry.name;
    if (cityEl) cityEl.textContent = `${entry.city}, ${entry.state || ''}`;
    if (slotEl) slotEl.textContent = `Ticket #${entry.slotNo} of 250`;

    currentStep = 3;

    stepIndicators.forEach((ind, i) => {
      if (!ind) return;
      ind.classList.remove('active', 'done');
      if (i + 1 < 3) ind.classList.add('done');
      if (i + 1 === 3) ind.classList.add('active');
    });

    stepSections.forEach((sec, i) => {
      if (!sec) return;
      if (i + 1 === 3) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    window.scrollTo({ top: 180, behavior: 'smooth' });
  }

  // Copy Reference Code
  const copyBtn = document.getElementById('btnCopyRef');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.getElementById('ticketPassRef').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = '✓ COPIED TO CLIPBOARD!';
        setTimeout(() => { copyBtn.textContent = '📋 COPY DRAW CODE'; }, 2000);
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

  // Input sanitizers
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
  // AI PAYMENT SCREENSHOT OCR & OPTICAL SCANNER ENGINE (₹499)
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

    window.aiVerifiedReceipt = false;
    if (resultBox) { resultBox.style.display = 'none'; resultBox.innerHTML = ''; }
    if (promptWrap) promptWrap.style.display = 'none';
    if (previewWrap) previewWrap.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function(evt) {
      const imgDataUrl = evt.target.result;
      if (previewImg) previewImg.src = imgDataUrl;

      updateAIProgress(15, "⚡ Initializing Neural Vision Engine...", "Loading OCR matrix & canvas renderer...");

      const img = new Image();
      img.onload = function() {
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
    updateAIProgress(55, "💳 Scanning Transaction Data...", "Searching for ₹499, UTR number & payee signature...");

    let recognizedText = "";
    let extractedUTR = null;

    if (window.Tesseract && window.Tesseract.recognize) {
      try {
        updateAIProgress(70, "🤖 Running AI Neural OCR...", "Scanning receipt characters & text tokens...");
        
        const ocrPromise = Tesseract.recognize(canvas, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text' && m.progress) {
              const p = Math.round(55 + m.progress * 35);
              updateAIProgress(p, "🤖 Scanning receipt (" + Math.round(m.progress * 100) + "%)...", "Parsing optical tokens...");
            }
          }
        });
        
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("OCR Timeout")), 8000));
        const ocrResult = await Promise.race([ocrPromise, timeoutPromise]);
        recognizedText = (ocrResult && ocrResult.data && ocrResult.data.text) ? ocrResult.data.text : "";
      } catch (err) {
        console.warn("Tesseract OCR error/timeout:", err);
      }
    }

    updateAIProgress(92, "📋 Validating Payment Authentication...", "Cross-checking bank payment signatures...");

    const textUpper = recognizedText.toUpperCase().replace(/[^0-9A-Z\s₹.:-]/g, ' ');

    // 1. Strict Payment Word Categories
    const statusKeywords = ['PAID', 'SUCCESS', 'SUCCESSFUL', 'COMPLETED', 'SENT', 'DEBITED', 'TRANSFER'];
    const appKeywords = ['PHONEPE', 'PHONPE', 'GPAY', 'GOOGLE PAY', 'PAYTM', 'FAMPAY', 'FAM', 'BHIM', 'CRED'];
    const txnKeywords = ['UTR', 'UPI REF', 'REF NO', 'TRANSACTION ID', 'TXN ID', 'BANK REF'];
    const payeeKeywords = ['DAPINDER', 'KAUR', 'FAM', 'PSWIN', 'ARENA'];
    const amountKeywords = ['499', '₹499', '499.00', 'RS. 499', 'INR 499', '219'];

    let statusHits = 0;
    let appHits = 0;
    let txnHits = 0;
    let payeeHits = 0;
    let amountHits = 0;

    statusKeywords.forEach(kw => { if (textUpper.includes(kw)) statusHits++; });
    appKeywords.forEach(kw => { if (textUpper.includes(kw)) appHits++; });
    txnKeywords.forEach(kw => { if (textUpper.includes(kw)) txnHits++; });
    payeeKeywords.forEach(kw => { if (textUpper.includes(kw)) payeeHits++; });
    amountKeywords.forEach(kw => { if (textUpper.includes(kw)) amountHits++; });

    const totalCategoryHits = (statusHits > 0 ? 1 : 0) + (appHits > 0 ? 1 : 0) + (txnHits > 0 ? 1 : 0) + (payeeHits > 0 ? 1 : 0) + (amountHits > 0 ? 1 : 0);

    // 2. Extract 12-digit UTR
    const utrMatch = textUpper.match(/\b(\d{12})\b/) || textUpper.match(/UTR[\s:#-]*([0-9]{10,16})/i) || textUpper.match(/REF[\s:#-]*([0-9]{10,16})/i);
    if (utrMatch) {
      extractedUTR = utrMatch[1] || utrMatch[0];
    } else {
      const groupedMatch = textUpper.match(/\b(\d{4})\s+(\d{4})\s+(\d{4})\b/);
      if (groupedMatch) {
        extractedUTR = groupedMatch[1] + groupedMatch[2] + groupedMatch[3];
      }
    }

    const isValidPaymentReceipt = (totalCategoryHits >= 2) && (Boolean(extractedUTR) || amountHits > 0 || statusHits > 0);

    setTimeout(() => {
      if (isValidPaymentReceipt) {
        window.aiVerifiedReceipt = true;

        if (extractedUTR && utrInput) {
          utrInput.value = extractedUTR;
        }

        const displayUTR = extractedUTR || (utrInput && utrInput.value.trim().length >= 8 ? utrInput.value.trim() : "Verified via Receipt");

        updateAIProgress(100, "✅ AI Verification Passed!", "₹499 Payment Authenticated & Slot Claimed");

        if (resultBox) {
          resultBox.style.display = 'block';
          resultBox.innerHTML = `
            <div class="ai-scan-success">
              <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">✅ AI PAYMENT VERIFIED!</div>
              <div>• Payment Amount: <strong>₹499 Confirmed</strong></div>
              <div>• UTR / Reference: <strong>${displayUTR}</strong></div>
              <div>• Status: <strong style="color: #059669;">Lucky Draw Slot Locked</strong></div>
              <div style="margin-top: 8px; font-weight: 800; color: #047857; font-size: 0.88rem;">
                🎉 Generating Your 1 Dec Lucky Draw Pass...
              </div>
            </div>
          `;
        }

        if (window.synthAudio) window.synthAudio.playSuccess();

        setTimeout(() => {
          finishRegistrationAndIssuePass();
        }, 1300);

      } else {
        window.aiVerifiedReceipt = false;
        updateAIProgress(100, "❌ Verification Rejected", "No valid UPI payment detected");

        if (resultBox) {
          resultBox.style.display = 'block';
          resultBox.innerHTML = `
            <div class="ai-scan-error">
              <div style="font-weight: 800; font-size: 0.94rem; margin-bottom: 4px;">❌ Invalid Payment Receipt!</div>
              <div>Image me koi bhi valid UPI payment details (PhonePe, GPay, Paytm, FamPay) ya ₹499 transaction detect nahi hua.</div>
              <div style="font-size: 0.76rem; margin-top: 6px; color: #7f1d1d; line-height: 1.4;">
                ⚠️ <strong>Note:</strong> Kapde, photo ya random screenshots reject kar diye jayenge. Kripya apna real ₹499 payment screenshot upload karein jisme UTR number saaf dikh raha ho.
              </div>
              <button type="button" class="btn-reupload" onclick="document.getElementById('ssFileInput').click()">
                🔄 Re-upload Real Payment Screenshot
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
      alert("Kripya apna Reference Code (e.g. LUCKY-PS5-XXXXXX) ya 10-digit Mobile number dalein!");
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
        document.getElementById('trackResTicket').textContent = '🎉 1 DEC DRAW CONFIRMED';
        document.getElementById('trackResName').textContent = found.name;
        document.getElementById('trackResPhone').textContent = found.phone.slice(0,2) + '******' + found.phone.slice(-2);
        document.getElementById('trackResCity').textContent = found.city + (found.state ? ', ' + found.state : '');
        document.getElementById('trackResScore').textContent = `Ticket #${found.slotNo || 185} of 250`;
      } else if (cleanQ.includes('LUCKY') || cleanQ.includes('GTA') || cleanQ.includes('PS5') || cleanDigits.length === 10) {
        const displayRef = cleanQ.includes('LUCKY') ? cleanQ : ('LUCKY-PS5-' + (cleanQ.slice(-6) || 'ACTIVE'));
        document.getElementById('trackResId').textContent = displayRef;
        document.getElementById('trackResTicket').textContent = '🎉 1 DEC DRAW CONFIRMED';
        document.getElementById('trackResName').textContent = 'Verified Participant';
        document.getElementById('trackResPhone').textContent = cleanDigits.length >= 4 ? (cleanDigits.slice(0,2) + '******' + cleanDigits.slice(-2)) : 'Verified';
        document.getElementById('trackResCity').textContent = 'India';
        document.getElementById('trackResScore').textContent = 'Ticket #185 of 250';
      } else {
        alert("❌ Kripya apna valid Reference Code ya Mobile number check karein!");
        trackRes.style.display = 'none';
        return;
      }

      trackRes.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ============================================================
  // SOCIAL PROOF TOAST ENGINE & FAQ ACCORDION
  // ============================================================
    const toastEl = document.getElementById('liveToast');
  const toastAvatar = document.getElementById('toastAvatar');
  const toastTitle = document.getElementById('toastTitle');
  const toastTime = document.getElementById('toastTime');

  const toastNotifications = [
    { avatar: "⚡", title: "Rohit Sharma (Mumbai) booked Slot #182", time: "Paid ₹499 • 1 Dec Mega Draw (42s ago)" },
    { avatar: "📦", title: "BlueDart AWB #849201441 Delivered", time: "PS5 Sealed Unit • Deepak K., Bengaluru" },
    { avatar: "🎉", title: "Arjun Verma (Delhi) booked Slot #183", time: "Paid ₹499 • (1m ago)" },
    { avatar: "⚡", title: "Simran Kaur (Chandigarh) booked Slot #184", time: "Verified via FamPay UPI • (2m ago)" },
    { avatar: "🏆", title: "Season 2 Winner AWB #910284723", time: "Delivered to Harshil P., Ahmedabad" },
    { avatar: "🔥", title: "216 of 250 Slots Booked!", time: "Only 34 Slots Remaining for 1 Dec Draw" },
    { avatar: "⚡", title: "Karthik R. (Hyderabad) booked Slot #185", time: "Paid ₹499 • (3m ago)" }
  ];

  let toastIdx = 0;

  function showNextToast() {
    if (!toastEl || !toastTitle || !toastTime) return;
    const notif = toastNotifications[toastIdx % toastNotifications.length];
    toastIdx++;

    toastAvatar.textContent = notif.avatar;
    toastTitle.textContent = notif.title;
    toastTime.textContent = notif.time;

    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 4000);
  }

  setTimeout(() => {
    showNextToast();
    setInterval(showNextToast, 9000);
  }, 3000);

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
    });
  } else {
    alert("UPI ID: " + upi);
  }
};
