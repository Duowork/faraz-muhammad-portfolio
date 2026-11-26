![Faraz Muhammad. Zaria · Nigeria. Fashion & multidisciplinary creative, born in Zaria.](docs/readme-cover.png)

# Faraz Muhammad: portfolio and gallery

Portfolio site for Faraz Muhammad (@sixhunred), a fashion and multidisciplinary creative from Zaria, Nigeria. It has a home page, a Work page, two gallery rooms (Wear and Art) with deep-linkable viewers, a Blog reading list, a Contact page and a custom 404.

Built with Vite and React 19 (JavaScript), React Router 7, and CSS Modules over design tokens.

## Getting started

Requires Node 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:5173 (generates responsive images on first run)
```

| Script            | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `npm run dev`     | Dev server. Runs `images` first.                                          |
| `npm run build`   | Production build into `dist/`. Runs `images` first.                       |
| `npm run preview` | Serves the production build locally.                                      |
| `npm run images`  | Builds AVIF/WebP/JPEG sizes from `assets-src/images` (incremental).       |
| `npm run icons`   | Regenerates the "FM" favicon set in `public/` (committed; rarely needed). |
| `npm test`        | Runs the Vitest suite once (`npm run test:watch` to watch).               |
| `npm run lint`    | ESLint, including React hooks and accessibility (jsx-a11y) rules.         |
| `npm run format`  | Prettier.                                                                 |

## Project structure

```
assets-src/images/     Full-size originals (source of truth for every photo)
public/                Favicons; generated images land in public/images (git-ignored)
scripts/               Image and icon generators (sharp, opentype.js)
src/
  content/             Editable site content (JSON) and the content API (index.js)
  generated/           image-manifest.json, written by `npm run images`
  styles/              tokens.css (design tokens) and global.css (base + shared primitives)
  components/
    layout/            Page shell, header, footer, root layout, status page
    gallery/           Room heading, frames, wall/pillar/floor parts
    viewer/            Viewer layout, stage, controls, thumbnails, navigation hook
    forms/             Fields, shared message form, Inquiry and Contact forms
    home/, work/, blog/ Page-specific pieces
    ui/                Picture, links, band, arrow
  hooks/               usePageTitle, useReveal, useSwipe, useViewerKeys
  lib/                 Pure helpers (forms, images, placeholders, viewer maths, transitions)
  pages/               One component per route
  routes.js            Route table (shared by the app and the tests)
