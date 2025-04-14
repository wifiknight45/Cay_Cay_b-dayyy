// Secure IP Blocking (Now handled server-side)
async function checkIPAccess() {
    try {
        const response = await fetch('/api/check-ip'); // Server-side validation
        const { accessDenied } = await response.json();

        if (accessDenied) {
            document.getElementById('accessDenied').classList.remove('hidden');
            document.getElementById('mainContent').classList.add('hidden');
            return false;
        }
    } catch (e) {
        console.error('IP check failed:', e);
    }
    return true;
}

// Secure IP Logging (Now hashes IP for privacy)
async function logVisitor() {
    let visitorData = { timestamp: new Date().toISOString() };

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const hashedIP = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.ip));

        visitorData.ipData = {
            ipHash: Array.from(new Uint8Array(hashedIP)).map(b => b.toString(16).padStart(2, '0')).join(''),
            country: data.country_name || 'unknown',
            city: data.city || 'unknown',
            isp: data.org || 'unknown',
            region: data.region_code || 'unknown'
        };

        await fetch('/api/log-visitor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitorData)
        });
    } catch (e) {
        console.error('IP API failed:', e);
    }
}

// Enhanced Fetch with Timeout Handling
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        return null;
    }
}

// Optimized Art Rendering
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

function getTimeBasedValues() {
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    return {
        sunAngle: ((hours - 6) % 12) / 12 * 180,
        hue: (hours / 24) * 360
    };
}

function drawAbstract() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { hue } = getTimeBasedValues();

    ctx.fillStyle = `hsl(${hue + Math.random() * 60}, 70%, 50%)`;

    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 50 + 20;
        const shapeType = Math.floor(Math.random() * 2);

        if (shapeType === 0) {
            ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        } else {
            ctx.rect(x - size / 2, y - size / 2, size, size);
        }
        ctx.fill();
    }
}

// Improved Message Board Handling (Messages persist on refresh)
function postMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        const board = document.getElementById('messageBoard');
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = message;
        board.appendChild(div);

        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push({ text: message, timestamp: new Date().toISOString() });
        localStorage.setItem('messages', JSON.stringify(messages));

        input.value = '';
    }
}

function loadMessages() {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const board = document.getElementById('messageBoard');

    board.innerHTML = ''; // Clear existing messages
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = msg.text;
        board.appendChild(div);
    });
}

// Improved Guessing Game Logic (Handles number exhaustion correctly)
let guessesLeft = 10;
let targetNumber;

function initializeGame() {
    let availableNumbers = JSON.parse(localStorage.getItem('availableNumbers')) || [];

    if (!availableNumbers.length) {
        availableNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
        shuffle(availableNumbers);
    }

    targetNumber = availableNumbers.pop();
    localStorage.setItem('availableNumbers', JSON.stringify(availableNumbers));

    guessesLeft = 10;
    document.getElementById('guessesLeft').textContent = `Guesses left: ${guessesLeft}`;
    document.getElementById('gameFeedback').textContent = 'Start guessing!';
    document.getElementById('guessInput').value = '';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function makeGuess() {
    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value);
    const feedback = document.getElementById('gameFeedback');

    if (isNaN(guess) || guess < 1 || guess > 100) {
        feedback.textContent = 'Please enter a number between 1 and 100!';
        return;
    }

    guessesLeft--;
    document.getElementById('guessesLeft').textContent = `Guesses left: ${guessesLeft}`;

    if (guess === targetNumber) {
        feedback.textContent = 'Correct! Play again!';
        initializeGame();
    } else if (guessesLeft === 0) {
        feedback.textContent = `Game over! The number was ${targetNumber}. Try again!`;
        initializeGame();
    } else {
        feedback.textContent = guess < targetNumber ? 'Too low!' : 'Too high!';
    }

    input.value = '';
}

// Secure Initialization
window.onload = async () => {
    const accessAllowed = await checkIPAccess();
    if (accessAllowed) {
        document.getElementById('mainContent').classList.remove('hidden');
        logVisitor();
        loadMessages();
        initializeGame();
    }
};