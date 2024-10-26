const canvas = document.getElementById('unit-circle');
const ctx = canvas.getContext('2d');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angle-value');
const complexValue = document.getElementById('complex-value');

function drawUnitCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 80; // Increased margin

    // Draw the circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#89b4fa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the axes
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 30, centerY);
    ctx.lineTo(centerX + radius + 30, centerY);
    ctx.moveTo(centerX, centerY - radius - 30);
    ctx.lineTo(centerX, centerY + radius + 30);
    ctx.strokeStyle = '#cdd6f4';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label the axes
    ctx.fillStyle = '#cdd6f4';
    ctx.font = '18px Arial'; // Increased font size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Real', centerX + radius + 50, centerY);
    ctx.fillText('Imaginary', centerX, centerY - radius - 50);

    // Draw radian measurements
    const radianMeasurements = [
        { angle: Math.PI / 6, label: 'π/6' },
        { angle: Math.PI / 4, label: 'π/4' },
        { angle: Math.PI / 3, label: 'π/3' },
        { angle: 2 * Math.PI / 3, label: '2π/3' },
        { angle: 3 * Math.PI / 4, label: '3π/4' },
        { angle: 5 * Math.PI / 6, label: '5π/6' },
        { angle: 7 * Math.PI / 6, label: '7π/6' },
        { angle: 5 * Math.PI / 4, label: '5π/4' },
        { angle: 4 * Math.PI / 3, label: '4π/3' },
        { angle: 5 * Math.PI / 3, label: '5π/3' },
        { angle: 7 * Math.PI / 4, label: '7π/4' },
        { angle: 11 * Math.PI / 6, label: '11π/6' }
    ];

    ctx.font = '16px Arial'; // Increased font size
    radianMeasurements.forEach(({ angle, label }) => {
        const x = centerX + (radius + 35) * Math.cos(angle);
        const y = centerY - (radius + 35) * Math.sin(angle);
        ctx.fillText(label, x, y);
    });

    // Add cardinal point labels
    ctx.font = '18px Arial'; // Increased font size
    ctx.fillText('π/2', centerX, centerY - radius - 30);
    ctx.fillText('3π/2', centerX, centerY + radius + 30);
    ctx.fillText('π', centerX - radius - 30, centerY);
    ctx.fillText('0', centerX + radius + 30, centerY);

    // Draw the angle
    const angle = angleInput.value * Math.PI / 180;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#f38ba8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the point on the circle
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#f38ba8';
    ctx.fill();

    // Update the angle value display
    angleValue.textContent = `${angleInput.value}°`;

    // Calculate and display the complex number
    const realPart = Math.cos(angle).toFixed(3);
    const imagPart = Math.sin(angle).toFixed(3);
    complexValue.textContent = `${realPart} + ${imagPart}i`;
}

angleInput.addEventListener('input', drawUnitCircle);
drawUnitCircle();
