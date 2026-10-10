const chat = document.getElementById("chat");
const langSelect = document.getElementById("langSelect");
const inputBar = document.getElementById("inputBar");
const textInput = document.getElementById("textInput");
const micBtn = document.getElementById("micBtn");
const sendBtn = document.getElementById("sendBtn");
const tagline = document.getElementById("tagline");

const answers = { who: null, need: null, state: null };
let currentLang = "en";

// ---------- Languages ----------
const LANGUAGES = [
  { code: "en", speechCode: "en-IN", label: "English" },
  { code: "hi", speechCode: "hi-IN", label: "हिंदी (Hindi)" },
  { code: "ta", speechCode: "ta-IN", label: "தமிழ் (Tamil)" },
  { code: "kn", speechCode: "kn-IN", label: "ಕನ್ನಡ (Kannada)" },
  { code: "mr", speechCode: "mr-IN", label: "मराठी (Marathi)" },
];

// ---------- Translations ----------
const T = {
  en: {
    tagline: "Find government schemes you may qualify for",
    welcome: "Hi! I'm Sahayak. I help you find government schemes you may be eligible for. Tap, type, or speak.",
    askWho: "First, who are you?",
    askNeed: "Got it. What kind of help are you looking for?",
    askState: "Which state are you in? This helps me find state-specific schemes too.",
    foundResults: (n) => "Here's what I found (" + n + " results):",
    noResults: "I couldn't find matching schemes for that. Try a different choice, or type/speak your need below.",
    errorNote: (e) => "Something went wrong: " + e,
    restart: "Search again",
    officialSource: "OFFICIAL SOURCE",
    viewScheme: "View scheme",
    who: { student: "Student", farmer: "Farmer", woman: "Woman", senior_citizen: "Senior citizen", worker: "Worker" },
    need: { money: "Money / Subsidy", education: "Education", housing: "Housing", health: "Health", business: "Business" },
    state: { "Tamil Nadu": "Tamil Nadu", "Karnataka": "Karnataka", "Maharashtra": "Maharashtra", "Uttar Pradesh": "Uttar Pradesh", "skip": "Skip / Any state" },
    placeholder: "Type or speak your need...",
    send: "Send",
    resultsNoteEnglish: "Note: scheme pages are mostly published in English by the government.",
  },
  hi: {
    tagline: "उन सरकारी योजनाओं को खोजें जिनके आप पात्र हो सकते हैं",
    welcome: "नमस्ते! मैं सहायक हूँ। मैं आपको सरकारी योजनाएं खोजने में मदद करता हूँ। टैप करें, टाइप करें, या बोलें।",
    askWho: "पहले बताइए, आप कौन हैं?",
    askNeed: "ठीक है। आपको किस तरह की मदद चाहिए?",
    askState: "आप किस राज्य में हैं? इससे राज्य-विशेष योजनाएं भी मिल सकेंगी।",
    foundResults: (n) => "मुझे यह मिला (" + n + " परिणाम):",
    noResults: "मुझे उससे मेल खाती योजनाएं नहीं मिलीं। कोई और विकल्प चुनें, या नीचे टाइप/बोलकर बताएं।",
    errorNote: (e) => "कुछ गड़बड़ हुई: " + e,
    restart: "फिर से खोजें",
    officialSource: "आधिकारिक स्रोत",
    viewScheme: "योजना देखें",
    who: { student: "छात्र", farmer: "किसान", woman: "महिला", senior_citizen: "वरिष्ठ नागरिक", worker: "श्रमिक" },
    need: { money: "पैसा / सब्सिडी", education: "शिक्षा", housing: "आवास", health: "स्वास्थ्य", business: "व्यवसाय" },
    state: { "Tamil Nadu": "तमिलनाडु", "Karnataka": "कर्नाटक", "Maharashtra": "महाराष्ट्र", "Uttar Pradesh": "उत्तर प्रदेश", "skip": "छोड़ें / कोई भी राज्य" },
    placeholder: "टाइप करें या बोलें...",
    send: "भेजें",
    resultsNoteEnglish: "नोट: योजना पेज अधिकतर अंग्रेज़ी में प्रकाशित होते हैं।",
  },
  ta: {
    tagline: "நீங்கள் தகுதி பெறக்கூடிய அரசு திட்டங்களைக் கண்டறியுங்கள்",
    welcome: "வணக்கம்! நான் சஹாயக். நீங்கள் தகுதி பெறக்கூடிய அரசு திட்டங்களைக் கண்டறிய உதவுகிறேன். தட்டவும், தட்டச்சு செய்யவும், அல்லது பேசவும்.",
    askWho: "முதலில், நீங்கள் யார்?",
    askNeed: "சரி. உங்களுக்கு என்ன வகையான உதவி தேவை?",
    askState: "நீங்கள் எந்த மாநிலத்தில் இருக்கிறீர்கள்?",
    foundResults: (n) => "இதோ கிடைத்தவை (" + n + " முடிவுகள்):",
    noResults: "பொருந்தும் திட்டங்கள் கிடைக்கவில்லை. வேறு தேர்வு செய்யவும் அல்லது கீழே தட்டச்சு/பேசவும்.",
    errorNote: (e) => "ஏதோ தவறு நடந்தது: " + e,
    restart: "மீண்டும் தேடு",
    officialSource: "அதிகாரப்பூர்வ ஆதாரம்",
    viewScheme: "திட்டத்தைப் பார்",
    who: { student: "மாணவர்", farmer: "விவசாயி", woman: "பெண்", senior_citizen: "மூத்த குடிமகன்", worker: "தொழிலாளி" },
    need: { money: "பணம் / மானியம்", education: "கல்வி", housing: "வீட்டுவசதி", health: "சுகாதாரம்", business: "வணிகம்" },
    state: { "Tamil Nadu": "தமிழ்நாடு", "Karnataka": "கர்நாடகா", "Maharashtra": "மகாராஷ்டிரா", "Uttar Pradesh": "உத்தரபிரதேசம்", "skip": "தவிர் / எந்த மாநிலமும்" },
    placeholder: "தட்டச்சு செய்யவும் அல்லது பேசவும்...",
    send: "அனுப்பு",
    resultsNoteEnglish: "குறிப்பு: திட்டப் பக்கங்கள் பெரும்பாலும் ஆங்கிலத்தில் உள்ளன.",
  },
  kn: {
    tagline: "ನೀವು ಅರ್ಹರಾಗಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ಸಹಾಯಕ್. ನೀವು ಅರ್ಹರಾಗಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಟ್ಯಾಪ್ ಮಾಡಿ, ಟೈಪ್ ಮಾಡಿ, ಅಥವಾ ಮಾತನಾಡಿ.",
    askWho: "ಮೊದಲು, ನೀವು ಯಾರು?",
    askNeed: "ಸರಿ. ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಸಹಾಯ ಬೇಕು?",
    askState: "ನೀವು ಯಾವ ರಾಜ್ಯದಲ್ಲಿದ್ದೀರಿ?",
    foundResults: (n) => "ನನಗೆ ಇವು ಸಿಕ್ಕಿವೆ (" + n + " ಫಲಿತಾಂಶಗಳು):",
    noResults: "ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳು ಸಿಗಲಿಲ್ಲ. ಬೇರೆ ಆಯ್ಕೆ ಮಾಡಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್/ಮಾತನಾಡಿ.",
    errorNote: (e) => "ಏನೋ ತಪ್ಪಾಗಿದೆ: " + e,
    restart: "ಮತ್ತೆ ಹುಡುಕಿ",
    officialSource: "ಅಧಿಕೃತ ಮೂಲ",
    viewScheme: "ಯೋಜನೆ ನೋಡಿ",
    who: { student: "ವಿದ್ಯಾರ್ಥಿ", farmer: "ರೈತ", woman: "ಮಹಿಳೆ", senior_citizen: "ಹಿರಿಯ ನಾಗರಿಕ", worker: "ಕಾರ್ಮಿಕ" },
    need: { money: "ಹಣ / ಸಬ್ಸಿಡಿ", education: "ಶಿಕ್ಷಣ", housing: "ವಸತಿ", health: "ಆರೋಗ್ಯ", business: "ವ್ಯಾಪಾರ" },
    state: { "Tamil Nadu": "ತಮಿಳುನಾಡು", "Karnataka": "ಕರ್ನಾಟಕ", "Maharashtra": "ಮಹಾರಾಷ್ಟ್ರ", "Uttar Pradesh": "ಉತ್ತರ ಪ್ರದೇಶ", "skip": "ಬಿಟ್ಟುಬಿಡಿ / ಯಾವುದೇ ರಾಜ್ಯ" },
    placeholder: "ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...",
    send: "ಕಳುಹಿಸಿ",
    resultsNoteEnglish: "ಗಮನಿಸಿ: ಯೋಜನಾ ಪುಟಗಳು ಹೆಚ್ಚಾಗಿ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿವೆ.",
  },
  mr: {
    tagline: "तुम्ही पात्र असू शकता अशा सरकारी योजना शोधा",
    welcome: "नमस्कार! मी सहायक आहे. तुम्ही पात्र असलेल्या सरकारी योजना शोधण्यात मदत करतो. टॅप करा, टाइप करा, किंवा बोला.",
    askWho: "आधी सांगा, तुम्ही कोण आहात?",
    askNeed: "ठीक आहे. तुम्हाला कोणत्या प्रकारची मदत हवी आहे?",
    askState: "तुम्ही कोणत्या राज्यात आहात?",
    foundResults: (n) => "मला हे सापडले (" + n + " निकाल):",
    noResults: "जुळणाऱ्या योजना सापडल्या नाहीत. दुसरा पर्याय निवडा किंवा खाली टाइप/बोला.",
    errorNote: (e) => "काहीतरी चूक झाली: " + e,
    restart: "पुन्हा शोधा",
    officialSource: "अधिकृत स्रोत",
    viewScheme: "योजना पहा",
    who: { student: "विद्यार्थी", farmer: "शेतकरी", woman: "महिला", senior_citizen: "ज्येष्ठ नागरिक", worker: "कामगार" },
    need: { money: "पैसे / अनुदान", education: "शिक्षण", housing: "घरकुल", health: "आरोग्य", business: "व्यवसाय" },
    state: { "Tamil Nadu": "तमिळनाडू", "Karnataka": "कर्नाटक", "Maharashtra": "महाराष्ट्र", "Uttar Pradesh": "उत्तर प्रदेश", "skip": "वगळा / कोणतेही राज्य" },
    placeholder: "टाइप करा किंवा बोला...",
    send: "पाठवा",
    resultsNoteEnglish: "टीप: योजना पाने बहुतांश इंग्रजीत असतात.",
  },
};

