# Aesthetic Vinyl Player

A vinyl record player for your Spotify playlist. The record spins, the tonearm moves onto it when you press play, and the center label shows the cover of the current song.

Built with plain HTML, CSS and JavaScript and the [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk).

## Features

- Spinning record and animated tonearm
- Play, pause and resume (continues where you left off)
- Volume slider
- Album cover of the current song shown on the record label
- Clear alerts for an expired token, missing Premium or rate limits

## Requirements

- A **Spotify Premium** account (the Web Playback SDK does not work on free accounts)
- A Spotify access token with these scopes: `streaming`, `user-read-email`, `user-read-private`, `user-modify-playback-state`
- A local server, such as the VS Code **Live Server** extension. Opening `index.html` by double-clicking can cause problems with the Spotify SDK.

## Setup

1. Download or clone this repository.
2. Open `script.js` and edit the first two lines:
   ```js
   const TOKEN = 'PASTE_YOUR_NEW_TOKEN_HERE';
   const PLAYLIST_URI = 'spotify:playlist:YOUR_PLAYLIST_ID';
   ```
   Keep the quotes around both values.
3. Right-click `index.html` in VS Code and choose **Open with Live Server**.
4. Open the browser console (F12). When you see `Ready with Device ID: ...`, click **PLAY**.

## Getting a token

Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), then request an access token with the scopes listed above. Tokens expire after about one hour, so you will need to paste a new one each session.

## Important: keep your token private

Never commit a real token to GitHub. Anything in `script.js` is visible to anyone who can see the code. Before you commit, put the `PASTE_YOUR_NEW_TOKEN_HERE` placeholder back.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Red errors in `script.js` | Check that the token and playlist URI are wrapped in quotes |
| `authentication_error` in the console | The token is expired or invalid. Generate a new one |
| `account_error` in the console | Spotify Premium is required |
| Nothing happens when you click PLAY | Wait for `Ready with Device ID` in the console, then try again |
| Changes to the page don't show | Hard refresh with Ctrl+Shift+R |
| Your own image is replaced when a song plays | Remove the two `albumArt` lines in the `player_state_changed` listener in `script.js` |

## Project files

```
index.html   page structure
style.css    look of the record, tonearm and buttons
script.js    Spotify player and controls
```

## Customizing

- **Colors:** change the gradient on `.vinyl-record` and the button color in `style.css`.
- **Playlist:** change `PLAYLIST_URI` in `script.js`.
- **Default cover image:** put an image in the project folder and set it in the `<img id="albumArt">` tag in `index.html`.

## License

Add a license of your choice, for example MIT.
