const chatbotButton = document.getElementById('chatbot-button');
const chatbotPanel = document.getElementById('chatbot-panel');
const closeChat = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const contactForm = document.getElementById('contact-form');

// Toggle chatbot panel
chatbotButton.addEventListener('click', () => {
  chatbotPanel.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
  chatbotPanel.classList.add('hidden');
});

// Add message to chat UI
function addChatMessage(text, isUser = false) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
  messageElement.textContent = text;

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Flowise API endpoint
const FLOWISE_API_ENDPOINT =
  "https://cloud.flowiseai.com/api/v1/prediction/4c83d5f7-f945-4215-8753-9ea1a0ab4c5b";

// Chat submit handler
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userText = chatInput.value.trim();
  if (!userText) return;

  // Show user message
  addChatMessage(userText, true);
  chatInput.value = '';

  // Typing indicator
  const loadingMessage = document.createElement('div');
  loadingMessage.classList.add('message', 'bot-message');
  loadingMessage.textContent = 'Thinking...';
  chatMessages.appendChild(loadingMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch(FLOWISE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userText,
      }),
    });

    const data = await response.json();

    // Remove loading text
    loadingMessage.remove();

    // Handle different possible Flowise response formats
    const botReply =
      data?.text ||
      data?.answer ||
      data?.response ||
      data?.output ||
      "Sorry, I couldn't get a valid response from the AI.";

    addChatMessage(botReply);
  } catch (error) {
    loadingMessage.remove();
    addChatMessage('Network error: could not connect to Flowise API.');
    console.error('Chatbot error:', error);
  }
});

// Contact form (static)
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  alert('Thank you! Your message has been captured locally.');
  contactForm.reset();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    event.preventDefault();

    const targetId = anchor.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
