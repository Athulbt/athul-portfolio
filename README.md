# 🌆 Athul Babu Teeyancheri: Portfolio

Welcome to **Stackopolis 2077**: my portfolio, styled like a Cyberpunk game. My 3D avatar holo-calls you as your Fixer, walks you through my work in game-style subtitles, cracks programmer jokes, and chats with you using AI.

**Live site:** _add your Vercel URL here_ · **Author:** [Athul Babu Teeyancheri](https://www.linkedin.com/in/athulbabu)

---

## ✨ Features

| Feature | How it works |
| --- | --- |
| 🌃 Realistic night city | An AI-generated cyberpunk skyline behind everything, with rain, neon bokeh, light trails, film grain and scanlines on top. Drop in a video loop and it plays instead. |
| 🎮 Game-style UI | Cyberpunk 2077-inspired HUD: angled panels, glitch headings, a character sheet, gigs, inventory with loot rarity, cyberware and achievements. |
| 📞 Holo-call Fixer | My 3D avatar (in a cyberpunk outfit) follows you through the site in a holo-call window and talks in game-style subtitles. |
| 💬 AI chatbot | Accept the holo-call to chat. Runs on Google Gemini's free tier, with daily limits per visitor and a built-in fallback guide. |
| 😂 Jokes | The Fixer slips programmer jokes into the conversation. |
| 🧩 Project deep dives | Each project opens an "under the hood" view with real code from my repos and an explanation of it. |
| 🌐 "Need a website?" | One click opens an email to me with the subject already filled in. |
| ⌨️ Hidden terminal | Press `` ` `` and type `help`. Try `sudo hire-athul`. |
| 📖 How I built this | This README is rendered inside the site, with a link to the source code. |

## 🛠️ Tech stack

- **Next.js 16** (App Router, Cache Components) + **React 19**
- **TypeScript** throughout
- **Tailwind CSS 4** for styling
- **Motion** (Framer Motion) for every animation
- **Google Gemini API** (free tier) for the chatbot
- **GitHub REST API** for live repo stats
- Deployed for free on **Vercel**

## 🏗️ Architecture: MVC

I organised the app as Model-View-Controller so that data, logic and UI stay separate:

```
src/
├── models/                       M: typed data, no UI
│   ├── types.ts
│   ├── profile.model.ts          profile, education, certifications
│   ├── experience.model.ts       jobs + company logos
│   ├── project.model.ts          projects + real code highlights
│   ├── skill.model.ts            tech stack
│   ├── chat.model.ts             chatbot persona, jokes, limits
│   └── media.model.ts            names of the media files (city, avatar poses)
├── services/                     talk to the outside world
│   ├── github.service.ts         GitHub API ("use cache", refreshed hourly)
│   ├── gemini.service.ts         Gemini API (server-only, key never reaches the browser)
│   ├── media.service.ts          detects which media files exist in public/media
│   └── guide-bot.ts              free built-in chatbot brain (fallback)
├── controllers/                  C: business logic
│   ├── portfolio.controller.ts   merges models + live GitHub data into one view model
│   └── chat.controller.ts        validation, rate limits, AI call, fallback
├── views/                        V: React components, presentation only
│   ├── components/               CityBackdrop, HoloCall, HoloPortrait, ChatPanel, Terminal, BuildInfo
│   └── sections/                 Hero, About, Experience, Projects, Skills, Education, Contact, Footer
└── app/                          routes
    ├── page.tsx                  calls the controller, renders the views
    ├── api/portfolio/route.ts    GET  /api/portfolio: the view model as JSON
    └── api/chat/route.ts         POST /api/chat: the chatbot endpoint
```

To change any content (jobs, projects, skills, jokes), edit the files in `src/models`. The views never hold data.

## 🧠 How the chatbot stays free

1. The browser sends the conversation to `/api/chat` on my server.
2. `chat.controller.ts` trims the input, keeps only the last few messages, and checks the limits: **20 AI messages per visitor per day** and a site-wide daily cap that stays inside Gemini's free quota.
3. `gemini.service.ts` calls Gemini with a system prompt built from my real profile data, so it only talks about facts from this site.
4. If there's no API key, the quota is used up or Gemini is down, `guide-bot.ts` answers instead. It's a free, rule-based bot that still knows my projects and jokes.

## 🎨 How I built it

1. **Planned the content** from my resume, experience certificate and GitHub repos.
2. **Scaffolded** with `create-next-app` (TypeScript, Tailwind, App Router).
3. **Wrote the models first**: typed data for profile, jobs, projects and skills.
4. **Added services and controllers**: live GitHub stats with hourly caching, then the chatbot pipeline.
5. **Visuals**: the city backdrop was generated for free with [Pollinations.ai](https://pollinations.ai), and the Fixer is my own 3D avatar. No real photos are used.
6. **Designed a game UI** inspired by Cyberpunk 2077: Orbitron and Rajdhani fonts, signal yellow and cyan, clip-path angled panels, CSS glitch text and a canvas rain effect.
7. **Used real logos**: company logos from their own websites, tech logos from Devicon and Simple Icons.
8. **Tested** on desktop and mobile, then ran lint, the type-check and a production build.

## 🖼️ Swapping the media

All realistic visuals live in `public/media/`. Replace any file with your own (for example clips from Higgsfield) and rebuild:

| File | Used for |
| --- | --- |
| `city-still.jpg` / `city-loop.mp4` | Background (a video wins over the image) |
| `guide-portrait.jpg` | Default avatar picture (my cyberpunk avatar) and social share image |
| `guide-<pose>.jpg` / `.mp4` | Avatar poses: `wave`, `point`, `talk`, `laugh`, `laptop`, `thumbs` |

## 🚀 Run locally

```bash
git clone https://github.com/Athulbt/athul-portfolio.git
cd athul-portfolio
npm install
cp .env.example .env.local   # optional: add a free Gemini key for AI chat
npm run dev
```

Open http://localhost:3000

## ☁️ Deploy for free on Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and import `athul-portfolio`.
3. Under **Environment Variables**, add `GEMINI_API_KEY`. Get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
4. Click **Deploy**. Every push to `main` redeploys automatically.

> 🔐 Never commit `.env.local` or any API key. `.gitignore` already blocks env files, except `.env.example`, which has no secrets.

## 📬 Contact

Want a website built, or just want to say hi? Email me at **athuljr240701@gmail.com**.
