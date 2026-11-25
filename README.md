# Paloju Dinesh — 3D Java developer portfolio (React + Vite + React Three Fiber)

Editorial layout: text on the left, a 3D model of a five-layer Java backend stack on the right. Scrolling lifts the layer for the
section you are reading and sends a "request packet" down the stack. Projects open as an accordion. Ctrl/Cmd+K opens a command palette. Dark by default, with a light theme.

## Run
    npm install
    npm run dev
    npm run build && npm run preview

## Edit content
Everything is in `src/data/content.json`. Amber highlighted `[EDIT ME]` marks anything still missing (repo links, demo URL, outcomes,
internship dates). Replace `public/Dinesh_Resume_Main.pdf` for a new resume and add `public/og.png` (1200x630) for link previews.

## Deploy to Vercel
1. Push the folder to a GitHub repo.
2. vercel.com > Add New > Project > import the repo.
3. Framework Vite, build `npm run build`, output `dist`, then Deploy.
4. If your domain changes, update the URLs in `index.html`, `public/sitemap.xml` and `public/robots.txt`.

## Fallbacks
No WebGL: a flat CSS version of the stack. Reduced motion: no smooth scroll, no spinning, instant state changes.
Phones: the 3D stage becomes a fixed strip at the top and the text scrolls underneath.