function t() { return T[currentLang]; }

function populateLangSelect() {
  LANGUAGES.forEach(function (l) {
    const opt = document.createElement("option");
    opt.value = l.code;
    opt.textContent = l.label;
    langSelect.appendChild(opt);
  });
  langSelect.value = currentLang;
  langSelect.addEventListener("change", function () {
    currentLang = langSelect.value;
    tagline.textContent = t().tagline;
    textInput.placeholder = t().placeholder;
    sendBtn.textContent = t().send;
    chat.innerHTML = "";
    startConversation();
  });
}

function speechCodeFor(lang) {
  const found = LANGUAGES.find(function (l) { return l.code === lang; });
  return found ? found.speechCode : "en-IN";
}

// ---------- Speech: text-to-speech ----------
let currentSpeakBtn = null;

function stopSpeaking() {
  window.speechSynthesis.cancel();
  if (currentSpeakBtn) {
    currentSpeakBtn.textContent = "Listen";
    currentSpeakBtn = null;
  }
}

function detectSpeechLang(text) {
  // Choose the voice language from the script of the text actually being read,
  // so it works even when the page was translated by the Google Translate bar.
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN";
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN";
  if (/[\u0900-\u097F]/.test(text)) {
    return (currentLang === "mr" || document.documentElement.lang === "mr") ? "mr-IN" : "hi-IN";
  }
  return "en-IN";
}

