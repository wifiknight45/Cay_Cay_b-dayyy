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

// Export messages to a text file
function exportMessagesToTextFile(messages) {
    const textContent = messages.map(({ name, message }) => `${name}: ${message}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caydence_birthday_messages.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        
        // Export all messages to a text file
        const messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
        exportMessagesToTextFile(messages);
        
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
