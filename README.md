# LoveOS X — Anniversary Edition ♡

A small static romantic website inspired by Mac OS X Leopard / Snow Leopard (2007–2009). No build step, server, database, or dependencies required.

## Preview locally
Open `index.html` in a browser. For best results, use a local server (for example, VS Code Live Server).

## Personalize it first
Open `config.js` and edit:
- `girlfriendName`
- `yourName`
- `anniversaryDate`
- `letter`
- `memories`
- `reasons`

You can add photos from your own relationship in `memories` or replace the example cat photos in `cats`.

## Add Pinterest finds to the cat gallery
Pinterest is the priority source for meme discovery. Pinterest frequently blocks direct third-party image embedding, so the site includes Pinterest search links instead of pretending that search-result thumbnails are stable image URLs.

To add a pin image you have permission to use:
1. Open the Pin on Pinterest.
2. Use the Pin's original source or download option if the creator allows it.
3. Put the image file in `assets/` (for example `assets/cat-meme-01.jpg`).
4. Add an item to the `cats` array in `config.js`:

```js
{ image: "assets/cat-meme-01.jpg", caption: "мемная подпись на русском", source: "Pinterest", pin: "https://www.pinterest.com/pin/..." }
```

Use images you own, have permission to use, or that are licensed for reuse. Keep the Pinterest Pin link as attribution. The default cat photographs are real Unsplash photographs, not AI-generated.

## Publish on GitHub Pages
1. Create a new GitHub repository, e.g. `loveos-anniversary`.
2. Upload the **contents** of this folder to the repository root (make sure `index.html` is at the root).
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to finish publishing. Your site URL will look like `https://YOUR-USERNAME.github.io/loveos-anniversary/`.

The included `.nojekyll` file tells Pages to serve this static site as-is. GitHub Pages sites are publicly accessible, so do not put private photos or sensitive details on the site unless you are comfortable sharing them publicly.

## Notes
- The interface and messages are in Russian by default.
- The gallery currently uses real cat photos hosted by Unsplash. Pinterest links open curated searches; individual Pinterest pins can be added to the gallery via `config.js`.
- This is a starter build. Replace generic memories and message text with details that are true to your relationship before sharing it.
