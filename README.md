# GameDay

A self-updating sports guide. Each time someone opens it, a small server function pulls today's games
(NFL, NBA, college football, college basketball, MLB) and the networks each one airs on, then marks
which ones are on your services. No database, no cron job, no API key.

## Put it online (free, about 5 minutes)

1. Make a free account at https://vercel.com
2. Install the CLI and deploy from this folder:
   ```
   npm i -g vercel
   cd gameday
   vercel --prod
   ```
   Accept the defaults. Vercel gives you a link like `https://gameday-yourname.vercel.app`.
   (No terminal? Upload this folder to a GitHub repo, then choose "Import Project" in Vercel.)

## Change what counts as "your services"
Edit `api/services.js` and redeploy (`vercel --prod`). Patterns are matched against network names.

## Change your time zone
In `api/games.js`, change `America/Los_Angeles` in the `today()` function. The page shows game
times in each viewer's own time zone.

## Good to know
- The data comes from ESPN's public scoreboard feed, which is unofficial and undocumented. It works without
  a key but ESPN can change it at any time. Fine for personal use; don't build a business on it.
- Games with no listed network show ❔. Local and regional channels show 🟡 because only you know your lineup.
- Results are cached for 2 minutes, and the page re-checks every 2 minutes while open.