let cachedVoices = [];
function refreshVoices() { cachedVoices = window.speechSynthesis.getVoices(); }
if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function showVoiceStatus(langCode, voice) {
  let el = document.getElementById("voiceStatus");
  if (!el) {
    el = document.createElement("div");
    el.id = "voiceStatus";
    el.style.cssText = "max-width:640px;margin:0 auto;padding:4px 20px;font-size:12px;color:#5B6472;";
    inputBar.parentNode.insertBefore(el, inputBar);
  }
  el.textContent = "Voice check: text language " + langCode + " | voice used: " +
    (voice ? voice.name + " (" + voice.lang + ")" : "browser default (no matching voice found)");
}

function pickVoice(langCode) {
  if (!cachedVoices.length) refreshVoices();
  const voices = cachedVoices;
  if (!voices.length) return undefined; // voices not loaded yet; let the browser try
  const prefix = langCode.split("-")[0];
  return (
    voices.find(function (v) { return v.lang === langCode; }) ||
    voices.find(function (v) { return v.lang.toLowerCase().indexOf(prefix) === 0; }) ||
    null
  );
}

function toggleSpeak(text, btn) {
  if (!("speechSynthesis" in window)) return;

  // If this exact button is already speaking, stop it.
  if (currentSpeakBtn === btn) {
    stopSpeaking();
    return;
  }

  stopSpeaking();

  const langCode = detectSpeechLang(text);
  const voice = pickVoice(langCode);

  if (voice === null) {
    addBotBubble(
      "This device/browser has no voice installed for this language (" + langCode +
      "). Try Microsoft Edge, or add the language voice in Windows Settings > Time & language > Speech.",
      false
    );
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  if (voice) utter.voice = voice;
  showVoiceStatus(langCode, voice);
  utter.onend = function () {
    if (currentSpeakBtn === btn) {
      btn.textContent = "Listen";
      currentSpeakBtn = null;
    }
  };
  window.speechSynthesis.speak(utter);
  btn.textContent = "Stop";
  currentSpeakBtn = btn;
}

function addSpeakButton(container, text) {
  const btn = document.createElement("button");
  btn.className = "speak-btn";
  btn.textContent = "Listen";
  btn.title = "Listen";
  btn.addEventListener("click", function () { toggleSpeak(text, btn); });
  container.appendChild(btn);
  return btn;
}

// ---------- Speech: speech-to-text ----------
let recognizer = null;
function initSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    micBtn.style.display = "none";
    return;
  }
  recognizer = new SR();
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 1;

  recognizer.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    textInput.value = transcript;
    micBtn.classList.remove("listening");
  };
  recognizer.onerror = function () { micBtn.classList.remove("listening"); };
  recognizer.onend = function () { micBtn.classList.remove("listening"); };
}

