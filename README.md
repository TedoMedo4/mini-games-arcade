# Mini Games Arcade

A responsive, static mini-games website designed for GitHub Pages. No backend, build step, account, or external JavaScript libraries are required.

## Games
- Snake — keyboard controls
- Minesweeper — click to reveal, right-click to flag
- 2048 — keyboard or swipe controls
- Tetris — keyboard controls
- Reaction test — click/tap
- Memory — matching pairs

## Run locally
Open `index.html` in a modern browser. For a local server, run:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Publish with GitHub Pages
1. Create a new GitHub repository, for example `mini-games-arcade`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for the deployment. Your site will be available at `https://YOUR-USERNAME.github.io/mini-games-arcade/`.

## Notes
- Best scores are stored in the browser's `localStorage` on that device/browser.
- The site uses Google Fonts when online; it falls back to system fonts if unavailable.
- All game logic runs in the browser. GitHub Pages serves the static files.
