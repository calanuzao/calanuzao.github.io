const canvas = document.getElementById('unit-circle');
const ctx = canvas.getContext('2d');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angle-value');
const complexValue = document.getElementById('complex-value');

function drawUnitCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the circle
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, 2 * Math.PI);
    ctx.strokeStyle = '#89b4fa';
    ctx.stroke();

    // Draw the axes
    ctx.beginPath();
    ctx.moveTo(20, 200);
    ctx.lineTo(380, 200);
    ctx.moveTo(200, 20);
    ctx.lineTo(200, 380);
    ctx.strokeStyle = '#cdd6f4';
    ctx.stroke();

    // Label the axes
    ctx.fillStyle = '#cdd6f4';
    ctx.font = '16px Arial';
    ctx.fillText('Real', 350, 220);
    ctx.fillText('Imaginary', 210, 30);

    // Draw the angle
    const angle = angleInput.value * Math.PI / 180;
    const x = 200 + 180 * Math.cos(angle);
    const y = 200 - 180 * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#f38ba8';
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