```

Routes: `/`, `/work`, `/wear`, `/wear/look-i` to `look-vii`, `/art`, `/art/untitled-i` to `untitled-xiii`, `/blog`, `/contact`. Any other path, including unknown work slugs, shows the 404 page.

## Editing content

All copy and gallery data live in `src/content/*.json`. Values in square brackets such as `[YEAR]` or `[EMAIL]` are placeholders still to come from the client. They render as-is until replaced. Leave them in brackets rather than guessing.

| What                                      | Where                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| Bookings and press emails                 | `site.json` → `email`, `pressEmail` (become mailto links)                               |
| Comp card / press kit PDF                 | Put the file in `public/files/`, set `site.json` → `compCardUrl` to `/files/<name>.pdf` |
| Art titles, year, medium, dimensions      | `art.json` → `works[]`                                                                  |
| Look year, photographer, styling, caption | `wear.json` → `looks[]`                                                                 |
| Instagram post per work                   | `instagramUrl` on each work or look (`null` falls back to the profile)                  |
| Fashion weeks (brands walked, year)       | `work.json` → `fashionWeeks[]`                                                          |
| Brands, campaigns, editorials             | `work.json` → `projects[]` (`image: null` shows a grey placeholder)                     |
| Blog posts, platforms and profile links   | `blog.json` (see below)                                                                 |

Order in `works[]` and `looks[]` is the viewer order. The first entry is the room's featured work. Keep each `slug` stable, because URLs depend on it.

**Adding or replacing an image:** put the full-size JPEG in `assets-src/images/`, run `npm run images`, then reference it by file name without the extension (e.g. `"image": "art14"`). The script writes AVIF and WebP at 160–1600px plus a JPEG fallback, and records the intrinsic size so pages don't shift while loading. Write alt text that describes the work. Decorative images use `""`.

### Blog posts

The Blog is a curated reading list: every post opens on Medium or Substack in a new tab, and the site does not host articles. Each entry in `blog.json` → `posts[]` has:

```json
{
  "title": "On walking in Paris",
  "date": "2026-03-14",
  "platform": "medium",
  "url": "https://medium.com/@handle/on-walking-in-paris",
  "featured": true,
  "excerpt": "One or two lines from the piece (featured post only).",
  "cover": { "image": "blog-paris", "alt": "Describe the cover image" }
}
```

- `date` is `YYYY-MM-DD` and displays as "14 Mar 2026". Posts are listed newest first.
- The first post with `featured: true` is featured. Without one, the newest post is.
- `cover` (featured only) names an image in `assets-src/images` (4:3 works best). `null` shows the grey "[COVER IMAGE]" block.
- `platform` must be a key of `platforms`. `platforms` also drives the "Writing · on …" label and the "Follow the writing." buttons, so remove Substack (or Medium) there if Faraz only uses one.
- "More writing" shows 10 posts, then a "Load more" button.

## Forms

The Inquire form (on each art piece, and it includes the piece name) and the Contact form POST JSON to `VITE_FORM_ENDPOINT`. Any service that accepts a JSON POST and forwards it by email will work, e.g. a Formspree form URL. Set it in `.env.local` or in your host's environment settings:

```bash
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Until it is set, the forms validate and then show "Sending messages is not set up yet." Basic spam protection is a hidden honeypot field (`_gotcha`) plus a minimum fill time. Submissions that trip either are silently dropped.

## Environment variables

`.env` holds documented, non-secret defaults. Override them in `.env.local` (git-ignored) or on the host. Every `VITE_` value is public in the browser bundle.

| Variable             | Purpose                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `VITE_SITE_URL`      | Absolute site URL with no trailing slash. Makes the Open Graph image URL absolute (needed by most share previews). |
| `VITE_FORM_ENDPOINT` | Form delivery endpoint (see above).                                                                                |

## Deploying

`npm run build` produces a static site in `dist/`. Because routing happens in the browser, the host must serve `index.html` for unknown paths (an "SPA fallback" or rewrite of `/*` to `/index.html`). Otherwise deep links like `/art/untitled-iv` will 404 on refresh. Set `VITE_SITE_URL` and `VITE_FORM_ENDPOINT` in the host's build environment. The build needs `sharp`, which installs prebuilt binaries on common CI images.

## Behaviour notes

- **Viewers**: every work has its own URL. Prev/Next/thumbnails push history entries, so back retraces them. ← / → move between works (ignored while typing in a field), Esc and "Close ×" return to the room, and you can swipe on touch screens. Neighbouring images preload, and images crossfade over 350ms.
- **Motion**: 300ms page fades, and a slower 500ms crossfade between Wear and Art (View Transitions API, where supported). Text rises in once on scroll. Work cards fade and rise when filtered. Everything is disabled under `prefers-reduced-motion`.
- **Accessibility**: a visible 2px focus ring on every control, a skip link, landmarks and page titles. After navigation, focus moves to the new page's content. Screen readers hear the viewer's current work announced.
- **Images**: AVIF/WebP with `width`/`height` set. Lazy below the first screen. The home portrait, room features and the first viewer image load eagerly.

### Where the build deliberately differs from the boards

- **Home**: the portrait stays sticky through About and the Work teaser (the handoff notes say "sticky until the Gallery section"), so on tablet and desktop the Work teaser sits in the left column.
- **Home hero**: on tablet and desktop the location, name and tagline are vertically centred level with the portrait. The board aligned them to the bottom of the first screen.
- **Art room, tablet**: the wall is two columns, as the handoff notes ask. The tablet board shows three.
- **Wall frames**: the hover label reads "View ↗" in both rooms, because frames open the viewer. The Art board said "Instagram ↗". Instagram is linked from the viewer.
- **Work page, mobile**: all projects are listed (the board showed six of nine).

## Moving to Next.js later

The code is arranged so a port is mostly mechanical:

- `src/routes.js` maps one-to-one onto `app/` routes. The viewer routes become `app/art/[slug]/page.jsx` with `generateStaticParams` from the content, and unknown slugs call `notFound()`.
- `usePageTitle` becomes `metadata` / `generateMetadata`. Open Graph can then be per page.
- `useMessageForm` already uses a form action with the `(prevState, formData)` signature. Swap `submitForm` for a server action and keep the endpoint server-side.
- `TransitionLink`, `RootLayout` (scroll and focus handling) and the `react-router` hooks (`useParams`, `useNavigate`, `useLocation`) are the only router-specific pieces. Components that use hooks need `'use client'`.
- Content JSON, CSS Modules, tokens and the `@/` import alias work unchanged. Fontsource imports can move to `next/font`.

## Still needed from the client

These show on the site as bracketed placeholders (see [Editing content](#editing-content)):

- Real titles, year, medium and dimensions for each art work. Captions, photographer and styling for each look.
- The Instagram post URL for every gallery image.
- Work page: brands walked and year for Taipei, Seoul and Paris Fashion Weeks. Real brands, campaigns and editorials with images (currently grey placeholder blocks).
- Bookings and partnerships email, and press email.
- The comp card / press kit PDF.
- Confirmation of the handle spelling "sixhunred" (possibly a typo of "sixhundred").
- Confirmation of the art alt text, which is a first draft.
- Optional: photos for the home Wear and Art door tiles beyond the current hero images.
- Blog: whether Faraz publishes on Medium, Substack or both, and his profile URLs (the buttons link to medium.com and substack.com for now). The posts to list, with title, date and URL, plus an excerpt and cover for the featured one. Whether to add a Medium/Substack filter above the list.
