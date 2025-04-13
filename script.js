// Art Canvas
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

// Consent Management
function acceptConsent() {
    localStorage.setItem('consent', 'accepted');
    document.getElementById('consentBanner').style.display = 'none';
    logVisitor();
}

function declineConsent() {
    localStorage.setItem('consent', 'declined');
    document.getElementById('consentBanner').style.display = 'none';
}

function checkConsent() {
    const consent = localStorage.getItem('consent');
    if (!consent) {
        document.getElementById('consentBanner').style.display = 'block';
    } else if (consent === 'accepted') {
        logVisitor();
    }
}

// Generate UUID for unique visitors
function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Visitor Logging
async function logVisitor() {
    if (localStorage.getItem('consent') !== 'accepted') return;

    // Generate or retrieve visitor ID
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = generateUUID();
        localStorage.setItem('visitorId', visitorId);
    }

    // Collect metadata
    const metadata = {
        visitorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        platform: navigator.platform,
        connection: navigator.connection ? {
            type: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink
        } : 'unknown',
        vpnSuspected: false,
        ipData: {}
    };

    // VPN Detection (via ipapi.co)
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        metadata.ipData = {
            ip: 'hashed', // Not storing raw IP
            country: data.country_name,
            city: data.city,
            isp: data.org,
            isDataCenter: data.org.includes('Hosting') || data.org.includes('Cloud')
        };
        metadata.vpnSuspected = metadata.ipData.isDataCenter || data.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        console.log('IP API failed:', e);
    }

    // WebRTC Check (limited, often disabled)
    try {
        if (window.RTCPeerConnection) {
            metadata.webrtc = 'enabled';
        } else {
            metadata.webrtc = 'disabled';
        }
    } catch (e) {
        metadata.webrtc = 'error';
    }

    // Store locally (for demo; use Firebase for persistence)
    let logs = JSON.parse(localStorage.getItem('visitorLogs') || '[]');
    logs.push(metadata);
    localStorage.setItem('visitorLogs', JSON.stringify(logs));

    // Optional: Send to Firebase (uncomment if configured)
    /*
    firebase.analytics().logEvent('visitor', metadata);
    */
}

// Art Functions
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

// Initialize
window.onload = checkConsent;
