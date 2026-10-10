import { test, expect } from '@playwright/test';
import { GamePage } from './pages/GamePage';

const WIN_LINES = [
  { name: 'top row', line: [0, 1, 2], filler: [3, 4] },
  { name: 'middle row', line: [3, 4, 5], filler: [0, 1] },
  { name: 'bottom row', line: [6, 7, 8], filler: [0, 1] },
  { name: 'left column', line: [0, 3, 6], filler: [1, 2] },
  { name: 'middle column', line: [1, 4, 7], filler: [0, 2] },
  { name: 'right column', line: [2, 5, 8], filler: [0, 1] },
  { name: 'main diagonal', line: [0, 4, 8], filler: [1, 2] },
  { name: 'anti-diagonal', line: [2, 4, 6], filler: [0, 1] },
];

let game: GamePage;

test.beforeEach(async ({ page }) => {
  game = new GamePage(page);
  await game.open();
});

test.describe('Start of the game', () => {
  test('TC-01 board is empty and X moves first', async () => {
    await game.expectBoard(Array(9).fill(''));
    await expect(game.status).toHaveText("Player X's turn");
  });

  test('TC-02 score starts at zero', async () => {
    await expect(game.scoreX).toHaveText('0');
    await expect(game.scoreO).toHaveText('0');
    await expect(game.scoreDraw).toHaveText('0');
  });
});

test.describe('Turns', () => {
  test('TC-03 players alternate turns', async () => {
    await game.cell(0).click();
    await expect(game.cell(0)).toHaveText('X');
    await expect(game.status).toHaveText("Player O's turn");

    await game.cell(4).click();
    await expect(game.cell(4)).toHaveText('O');
    await expect(game.status).toHaveText("Player X's turn");
  });

  test('TC-04 occupied cell cannot be overwritten', async () => {
    await game.cell(0).click();
    await expect(game.cell(0)).toBeDisabled();
    await game.cell(0).click({ force: true });

    await expect(game.cell(0)).toHaveText('X');
    await expect(game.status).toHaveText("Player O's turn");
  });
});

test.describe('Win conditions', () => {
  for (const { name, line, filler } of WIN_LINES) {
    test(`TC-05 X wins by ${name}`, async () => {
      // X takes the line, O plays filler cells in between
      await game.play([line[0], filler[0], line[1], filler[1], line[2]]);

      await expect(game.status).toHaveText('Player X wins!');
      await expect(game.scoreX).toHaveText('1');
      for (const i of line) await expect(game.cell(i)).toHaveClass(/win/);
    });
  }

  test('TC-06 O can win', async () => {
    await game.play([0, 3, 1, 4, 8, 5]);

    await expect(game.status).toHaveText('Player O wins!');
    await expect(game.scoreO).toHaveText('1');
  });

  test('TC-07 board is locked after a win', async () => {
    await game.play([0, 3, 1, 4, 2]);

    for (const i of [5, 6, 7, 8]) await expect(game.cell(i)).toBeDisabled();
    await game.cell(8).click({ force: true });
    await expect(game.cell(8)).toHaveText('');
  });

  test('TC-08 last move that completes a line is a win, not a draw', async () => {
    // X O X / O O X / O X X — X wins on the 9th move by the right column
    await game.play([0, 1, 2, 3, 5, 4, 7, 6, 8]);

    await expect(game.status).toHaveText('Player X wins!');
    await expect(game.scoreDraw).toHaveText('0');
  });
});

test.describe('Draw', () => {
  test('TC-09 full board without a winner is a draw', async () => {
    // X O X / X O O / O X X
    await game.play([0, 1, 2, 4, 3, 5, 7, 6, 8]);

    await expect(game.status).toHaveText("It's a draw!");
    await expect(game.scoreDraw).toHaveText('1');
  });
});

test.describe('Rounds and score', () => {
  test('TC-10 new round clears the board and keeps the score', async () => {
    await game.play([0, 3, 1, 4, 2]);
    await game.restartButton.click();

    await game.expectBoard(Array(9).fill(''));
    await expect(game.status).toHaveText("Player X's turn");
    await expect(game.scoreX).toHaveText('1');
  });

  test('TC-11 score is saved after page reload', async ({ page }) => {
    await game.play([0, 3, 1, 4, 2]);
    await page.reload();

    await expect(game.scoreX).toHaveText('1');
  });

  test('TC-12 reset score sets all counters to zero', async ({ page }) => {
    await game.play([0, 3, 1, 4, 2]);
    await game.resetScoreButton.click();
    await page.reload();

    await expect(game.scoreX).toHaveText('0');
    await expect(game.scoreO).toHaveText('0');
    await expect(game.scoreDraw).toHaveText('0');
  });

  test('TC-13 corrupted save does not break the game', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('ttt-score', '{not valid json'));
    await page.reload();

    await expect(game.scoreX).toHaveText('0');
    await game.cell(0).click();
    await expect(game.cell(0)).toHaveText('X');
  });
});
