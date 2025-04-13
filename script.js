const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

function getTimeBasedValues() {
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    // Map time to 0–180 degrees (6 AM to 6 PM)
    const sunAngle = ((hours - 6) % 12) / 12 * 180;
    // Hue for colors (0–360)
    const hue = (hours / 24) * 360;
    return { sunAngle, hue, hours };
}

function drawAbstract() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { hue } = getTimeBasedValues();

    // Draw 10 random shapes
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 50 + 20;
        const shapeType = Math.floor(Math.random() * 2); // 0: circle, 1: rect
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

    // Sky background (blue to orange gradient based on time)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (hours < 12) {
        gradient.addColorStop(0, '#87ceeb'); // Morning sky
        gradient.addColorStop(1, '#f0e68c');
    } else {
        gradient.addColorStop(0, '#ff4500'); // Evening sky
        gradient.addColorStop(1, '#483d8b');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#228b22';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    // Sun
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
