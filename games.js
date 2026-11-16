const S = require("./services.js");

const LEAGUES = [
  { key: "NFL", path: "football/nfl", q: "" },
  { key: "NBA", path: "basketball/nba", q: "" },
  { key: "CFB", path: "football/college-football", q: "&groups=80" },
  { key: "CBB", path: "basketball/mens-college-basketball", q: "&groups=50" },
  { key: "MLB", path: "baseball/mlb", q: "" }
];

function today() {
  // YYYYMMDD in Pacific time. Change the zone if you live elsewhere.
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return p.replace(/-/g, "");
}

function rank(s) { return { yes: 3, maybe: 2, no: 1, unk: 0 }[s]; }

function classifyName(n) {
  if (S.no.some(r => r.test(n))) return "no";
  if (S.yes.some(r => r.test(n))) return "yes";
  return "maybe";
}

function classify(names) {
  if (!names.length) return "unk";
  return names.map(classifyName).sort((a, b) => rank(b) - rank(a))[0];
}

function networks(comp) {
  const out = new Set();
  (comp.geoBroadcasts || []).forEach(b => { const n = b.media && (b.media.shortName || b.media.name); if (n) out.add(n); });
  (comp.broadcasts || []).forEach(b => (b.names || []).forEach(n => out.add(n)));
  return [...out];
}

function team(c) {
  const t = c.team || {};
  return { name: t.shortDisplayName || t.displayName || t.name || "TBD", abbr: t.abbreviation || "", logo: t.logo || "", score: c.score != null ? c.score : null };
}

async function league(L, date) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${L.path}/scoreboard?dates=${date}&limit=400${L.q}`;
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(L.key + " " + r.status);
  const j = await r.json();
  return (j.events || []).map(e => {
    const comp = (e.competitions || [])[0] || {};
    const cs = comp.competitors || [];
    const home = cs.find(c => c.homeAway === "home") || cs[0] || {};
    const away = cs.find(c => c.homeAway === "away") || cs[1] || {};
    const names = networks(comp);
    const st = (e.status && e.status.type) || {};
    return {
      id: e.id, league: L.key, start: e.date, state: st.state || "pre", detail: st.shortDetail || "",
      away: team(away), home: team(home), networks: names,
      free: names.some(n => S.freeNames.some(r => r.test(n))),
      status: classify(names)
    };
  });
}

module.exports = async (req, res) => {
  const date = /^\d{8}$/.test((req.query && req.query.date) || "") ? req.query.date : today();
  const results = await Promise.allSettled(LEAGUES.map(L => league(L, date)));
  const games = [], errors = [];
  results.forEach((r, i) => r.status === "fulfilled" ? games.push(...r.value) : errors.push(LEAGUES[i].key));
  games.sort((a, b) => new Date(a.start) - new Date(b.start));
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
  res.status(200).json({ date, generatedAt: new Date().toISOString(), games, errors });
};
