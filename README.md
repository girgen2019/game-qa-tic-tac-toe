# 🎮 Game QA: Tic-Tac-Toe

[![Tests](https://github.com/girgen2019/game-qa-tic-tac-toe/actions/workflows/tests.yml/badge.svg)](https://github.com/girgen2019/game-qa-tic-tac-toe/actions/workflows/tests.yml)

A small pet project for practicing **game testing**: a simple browser game, test documentation and Playwright autotests that run on desktop and mobile emulation in CI.

▶️ **Play:** https://girgen2019.github.io/game-qa-tic-tac-toe/

## What's inside
| Part | Description |
|---|---|
| Game | Tic-Tac-Toe for two players: turns, win / draw detection, rounds, score saved in `localStorage` |
| [Test plan & checklist](docs/TEST_PLAN.md) | Scope, test types, manual checklist (gameplay, save data, mobile & interruptions), bug report template |
| [Autotests](tests/game.spec.ts) | 20 Playwright tests × 2 projects (Desktop Chrome, Pixel 7) with a Page Object |
| [CI](.github/workflows/tests.yml) | GitHub Actions runs the full suite on every push and uploads the HTML report |

## What is tested
- Turn order and blocking of occupied cells
- All 8 winning lines, O win, win on the last move vs draw
- Board lock after a win
- New round / reset score
- Save data: score restored after reload, corrupted save handled gracefully
- Mobile viewport (Pixel 7 emulation)

## Run locally
```bash
npm install
npx playwright install chromium
npm test            # all tests
npm run test:mobile # mobile emulation only
npm run report      # open HTML report
```

## Stack
`JavaScript` `TypeScript` `Playwright` `GitHub Actions` `GitHub Pages`
