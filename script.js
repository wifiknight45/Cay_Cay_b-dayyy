// Scroll to messages section
function scrollToMessages() {
    document.getElementById('messages').scrollIntoView({ behavior: 'smooth' });
}

// Display a random Coraline fact
function showCoralineFact() {
    const facts = [
        "The buttons in *Coraline* are a creepy nod to the Other Mother’s control!",
        "Coraline’s blue hair shows her bold, adventurous spirit!",
        "The movie’s stop-motion took over two years to create!",
        "The secret door in *Coraline* leads to a world that’s both magical and dangerous!",
        "Caydence’s love for *Coraline* matches her own fearless vibe!"
    ];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    alert(randomFact);
}

// Handle message form submission
const messageForm = document.getElementById('message-form');
const messageBoard = document.getElementById('message-board');

messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name-input').value.trim();
    const message = document.getElementById('message-input').value.trim();
    
    if (name && message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${name}</strong>: ${message}`;
        messageBoard.appendChild(messageElement);
        
        // Save message to localStorage
        saveMessage(name, message);
        
        // Clear form
        messageForm.reset();
    }
});

// Save message to localStorage
function saveMessage(name, message) {
    let messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
    messages.push({ name, message });
    localStorage.setItem('birthdayMessages', JSON.stringify(messages));
}

// Load messages from localStorage
function loadMessages() {
    let messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
    messages.forEach(({ name, message }) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${name}</strong>: ${message}`;
        messageBoard.appendChild(messageElement);
    });
}

// Load messages when page loads
window.onload = loadMessages;
