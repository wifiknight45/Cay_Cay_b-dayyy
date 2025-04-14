// Secure IP Blocking (Handled server-side)
async function checkIPAccess() {
    try {
        const response = await fetch('/api/check-ip');
        const { accessDenied } = await response.json();

        if (accessDenied) {
            document.getElementById('accessDenied').classList.remove('hidden');
            document.getElementById('mainContent').classList.add('hidden');
            return false;
        }
    } catch (error) {
        console.error('IP check failed:', error);
    }
    return true;
}

// Improved Guessing Game Logic
let guessesLeft = 10;
let targetNumber;

function initializeGame() {
    resetGameState();
    updateUI();
}

function resetGameState() {
    let availableNumbers = JSON.parse(localStorage.getItem('availableNumbers')) || [];

    if (!availableNumbers.length) {
        availableNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
        shuffle(availableNumbers);
    }

    targetNumber = availableNumbers.pop();
    localStorage.setItem('availableNumbers', JSON.stringify(availableNumbers));
    guessesLeft = 10;
}

function updateUI() {
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
    const guess = parseInt(input.value.trim());
    const feedback = document.getElementById('gameFeedback');

    if (!input.value.trim()) {
        feedback.textContent = 'Input cannot be empty!';
        return;
    }

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

// Improved Art Creation Feature
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

function getTimeBasedValues() {
    const now = new Date();
    return {
        hue: (now.getHours() / 24) * 360,
        sunAngle: ((now.getHours() - 6) % 12) / 12 * 180
    };
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawAbstract() {
    clearCanvas();
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
    clearCanvas();
    const { sunAngle, hours } = getTimeBasedValues();

    ctx.fillStyle = hours < 12 ? '#87ceeb' : '#ff4500';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

// Attach buttons to art functions
document.getElementById('abstractArtButton').addEventListener('click', drawAbstract);
document.getElementById('sunArtButton').addEventListener('click', drawSun);

// Improved Birthday Message Feature
function sendRandomBirthdayMessage() {
    const messages = [
        "Happy Birthday! Enjoy every moment of your special day!",
        "You're one year older and wiser! Celebrate big!",
        "May your birthday be filled with laughter and joy!",
        "Coraline taught us to appreciate the small things, like cake and presents!",
        "Hope your day is as bright as your smile!",
        "A very happy birthday to a bright star like you!",
        "‘For I know the plans I have for you,’ declares the Lord, ‘plans to prosper you and not to harm you, plans to give you hope and a future.’ - Jeremiah 29:11",
        "Never forget: You're braver than you believe, stronger than you seem, and smarter than you think!",
        "Make a wish and let it take flight!",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to: 'browncaydence14@gmail.com',
            subject: 'A Special Birthday Message for You!',
            message: randomMessage,
        }),
    })
        .then(() => alert('A special birthday message was sent to Caydence!'))
        .catch((err) => {
            console.error('Failed to send email:', err);
            alert('Failed to send the email. Please try again later.');
        });
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
