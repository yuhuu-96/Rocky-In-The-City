# Rocky In The City – Seismic Run

A browser-based endless runner game featuring Rocky, the stone golem mascot of Seismic.

## Play
Open `index.html` in your browser, or host on GitHub Pages.

## How to Play
- **SPACE / UP Arrow** – Jump
- **DOWN Arrow** – Duck
- **Tap** – Jump (mobile)
- Collect glowing gems (+20 pts each)
- Dodge buildings and UFOs
- Speed increases over time!

## Project Structure
```
SeismicGame/
+-- index.html        # Main entry point
+-- assets/
¦   +-- Rocky.png     # Rocky character
¦   +-- batu.png      # Gem collectible
+-- css/
¦   +-- style.css     # All styles
+-- js/
¦   +-- rocky.js      # Rocky golem canvas drawing + animation
¦   +-- main.js       # State, login, leaderboard
¦   +-- game.js       # Game engine, physics, rendering
+-- README.md
```

## Features
- Google sign-in (simulated popup)
- Persistent leaderboard (localStorage)
- Natural walk animation that speeds up with gameplay
- Rocky drawn as a stone golem with arm/leg swing animation
- City background with parallax buildings
- UFO obstacles with animated lights
- Gem collectibles (batu.png)
- Mobile touch support

## Credits
Built by [@0xyuhuu96](https://x.com/0xyuhuu96) · [Discord: yuhuu96](https://discord.com/users/yuhuu96)

Powered by [Seismic](https://discord.gg/seismic)
