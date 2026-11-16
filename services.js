// EDIT THIS FILE to match what you can watch. Each pattern is tested against a network name
// from the schedule (for example "ESPN2", "Peacock", "BTN"). Case-insensitive.
// A game's badge is the best match across all its networks: yes > maybe > no.

module.exports = {
  // Your Spectrum Stream TV Pro plan, ESPN Unlimited, Fox One, Peacock, Prime Video
  yes: [
    /\bESPN/i, /\bABC\b/i, /\bNBC\b/i, /NBCSN/i, /\bCBS/i, /\bFOX\b/i, /\bFS1\b/i, /\bFS2\b/i,
    /Fox One/i, /Peacock/i, /Prime/i, /Amazon/i, /Paramount/i, /Tubi/i,
    /\bSEC ?N/i, /SEC Network/i, /\bACC ?N/i, /ACC Network/i, /\bBTN\b/i, /Big Ten Network/i,
    /YouTube/i
  ],
  // Services you don't have
  no: [
    /DAZN/i, /B1G\+/i, /Big Ten\+/i, /League Pass/i, /MW\+/i, /NFL\+/i, /NEC Front Row/i,
    /Summit League/i, /Mountain West/i
  ],
  // Anything else (regional sports networks, local affiliates, etc.) shows as "Maybe"
  freeNames: [/YouTube/i] // shown with a "Free" badge
};
