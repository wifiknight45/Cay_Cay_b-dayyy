// Password Protection
const correctPassword = 'CayCay11'; // Change this to a strong, unique password

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    if (input === correctPassword) {
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        logVisitor(); // Log IP after access granted
    } else {
        alert('Wrong password! Please try again.');
    }
}

// IP Logging
async function logVisitor() {
    let visitorData = {
        timestamp: new Date().toISOString(),
        ipData: {}
    };

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        visitorData.ipData = {
            ip: btoa(data.ip), // Encode IP to avoid plain text
            country: data.country_name || 'unknown',
            city: data.city || 'unknown',
            isp: data.org || 'unknown'
        };
    } catch (e) {
        console.log('IP API failed:', e);
        visitorData.ipData = { error: 'Could not retrieve IP data' };
    }

    let logs = JSON.parse(localStorage.getItem('visitorLogs') || '[]');
    logs.push(visitorData);
    localStorage.setItem('visitorLogs', JSON.stringify(logs));
}

// Art Canvas
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

function getTimeBasedValues() {
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    const sunAngle = ((hours - 6) % 12) / 12 * 180;
    const hue = (hours / 24) * 360;
    return { sunAngle, hue, hours };
}

function drawAbstract() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { hue } = getTimeBasedValues();

    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 50 + 20;
        const shapeType = Math.floor(Math.random() * 2);
        ctx.fillStyle = `hsl(${hue + Math.random() * 60}, 70%, 50%)`;

        if (shapeType === 0) {
            ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        } else {
            ctx.rect(x - size / 2, y - size / 2, size, size);
        }
        ctx.fill();
    }
}

function drawSun() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { sunAngle, hours } = getTimeBasedValues();

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (hours < 12) {
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#f0e68c');
    } else {
        gradient.addColorStop(0, '#ff4500');
        gradient.addColorStop(1, '#483d8b');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#228b22';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.7;
    const radius = canvas.width * 0.4;
    const angleRad = (sunAngle * Math.PI) / 180;
    const sunX = centerX + radius * Math.cos(angleRad);
    const sunY = centerY - radius * Math.sin(angleRad);

    ctx.beginPath();
    ctx.arc(sunX, sunY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
}

// Message Board
function postMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        const board = document.getElementById('messageBoard');
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = message;
        board.appendChild(div);
        input.value = '';

        // Store message locally
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push({ text: message, timestamp: new Date().toISOString() });
        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

// Load saved messages
function loadMessages() {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const board = document.getElementById('messageBoard');
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = msg.text;
        board.appendChild(div);
    });
}

// Initialize
window.onload = () => {
    if (localStorage.getItem('authenticated') === correctPassword) {
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        logVisitor();
        loadMessages();
    }
};
