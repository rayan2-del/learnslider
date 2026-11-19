const chatChoice = document.querySelector('#chat-choice');
const learnChoice = document.querySelector('#learn-choice');
const workArea = document.querySelector('#work-area');
const backHome = document.querySelector('#back-home');
const sectionTitle = document.querySelector('#section-title');
const sectionEyebrow = document.querySelector('#section-eyebrow');
const languagePicker = document.querySelector('#language-picker');
const languageSelect = document.querySelector('#language-select');
const chatWindow = document.querySelector('#chat-window');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const quickPrompts = document.querySelector('#quick-prompts');
let mode = 'chat';

const lessons = {
  nl: { label: 'Nederlands', greeting: 'Leuk! We oefenen Nederlands. Nora legt alles rustig uit. Kies een voorbeeld of typ zelf iets.', prompts: ['Begroet iemand', 'Leer een woord', 'Stel een vraag'], replies: ['In het Nederlands zeg je bijvoorbeeld: “Goedemorgen! Hoe gaat het met je?” Probeer het eens zelf.', 'Woord van de dag: “vriendelijk” betekent aardig en prettig in de omgang. Kun je er een zin mee maken?', 'Natuurlijk! Je kunt vragen: “Wat doe je graag in je vrije tijd?”'] },
  fr: { label: 'Frans', greeting: 'Super! We oefenen Frans. Ik leg alles in het Nederlands uit. Kies een voorbeeld om te beginnen.', prompts: ['Hallo zeggen', 'Leer een woord', 'Stel jezelf voor'], replies: ['“Bonjour” betekent “goedendag”. Je kunt ook “Salut” zeggen tegen iemand die je kent. Zeg maar na: bon-jour!', 'Woord van de dag: “merci” betekent “bedankt”. Probeer het uit te spreken als: mer-sie.', 'Je kunt zeggen: “Je m’appelle…” Dat betekent “Ik heet…” Vul je eigen naam maar in!'] },
  de: { label: 'Duits', greeting: 'Prima! We oefenen Duits en ik leg het in het Nederlands uit. Kies een voorbeeld om te beginnen.', prompts: ['Hallo zeggen', 'Leer een woord', 'Stel jezelf voor'], replies: ['��Guten Tag” betekent “goedendag”. Tegen vrienden kun je “Hallo” zeggen. Zeg maar na: goe-ten taag!', 'Woord van de dag: “Danke” betekent “bedankt”. Spreek het uit als: dan-ke.', 'Je kunt zeggen: “Ich heiße…” Dat betekent “Ik heet…” Vul je eigen naam maar in!'] },
  en: { label: 'Engels', greeting: 'Great! We oefenen Engels. Ik leg alles in het Nederlands uit. Kies een voorbeeld om te beginnen.', prompts: ['Hallo zeggen', 'Leer een woord', 'Stel jezelf voor'], replies: ['“Hello” betekent “hallo”. Tegen vrienden kun je ook “Hi” zeggen.', 'Woord van de dag: “please” betekent “alsjeblieft”. Probeer het uit te spreken als: pliez.', 'Je kunt zeggen: “My name is…” Dat betekent “Mijn naam is…” Vul je eigen naam maar in!'] }
};

function addMessage(text, who = 'nora') {
  const bubble = document.createElement('div');
  bubble.className = `message ${who}`;
  bubble.textContent = text;
  chatWindow.append(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
function showWorkspace(nextMode) {
  mode = nextMode;
  chatWindow.replaceChildren();
  quickPrompts.replaceChildren();
  languagePicker.hidden = mode !== 'learn';
  sectionTitle.textContent = mode === 'learn' ? 'Een taal leren' : 'Chat met Nora';
  sectionEyebrow.textContent = mode === 'learn' ? 'JOUW TAALOEFENING' : 'GEZELLIG KLETSEN';
  workArea.hidden = false;
  if (mode === 'learn') renderLesson();
  else {
    addMessage('Hoi! Wat gezellig dat je met me komt praten. Waar wil je het over hebben?');
    addPrompts(['Vertel iets over jezelf', 'Ik wil een grapje', 'Wat kun jij?']);
  }
  workArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  messageInput.focus({ preventScroll: true });
}
function addPrompts(prompts) {
  prompts.forEach((text) => {
    const button = document.createElement('button');
    button.className = 'prompt-chip'; button.type = 'button'; button.textContent = text;
    button.addEventListener('click', () => handleUserMessage(text));
    quickPrompts.append(button);
  });
}
function renderLesson() {
  const lesson = lessons[languageSelect.value];
  addMessage(lesson.greeting);
  addPrompts(lesson.prompts);
}
function replyFor(text) {
  if (mode === 'learn') {
    const lesson = lessons[languageSelect.value];
    const lower = text.toLowerCase();
    if (lower.includes('hallo') || lower.includes('begroet')) return lesson.replies[0];
    if (lower.includes('woord')) return lesson.replies[1];
    if (lower.includes('voor') || lower.includes('naam')) return lesson.replies[2];
    return `Goed bezig! In ${lesson.label} oefenen we rustig stap voor stap. ${lesson.replies[1]}`;
  }
  const lower = text.toLowerCase();
  if (lower.includes('grap')) return 'Waarom nam de robot-hond een paraplu mee? Omdat hij geen natte software wilde! 🤖';
  if (lower.includes('kun jij') || lower.includes('doe jij')) return 'Ik ben Nora, jouw vriendelijke robot-hondje. Ik kan met je kletsen en je helpen oefenen met talen!';
  if (lower.includes('naam') || lower.includes('heet')) return 'Ik heet Nora! En hoe mag ik jou noemen?';
  if (lower.includes('hallo') || lower.includes('hoi')) return 'Hoi! Wat fijn om je te spreken. Vertel eens, hoe is je dag?';
  return 'Leuk dat je dat vertelt! Wil je me er wat meer over vertellen? Of zullen we samen een taal oefenen?';
}
function handleUserMessage(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  messageInput.value = '';
  quickPrompts.replaceChildren();
  window.setTimeout(() => addMessage(replyFor(clean)), 350);
}
chatChoice.addEventListener('click', () => showWorkspace('chat'));
learnChoice.addEventListener('click', () => showWorkspace('learn'));
backHome.addEventListener('click', () => { workArea.hidden = true; document.querySelector('#home').scrollIntoView({ behavior: 'smooth' }); });
languageSelect.addEventListener('change', () => { if (mode === 'learn') { chatWindow.replaceChildren(); quickPrompts.replaceChildren(); renderLesson(); } });
messageForm.addEventListener('submit', (event) => { event.preventDefault(); handleUserMessage(messageInput.value); });
