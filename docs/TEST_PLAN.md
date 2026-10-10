# Test plan — Tic-Tac-Toe

## Scope
Browser game for two players on one device (desktop and mobile web).

**In scope:** game rules, turn order, win / draw detection, rounds, score saving, mobile layout.
**Out of scope:** AI opponent, online multiplayer, sound (not implemented).

## Test types
| Type | How |
|---|---|
| Functional | Manual checklist below + Playwright autotests |
| Regression | Full Playwright suite on every push (GitHub Actions) |
| Compatibility | Desktop Chrome + mobile emulation (Pixel 7) in Playwright; manual check on a real Android device |
| Exploratory | Short sessions: fast clicks, double taps, reload in the middle of a round |

## Checklist (manual)

### Core gameplay
- [ ] Board is empty on start, status shows "Player X's turn"
- [ ] X always moves first in a new round
- [ ] Players alternate after each valid move
- [ ] An occupied cell cannot be changed (click, double click, fast taps)
- [ ] Win is detected for all 8 lines (3 rows, 3 columns, 2 diagonals) for both X and O
- [ ] Winning line is highlighted
- [ ] After a win the board is locked
- [ ] Win on the 9th move counts as a win, not a draw
- [ ] Full board without a line is a draw

### Rounds & save data
- [ ] "New round" clears the board and keeps the score
- [ ] Score is restored after page reload
- [ ] "Reset score" sets X / O / Draws to 0 and survives reload
- [ ] Corrupted save in localStorage does not break the game (score falls back to 0)

### Mobile & interruptions
- [ ] Layout fits a phone screen in portrait without horizontal scroll
- [ ] Taps register correctly, no double moves on a fast double tap
- [ ] Minimize / restore the browser mid-round — state is kept
- [ ] Lock / unlock the screen mid-round — state is kept
- [ ] Rotate the device — board stays usable

## Bug report template
```
Title:        [Area] Short description of the problem
Environment:  Device / OS / Browser + version / build or commit
Preconditions:
Steps:        1. ...  2. ...  3. ...
Expected:
Actual:
Severity:     Blocker / Critical / Major / Minor / Trivial
Attachments:  screenshot, video, console log / adb logcat
```

## Traceability
Autotest IDs (`TC-01`…`TC-13`) in [`tests/game.spec.ts`](../tests/game.spec.ts) match the checks above.
