// Secure IP Blocking (Now server-side check)
async function checkIPAccess() {
    try {
        const response = await fetch('/api/check-ip'); // Server-side validation
        const { accessDenied } = await response.json();

        if (accessDenied) {
            document.getElementById('accessDenied').style.display = 'flex';
            document.getElementById('passwordPrompt').style.display = 'none';
            document.getElementById('mainContent').style.display = 'none';
            return false;
        }
    } catch (e) {
        console.log('IP check failed:', e);
    }
    return true;
}

// Secure Password Verification (Now server-side authentication)
async function checkPassword() {
    const input = document.getElementById('passwordInput').value;

    try {
        const response = await fetch('/api/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: input })
        });

        const { authenticated } = await response.json();
        if (authenticated) {
            sessionStorage.setItem('authenticated', 'true'); // Using sessionStorage
            document.getElementById('passwordPrompt').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            logVisitor();
            loadMessages();
        } else {
            alert('Wrong password! Please try again.');
        }
    } catch (e) {
        console.log('Password verification failed:', e);
    }
}

// Secure IP Logging (Now using hashed IP)
async function logVisitor() {
    let visitorData = { timestamp: new Date().toISOString() };

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        visitorData.ipData = {
            ipHash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.ip)), // Secure hashing
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
        console.log('IP API failed:', e);
    }
}

// Optimized Fetch Requests (Improved timeout handling)
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);
        return response.json();
    } catch (error) {
        console.log(`Failed to fetch ${url}:`, error);
        return null;
    }
}

// Optimized Art Rendering
function drawAbstract() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { hue } = getTimeBasedValues();

    ctx.fillStyle = `hsl(${hue + Math.random() * 60}, 70%, 50%)`;
    ctx.beginPath();
    
    for (let i = 0; i < 10; i++) {
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

// Optimized Guessing Game Logic (Handles number exhaustion better)
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
    document.getElementById('gameFeedback').textContent = 'Start guessing, superstar!';
    document.getElementById('guessInput').value = '';
}

// Initialize Securely
window.onload = async () => {
    const accessAllowed = await checkIPAccess();
    if (accessAllowed && sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        logVisitor();
        loadMessages();
        initializeGame();
    }
};

