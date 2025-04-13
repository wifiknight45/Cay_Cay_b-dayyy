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

// Fetch IP address using ipapi.co
async function getIPAddress() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data.ip || 'Unknown IP';
    } catch (error) {
        console.error('Error fetching IP:', error);
        return 'Unknown IP';
    }
}

// Export messages to a text file
function exportMessagesToTextFile(messages) {
    const textContent = messages.map(({ name, message, ip, timestamp }) => 
        `${name}: ${message}\nIP: ${ip}\nPosted: ${new Date(timestamp).toLocaleString()}\n`
    ).join('\n');
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

messageForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name-input').value.trim();
    const message = document.getElementById('message-input').value.trim();
    
    if (name && message) {
        // Fetch IP address
        const ip = await getIPAddress();
        const timestamp = new Date().toISOString();
        
        // Display message on the board
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${name}</strong>: ${message}`;
        messageBoard.appendChild(messageElement);
        
        // Save message with IP and timestamp to localStorage
        saveMessage(name, message, ip, timestamp);
        
        // Export all messages to a text file
        const messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
        exportMessagesToTextFile(messages);
        
        // Clear form
        messageForm.reset();
    }
});

// Save message to localStorage
function saveMessage(name, message, ip, timestamp) {
    let messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
    messages.push({ name, message, ip, timestamp });
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
