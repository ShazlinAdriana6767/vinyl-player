const TOKEN = '';
const PLAYLIST_URI = 'spotify:playlist:023zlP06tJBUQIjVudbPqU';


let player;
let deviceId;
let isPlaying = false;
let hasStarted = false;
let isDebouncing = false;

const playBtn = document.getElementById('playBtn');
const vinyl = document.getElementById('vinyl');
const tonearm = document.getElementById('tonearm');
const albumArt = document.getElementById('albumArt');
const volumeControl = document.getElementById('volumeControl');

// Update the turntable visuals + button text in one place
function setPlayingUI(playing) {
  isPlaying = playing;
  tonearm.classList.toggle('playing', playing);
  vinyl.classList.toggle('spinning', playing);
  playBtn.textContent = playing ? 'PAUSE' : 'PLAY';
}

window.onSpotifyWebPlaybackSDKReady = () => {
  if (TOKEN === 'PASTE_YOUR_NEW_TOKEN_HERE') {
    console.error('Add your Spotify token at the top of script.js');
  }

  player = new Spotify.Player({
    name: 'Aesthetic Vinyl Player',
    getOAuthToken: cb => cb(TOKEN),
    volume: parseFloat(volumeControl.value)
  });

  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID:', device_id);
    deviceId = device_id;
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline:', device_id);
    deviceId = null;
  });

  // Keep the UI in sync with what Spotify is really doing
  player.addListener('player_state_changed', state => {
    if (!state) return;
    setPlayingUI(!state.paused);
    const cover = state.track_window.current_track.album.images[0];
    if (cover) albumArt.src = cover.url;
  });

  player.addListener('initialization_error', ({ message }) => console.error('Init error:', message));
  player.addListener('authentication_error', ({ message }) => {
    console.error('Auth error:', message);
    alert('Spotify token is invalid or expired. Generate a new one and paste it into script.js.');
  });
  player.addListener('account_error', ({ message }) => {
    console.error('Account error:', message);
    alert('Spotify Premium is required for this player.');
  });
  player.addListener('playback_error', ({ message }) => console.error('Playback error:', message));

  player.connect();
};

// Play / Pause button
playBtn.addEventListener('click', async () => {
  if (!player || !deviceId) {
    return alert('Connecting to Spotify... please wait a moment, then try again.');
  }
  if (isDebouncing) return; // protects against rapid clicks / rate limits
  isDebouncing = true;

  try {
    // Required by browsers so audio is allowed to start from a click
    await player.activateElement();

    if (isPlaying) {
      await player.pause();
    } else if (hasStarted) {
      await player.resume(); // continue where you left off
    } else {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ context_uri: PLAYLIST_URI }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
          }
        }
      );

      if (response.ok || response.status === 204) {
        hasStarted = true;
        setPlayingUI(true);
      } else if (response.status === 401) {
        alert('Token expired or invalid. Generate a new one.');
      } else if (response.status === 403) {
        alert('Spotify refused playback. Check that you have Premium and the token has the right scopes.');
      } else if (response.status === 404) {
        alert('Player or playlist not found. Refresh the page and try again.');
      } else if (response.status === 429) {
        alert('Spotify rate limit hit. Please wait a moment before trying again.');
      } else {
        console.error('Playback error status:', response.status);
      }
    }
  } catch (err) {
    console.error('Playback failed:', err);
  }

  setTimeout(() => { isDebouncing = false; }, 800);
});

// Volume slider
volumeControl.addEventListener('input', e => {
  if (player) player.setVolume(parseFloat(e.target.value));
});