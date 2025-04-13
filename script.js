// Scroll to messages section
function scrollToMessages() {
    document.getElementById('messages').scrollIntoView({ behavior: 'smooth' });
}

// Display a random Chappell Roan fact
function showChappellFact() {
    const facts = [
        "Chappell Roan’s real name is Kayleigh, and she picked her stage name to honor her grandpa!",
        "Her song ‘Good Luck, Babe!’ is a huge hit that kids like Caydence love dancing to!",
        "Chappell loves sparkly outfits, just like the bead bracelets Caydence makes!",
        "She grew up writing songs and even put them on YouTube when she was a teenager!",
        "Chappell’s music is super fun, with bright colors and big feelings, perfect for a party!"
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
