// script.js handles interactions for the chatbot and form submission.

const chatbotButton = document.getElementById('chatbot-button');
const chatbotPanel = document.getElementById('chatbot-panel');
const closeChat = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const contactForm = document.getElementById('contact-form');

// Toggle the chatbot panel open and closed.
chatbotButton.addEventListener('click', () => {
  chatbotPanel.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
  chatbotPanel.classList.add('hidden');
});

// Add a new chat message element to the chat window.
function addChatMessage(text, isUser = false) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
  messageElement.textContent = text;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// This is the placeholder API endpoint for Flowise.
const FLOWISE_API_ENDPOINT = 'https://example.com/flowise/chat';

// When the user submits the chat form, send the question.
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userText = chatInput.value.trim();
  if (!userText) return;

  addChatMessage(userText, true);
  chatInput.value = '';

  // Display a typing message while waiting for the API response.
  const loadingMessage = document.createElement('div');
  loadingMessage.classList.add('message', 'bot-message');
  loadingMessage.textContent = 'Thinking...';
  chatMessages.appendChild(loadingMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    // Example fetch request to Flowise API.
    // Replace the endpoint and request body with your own Flowise configuration.
    const response = await fetch(FLOWISE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userText,
      }),
    });

    const data = await response.json();
    loadingMessage.remove();

    // If Flowise has a response message, display it. Otherwise show fallback text.
    const botReply = data?.reply || 'Sorry, I could not reach the AI service. Please try again later.';
    addChatMessage(botReply);
  } catch (error) {
    loadingMessage.remove();
    addChatMessage('Network error: could not connect to Flowise API.');
    console.error('Chatbot error:', error);
  }
});

// Handle the contact form submission locally to keep the portfolio static.
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Normally, this is where you would send form data to a server.
  alert('Thank you! Your message has been captured locally.');
  contactForm.reset();
});

// Smooth scroll for anchor links is handled by CSS scroll-behavior, but
// we can optionally support older browsers via this script.
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
