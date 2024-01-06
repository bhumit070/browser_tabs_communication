import './style.css';

const toggleButtons = [...document.querySelectorAll('.audio-player-button')];

const AudioMap: Record<string, string> = {
    'calm-chill-beautiful': '/audio/calm-chill-beautiful-141317.mp3',
    'happy-day-background-vlog-music':
        '/audio/happy-day-background-vlog-music-148320.mp3',
    'motivational-electronic-distant':
        '/audio/motivational-electronic-distant-132919.mp3',
    'summer-party': '/audio/summer-party-157615.mp3',
    'tvari-tokyo-cafe': '/audio/tvari-tokyo-cafe-159065.mp3',
};

let broadCast = new BroadcastChannel('audio-player');

let audio = new Audio();

audio.addEventListener('loadedmetadata', async () => {
    broadCast.postMessage({
        type: 'audio-played',
    });
    await audio.play();
});

audio.onerror = (e) => {
    console.error(e);
};

let currentPlayingAudio: string | undefined = undefined;
let currentPlayingButton: Element;
broadCast.onmessage = ({ data = {} }) => {
    const { type } = data || {};

    if (type === 'audio-played') {
        if (!audio.paused) {
            audio.pause();
            toggleButtonUi(currentPlayingButton, false);
        }
    }
};

function toggleButtonUi(button: Element, isPlaying: boolean) {
    if (button) {
        const classToAdd = isPlaying ? 'audio-controls-play' : 'audio-controls';
        const classToRemove = isPlaying
            ? 'audio-controls'
            : 'audio-controls-play';
        button.classList.remove(classToRemove);
        button.classList.add(classToAdd);
        button.textContent = isPlaying ? 'Pause' : 'Play';
    }
}

async function handleButtonClick(button: Element) {
    try {
        const buttonName = button.getAttribute('name');
        if (!buttonName) return;

        const audioPath = AudioMap[buttonName];
        const remoteAudio = `${window.location.protocol}//${window.location.host}${audioPath}`;
        if (currentPlayingAudio === remoteAudio) {
            if (audio.paused) {
                await audio.play();
                toggleButtonUi(button, true);
            } else {
                audio.pause();
                toggleButtonUi(button, false);
            }
            return;
        } else {
            toggleButtonUi(currentPlayingButton, false);
            currentPlayingButton = button;
        }

        currentPlayingAudio = remoteAudio;
        audio.src = currentPlayingAudio;
        document.body.appendChild(audio);
        toggleButtonUi(button, true);
    } catch (error) {
        console.error(error);
    }
}

if (toggleButtons.length) {
    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => handleButtonClick(button));
    });
}
