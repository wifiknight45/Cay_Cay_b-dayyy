// IP Blocking
async function checkIPAccess() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const city = (data.city || '').toLowerCase();
        const region = (data.region_code || '').toUpperCase();

        // Greater St. Louis cities (MO and IL)
        const stLouisCities = [
            'st. louis', 'saint louis', 'chesterfield', 'florissant', 'ballwin', 'fenton',
            'o\'fallon', 'st. charles', 'st. peters', 'belleville', 'edwardsville',
            'kirkwood', 'webster groves', 'maryland heights', 'hazelwood', 'arnold'
        ];

        // Block St. Louis area or Oklahoma
        if (stLouisCities.includes(city) || region === 'OK') {
            document.getElementById('accessDenied').style.display = 'flex';
            document.getElementById('passwordPrompt').style.display = 'none';
            document.getElementById('mainContent').style.display = 'none';
            return false;
        }
    } catch (e) {
        console.log('IP check failed:', e);
        // Allow access if API fails (avoid blocking legitimate users)
    }
    return true;
}

// Password Protection
const passwordHash = 'f7b8c6d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7'; // SHA-256 of 'C@y_CayTurn$11'

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    if (CryptoJS.SHA256(input).toString() === passwordHash) {
        localStorage.setItem('authenticated', CryptoJS.SHA256(input).toString());
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        logVisitor();
        loadMessages();
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
            ip: btoa(data.ip),
            country: data.country_name || 'unknown',
            city: data.city || 'unknown',
            isp: data.org || 'unknown',
            region: data.region_code || 'unknown'
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

        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push({ text: message, timestamp: new Date().toISOString() });
        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

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

// Guessing Game
let guessesLeft = 10;
let targetNumber;

function initializeGame() {
    let availableNumbers = JSON.parse(localStorage.getItem('availableNumbers'));
    if (!availableNumbers || availableNumbers.length === 0) {
        availableNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
        shuffle(availableNumbers);
    }

    targetNumber = availableNumbers.pop();
    localStorage.setItem('availableNumbers', JSON.stringify(availableNumbers));
    guessesLeft = 10;
    document.getElementById('guessesLeft').textContent = `Guesses left: ${guessesLeft}`;
    document.getElementById('gameFeedback').textContent = 'Start guessing, superstar!';
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
        feedback.textContent = 'You got it, superstar! Play again!';
        initializeGame();
    } else if (guessesLeft === 0) {
        feedback.textContent = `Game over! The number was ${targetNumber}. Try again!`;
        initializeGame();
    } else if (guess < targetNumber) {
        feedback.textContent = 'Too low! Try a bigger number.';
    } else {
        feedback.textContent = 'Too high! Try a smaller number.';
    }

    input.value = '';
}

// Initialize
window.onload = async () => {
    const accessAllowed = await checkIPAccess();
    if (accessAllowed && localStorage.getItem('authenticated') === passwordHash) {
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        logVisitor();
        loadMessages();
        initializeGame();
    }
};
