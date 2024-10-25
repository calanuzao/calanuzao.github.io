let timeDomainPlot, frequencyDomainPlot, unitCirclePlot;
let animationId;

function initPlots() {
    // No need to initialize plot elements here
}

function generateSignal(type, frequency, phase, numSamples) {
    const t = Array.from({length: numSamples}, (_, i) => i / numSamples);
    const phaseRad = phase * Math.PI / 180;
    let signal;

    switch (type) {
        case 'sine':
            signal = t.map(ti => Math.sin(2 * Math.PI * frequency * ti + phaseRad));
            break;
        case 'square':
            signal = t.map(ti => Math.sign(Math.sin(2 * Math.PI * frequency * ti + phaseRad)));
            break;
        case 'sawtooth':
            signal = t.map(ti => 2 * ((frequency * ti + phase / 360) % 1) - 1);
            break;
        default:
            signal = t.map(() => 0);
    }

    return signal;
}

function computeDFT(signal) {
    const N = signal.length;
    const X = new Array(N).fill().map(() => ({re: 0, im: 0}));

    for (let k = 0; k < N; k++) {
        for (let n = 0; n < N; n++) {
            const angle = (2 * Math.PI * k * n) / N;
            X[k].re += signal[n] * Math.cos(angle);
            X[k].im -= signal[n] * Math.sin(angle);
        }
    }

    return X;
}

function computeIDFT(dft) {
    const N = dft.length;
    const signal = new Array(N).fill(0);

    for (let n = 0; n < N; n++) {
        for (let k = 0; k < N; k++) {
            const angle = (2 * Math.PI * k * n) / N;
            signal[n] += (dft[k].re * Math.cos(angle) - dft[k].im * Math.sin(angle)) / N;
        }
    }

    return signal;
}

function updatePlots() {
    const signalType = document.getElementById('inputSignal').value;
    const frequency = parseFloat(document.getElementById('frequency').value);
    const phase = parseFloat(document.getElementById('phase').value);
    const numSamples = parseInt(document.getElementById('numSamples').value);

    const signal = generateSignal(signalType, frequency, phase, numSamples);
    const dft = computeDFT(signal);

    const t = Array.from({length: numSamples}, (_, i) => i / numSamples);
    const magnitudes = dft.map(x => Math.sqrt(x.re * x.re + x.im * x.im));
    const phases = dft.map(x => Math.atan2(x.im, x.re));

    const commonLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#cdd6f4', size: 14 },
        xaxis: { gridcolor: '#cdd6f4', zerolinecolor: '#cdd6f4', title: { standoff: 20 } },
        yaxis: { gridcolor: '#cdd6f4', zerolinecolor: '#cdd6f4', title: { standoff: 20 } },
        margin: { l: 60, r: 40, t: 60, b: 60 },
        autosize: true
    };

    Plotly.newPlot('timeDomainPlot', [{
        x: t,
        y: signal,
        type: 'scatter',
        mode: 'lines',
        name: 'Original Signal',
        line: {color: '#89b4fa'}
    }], {
        ...commonLayout,
        title: 'Time Domain',
        xaxis: {...commonLayout.xaxis, title: {text: 'Time (s)', standoff: 20}},
        yaxis: {...commonLayout.yaxis, title: {text: 'Amplitude', standoff: 20}}
    });

    Plotly.newPlot('frequencyDomainPlot', [{
        x: t.map(ti => ti * numSamples),
        y: magnitudes,
        type: 'bar',
        name: 'Magnitude Spectrum',
        marker: {color: '#89b4fa'}
    }], {
        ...commonLayout,
        title: 'Frequency Domain',
        xaxis: {...commonLayout.xaxis, title: {text: 'Frequency (Hz)', standoff: 20}},
        yaxis: {...commonLayout.yaxis, title: {text: 'Magnitude', standoff: 20}}
    });

    Plotly.newPlot('phasePlot', [{
        x: t.map(ti => ti * numSamples),
        y: phases,
        type: 'bar',
        name: 'Phase Spectrum',
        marker: {color: '#89b4fa'}
    }], {
        ...commonLayout,
        title: 'Phase Spectrum',
        xaxis: {...commonLayout.xaxis, title: {text: 'Frequency (Hz)', standoff: 20}},
        yaxis: {...commonLayout.yaxis, title: {text: 'Phase (radians)', standoff: 20}}
    });

    drawUnitCircle(dft, frequency, phase, numSamples);
}

function drawUnitCircle(dft, frequency, phase, numSamples) {
    const canvas = document.getElementById('unit-circle');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('unitCirclePlot');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);
    
    // Draw the circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#89b4fa';
    ctx.stroke();

    // Draw the axes
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 20, centerY);
    ctx.lineTo(centerX + radius + 20, centerY);
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.strokeStyle = '#cdd6f4';
    ctx.stroke();

    // Label the axes
    ctx.fillStyle = '#cdd6f4';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Real', width - 30, centerY + 20);
    ctx.fillText('Imaginary', centerX, 20);

    // Draw DFT vectors
    dft.forEach((x, k) => {
        const angle = -2 * Math.PI * k / numSamples + phase * Math.PI / 180;
        const magnitude = Math.sqrt(x.re * x.re + x.im * x.im);
        const normalizedMagnitude = magnitude / Math.max(...dft.map(x => Math.sqrt(x.re * x.re + x.im * x.im)));
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + normalizedMagnitude * radius * Math.cos(angle),
            centerY + normalizedMagnitude * radius * Math.sin(angle)
        );
        ctx.strokeStyle = `hsl(${360 * k / numSamples}, 70%, 50%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
    });
}

function init() {
    document.getElementById('frequencyValue').textContent = `${document.getElementById('frequency').value} Hz`;
    document.getElementById('phaseValue').textContent = `${document.getElementById('phase').value}°`;
    updatePlots();

    document.getElementById('inputSignal').addEventListener('change', updatePlots);
    document.getElementById('frequency').addEventListener('input', updatePlots);
    document.getElementById('phase').addEventListener('input', updatePlots);
    document.getElementById('numSamples').addEventListener('input', updatePlots);

    animationId = requestAnimationFrame(animate);
}

function animate() {
    const frequency = parseFloat(document.getElementById('frequency').value);
    const phase = parseFloat(document.getElementById('phase').value);
    const numSamples = parseInt(document.getElementById('numSamples').value);
    
    const signal = generateSignal(document.getElementById('inputSignal').value, frequency, phase, numSamples);
    const dft = computeDFT(signal);
    
    drawUnitCircle(dft, frequency, phase, numSamples);
    
    requestAnimationFrame(animate);
}

window.addEventListener('load', init);

document.getElementById('frequency').addEventListener('input', (e) => {
    document.getElementById('frequencyValue').textContent = `${e.target.value} Hz`;
    updatePlots();
});

document.getElementById('phase').addEventListener('input', (e) => {
    document.getElementById('phaseValue').textContent = `${e.target.value}°`;
    updatePlots();
});

document.getElementById('numSamples').addEventListener('input', (e) => {
    updatePlots();
});