micBtn.addEventListener("click", function () {
  if (!recognizer) return;
  recognizer.lang = speechCodeFor(currentLang);
  micBtn.classList.add("listening");
  try {
    recognizer.start();
  } catch (e) {
    micBtn.classList.remove("listening");
  }
});

// ---------- Chat rendering ----------
function addBotBubble(text, speakable) {
  if (speakable === undefined) speakable = true;
  const msg = document.createElement("div");
  msg.className = "msg bot";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  msg.appendChild(bubble);
  if (speakable) addSpeakButton(msg, text);
  chat.appendChild(msg);
  scrollToBottom();
  return msg;
}

function addUserBubble(text) {
  const msg = document.createElement("div");
  msg.className = "msg user";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  msg.appendChild(bubble);
  chat.appendChild(msg);
  scrollToBottom();
}

function addTypingIndicator() {
  const msg = document.createElement("div");
  msg.className = "msg bot";
  msg.id = "typing-indicator";
  msg.innerHTML = '<div class="bubble typing"><span></span><span></span><span></span></div>';
  chat.appendChild(msg);
  scrollToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function addChoiceButtons(optionMap, onPick) {
  const msg = document.createElement("div");
  msg.className = "msg bot";
  const choices = document.createElement("div");
  choices.className = "choices";

  const buttons = [];
  Object.keys(optionMap).forEach(function (value) {
    const label = optionMap[value];
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = label;
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.disabled = true; });
      addUserBubble(label);
      onPick(value);
    });
    buttons.push(btn);
    choices.appendChild(btn);
  });

  msg.appendChild(choices);
  chat.appendChild(msg);
  scrollToBottom();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderSchemeResults(data) {
  removeTypingIndicator();

  if (data.error) {
    const msg = document.createElement("div");
    msg.className = "msg bot";
    msg.innerHTML = '<div class="error-note">' + escapeHtml(t().errorNote(data.error)) + '</div>';
    chat.appendChild(msg);
    scrollToBottom();
    addRestartButton();
    return;
  }

  if (!data.schemes || data.schemes.length === 0) {
    addBotBubble(t().noResults);
    addRestartButton();
    return;
  }

  addBotBubble(t().foundResults(data.count));

  const wrap = document.createElement("div");
  wrap.className = "msg bot";
  wrap.style.width = "100%";

  data.schemes.forEach(function (scheme) {
    const card = document.createElement("div");
    card.className = "scheme-card" + (scheme.official ? " official" : "");
    card.innerHTML =
      "<h3>" + escapeHtml(scheme.title) + "</h3>" +
      "<p>" + escapeHtml(scheme.snippet) + "</p>" +
      '<div class="meta">' +
      '<span class="scheme-tag">' + (scheme.official ? t().officialSource : scheme.displayed_link) + "</span>" +
      '<a href="' + scheme.link + '" target="_blank" rel="noopener">' + t().viewScheme + "</a>" +
      "</div>";
    const speakBtn = document.createElement("button");
    speakBtn.className = "speak-btn";
    speakBtn.textContent = "Listen";
    speakBtn.title = "Listen";
    speakBtn.addEventListener("click", function () {
      // Read whatever text is CURRENTLY shown on screen (which may have
      // been translated by the Google Translate bar), not the original
      // English text captured when the card was built.
      const liveTitle = card.querySelector("h3").textContent;
      const liveSnippet = card.querySelector("p").textContent;
      toggleSpeak(liveTitle + ". " + liveSnippet, speakBtn);
    });
    card.querySelector(".meta").appendChild(speakBtn);
    wrap.appendChild(card);
  });

  chat.appendChild(wrap);
  scrollToBottom();

  if (currentLang !== "en") {
    addBotBubble(t().resultsNoteEnglish, false);
  }

  addRestartButton();
}

