# Ani Pfeifer — portfolio site

Plain HTML/CSS/JS. No build step needed: drag the folder into Netlify, or push to GitHub and import into Vercel.

## Things to swap
- **Ani font**: `fonts/ani.woff2` / `Ani.ttf` was built from your scan (low resolution). If you export a real .ttf/.otf from MyScriptFont, replace those files (keep the name `ani.woff2`, or edit the `@font-face "Hand"` line in `css/style.css`).
- **Cinder** is still a placeholder (Anton). Body text is Barlow.
- **Faces**: landing cycles portrait.webp, face-1.webp, face-2.webp (same canvas). Add more in `data-faces` on `<div class="faces">` in `index.html`.
- **Rings**: `img/ring-1..3.webp`, animated in `js/main.js` (`initRipples`). Landing page only.
- **Stars** are static (traced from your drawings, in `img/*.svg`). Tabs are traced from your drawn boxes.
- **Vimeo**: in each `projects/<name>.html`, replace the `<img>` + "Film coming soon" in `.player` with the Vimeo `<iframe>`.
- **Email**: `contact.html` still has `your@email.com`.
