let audioContext;
let analyser;
let source;
let canvas;
let ctx;
let animationId;
let isPlaying = false;
let audioBuffer;

function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            console.log("Audio context initialized successfully");
        } catch (error) {
            console.error("Failed to initialize audio context:", error);
        }
    }
}

function setupCanvas() {
    canvas = document.getElementById('oscilloscope');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
}

function handleFileUpload(event) {
    initAudio(); // Ensure audio context is initialized

    const file = event.target.files[0];
    const reader = new FileReader();

    // Check if the file type is supported
    const supportedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!supportedTypes.includes(file.type)) {
        console.error("Unsupported file type. Please upload an MP3, WAV, or OGG file.");
        document.getElementById('status').textContent = "Unsupported file type. Please upload an MP3, WAV, or OGG file.";
        return;
    }

    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        audioContext.decodeAudioData(arrayBuffer, 
            (buffer) => {
                audioBuffer = buffer;
                console.log("Audio file decoded successfully");
                document.getElementById('playPauseBtn').disabled = false;
                document.getElementById('status').textContent = "Protect Your Ears | Copyleft (ɔ) All Rights Reversed";
            },
            (error) => {
                console.error("Error decoding audio data:", error);
                document.getElementById('status').textContent = "Error decoding audio file. Please try a different file.";
            }
        );
    };

    reader.onerror = function(error) {
        console.error("Error reading file:", error);
        document.getElementById('status').textContent = "Error reading file. Please try again.";
    };

    reader.readAsArrayBuffer(file);
}

function togglePlayPause() {
    if (!audioContext) {
        initAudio();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    if (!audioBuffer) {
        console.error("No audio file loaded");
        return;
    }

    if (isPlaying) {
        if (source) {
            source.stop();
            cancelAnimationFrame(animationId);
        }
        isPlaying = false;
        document.getElementById('playPauseBtn').textContent = 'Play';
    } else {
        try {
            source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            source.start(0);
            draw();
            isPlaying = true;
            document.getElementById('playPauseBtn').textContent = 'Pause';
            console.log("Audio playback started");
        } catch (error) {
            console.error("Error starting playback:", error);
            document.getElementById('status').textContent = "Error playing audio. Please try reloading the page.";
        }
    }
}

function draw() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#89b4fa'; // Catppuccin blue
    ctx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Add a glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#89b4fa'; // Catppuccin blue
    ctx.stroke();

    animationId = requestAnimationFrame(draw);
}

const fileInput = document.getElementById('audioUpload');
const fileChosen = document.getElementById('file-chosen');

fileInput.addEventListener('change', function(){
    if(this.files && this.files.length > 0){
        fileChosen.textContent = this.files[0].name;
    } else {
        fileChosen.textContent = 'No file chosen';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    setupCanvas();
    document.getElementById('audioUpload').addEventListener('change', handleFileUpload);
    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('playPauseBtn').disabled = true;
});
