import './style.css';

const toggleButtons = [...document.querySelectorAll('.audio-player-button')];

const AudioMap: Record<string, string> = {
    'calm-chill-beautiful':
        'https://res.cloudinary.com/bhumit070/video/upload/v1704549507/tabs_communication_demo/fsi49xvo7teqezdvf27m.mp3',
    'happy-day-background-vlog-music':
        'https://res.cloudinary.com/bhumit070/video/upload/v1704549555/tabs_communication_demo/hkwnogd9dtilwjks5q6i.mp3',
    'motivational-electronic-distant':
        'https://res.cloudinary.com/bhumit070/video/upload/v1704549602/tabs_communication_demo/hjscmkvhwjparkkwr90d.mp3',
    'summer-party':
        'https://res.cloudinary.com/bhumit070/video/upload/v1704549660/tabs_communication_demo/qxt5eubsenubgb672dto.mp3',
    'tvari-tokyo-cafe':
        'https://res.cloudinary.com/bhumit070/video/upload/v1704549696/tabs_communication_demo/mj97jpqk3fznioylruew.mp3',
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
        if (currentPlayingAudio === audioPath) {
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

        currentPlayingAudio = audioPath;
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
