## Sound Explorer

A tiny client‑side web app to search the Freesound library and instantly play a high‑quality MP3 preview for the first matching result.

### Features
- **Text search**: Enter a sound description (e.g., "piano", "waves", "birds").
- **Inline playback**: Plays the HQ MP3 preview in the built‑in player.
- **Recent searches**: Clickable tags for your last few queries.
- **Error handling**: Clear inline messages with a quick retry.

### Project structure
```
aoudio-gnerator/
  ├── index.html
  ├── script.js
  └── style.css
```

### Prerequisites
- A modern browser.
- A Freesound account and API token. See the official docs: [Freesound API docs](https://freesound.org/docs/api/).

### Quick start
1) Open the project in your editor.

2) Add your Freesound API token in `script.js`:
```js
// script.js
const API_KEY = "YOUR_FREESOUND_API_TOKEN";
```

3) Serve the files locally (recommended to avoid browser restrictions):
- VS Code: use the "Live Server" extension.
- Python (3.x):
```bash
python -m http.server 5500
```
Then open `http://localhost:5500/` and navigate to the project folder.

4) Use the app: type a query and click "Find". Click a recent tag to re‑run a search. Use the replay button to play again.

### Configuration
- **API token**: stored in `script.js` as `API_KEY`. For production, avoid exposing secrets in client code. Consider a lightweight proxy (server) that injects the token and calls the Freesound API on behalf of the client.
- **Themes and input size**: `script.js` includes handlers for `#themeToggle` and `#sizeToggle`. If you want these controls, add buttons to `index.html`, for example:
```html
<div class="controls">
  <button id="themeToggle" title="Change theme">Theme</button>
  <button id="sizeToggle" title="Change input size">Size</button>
  <!-- style these via CSS as desired -->
  <!-- place inside the header area next to the title -->
  
</div>
```
Alternatively, guard the event listeners in `script.js` if you decide not to include these buttons:
```js
if (themeToggle) themeToggle.addEventListener('click', rotateColorTheme);
if (sizeToggle) sizeToggle.addEventListener('click', cycleInputSize);
```

### Known issues and notes
- **Stylesheet filename**: `index.html` links to `styles.css`, while the repository contains `style.css` (currently empty). Either update the link in `index.html` to `style.css` or rename the file to match. Populate the stylesheet with your preferred styles.
- **Missing toggle buttons**: As noted above, `script.js` references `#themeToggle` and `#sizeToggle`, which are not present in `index.html`. Add them (see example) or guard the listeners to prevent runtime errors.
- **API quota/auth**: A `401` or `403` indicates a missing/invalid token or quota issues. Verify your token and usage limits.
- **Autoplay**: Some browsers block autoplay. If playback does not start automatically, press play manually.

### Troubleshooting
- **No results found**: Try a broader term (e.g., "piano" instead of a very specific model).
- **Network/CORS issues**: Serve via `http://localhost` using a simple static server as shown above.
- **Preview not available**: Not all results guarantee the same preview qualities; the code prefers `preview-hq-mp3` when present.

### Roadmap ideas
- Select among multiple results instead of autoplaying the first.
- Persist recent searches between sessions (e.g., `localStorage`).
- Add waveform visualization and better player controls.
- Improve theming and sizing controls in the UI.

### Acknowledgements
- Powered by the [Freesound API](https://freesound.org/docs/api/).

### License
Add a license of your choice (e.g., MIT) if you plan to share or publish this project.


