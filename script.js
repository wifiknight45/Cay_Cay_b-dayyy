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

// New feature: Send random birthday message
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
        // Add up to 50 messages
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
        .catch((err) => console.error('Failed to send email:', err));
}

// Button to trigger email sending
const sendEmailButton = document.createElement('button');
sendEmailButton.textContent = "Send a Special Birthday Message!";
sendEmailButton.onclick = sendRandomBirthdayMessage;
document.body.appendChild(sendEmailButton);

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