function addRestartButton() {
  const msg = document.createElement("div");
  msg.className = "msg bot";
  const btn = document.createElement("button");
  btn.className = "restart-btn";
  btn.textContent = t().restart;
  btn.addEventListener("click", function () {
    answers.who = null;
    answers.need = null;
    answers.state = null;
    chat.innerHTML = "";
    startConversation();
  });
  msg.appendChild(btn);
  chat.appendChild(msg);
  scrollToBottom();
}

function fetchSchemes(paramsObj) {
  addTypingIndicator();
  const params = new URLSearchParams(paramsObj);
  fetch("/api/search?" + params.toString())
    .then(function (res) { return res.json(); })
    .then(function (data) { renderSchemeResults(data); })
    .catch(function (err) { renderSchemeResults({ error: err.message }); });
}

// ---------- Free text / voice input bar ----------
let pendingFreeText = null;

function sendFreeText() {
  const text = textInput.value.trim();
  if (!text) return;
  addUserBubble(text);
  textInput.value = "";
  pendingFreeText = text;
  askStateForFreeText();
}

function askStateForFreeText() {
  addBotBubble(t().askState);
  addChoiceButtons(t().state, function (value) {
    answers.state = value;
    fetchSchemes({ text: pendingFreeText, state: answers.state });
    pendingFreeText = null;
  });
}

sendBtn.addEventListener("click", sendFreeText);
textInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendFreeText();
});

// ---------- Guided flow ----------
function askState() {
  addBotBubble(t().askState);
  addChoiceButtons(t().state, function (value) {
    answers.state = value;
    fetchSchemes({ who: answers.who, need: answers.need, state: answers.state });
  });
}

function askNeed() {
  addBotBubble(t().askNeed);
  addChoiceButtons(t().need, function (value) {
    answers.need = value;
    askState();
  });
}

function startConversation() {
  inputBar.style.display = "flex";
  addBotBubble(t().welcome);
  addBotBubble(t().askWho);
  addChoiceButtons(t().who, function (value) {
    answers.who = value;
    askNeed();
  });
}

populateLangSelect();
tagline.textContent = t().tagline;
textInput.placeholder = t().placeholder;
sendBtn.textContent = t().send;
initSpeechRecognition();
startConversation();