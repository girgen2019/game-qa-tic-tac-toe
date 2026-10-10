import { expect, type Locator, type Page } from '@playwright/test';

export class GamePage {
  readonly status: Locator;
  readonly restartButton: Locator;
  readonly resetScoreButton: Locator;
  readonly scoreX: Locator;
  readonly scoreO: Locator;
  readonly scoreDraw: Locator;

  constructor(private readonly page: Page) {
    this.status = page.getByTestId('status');
    this.restartButton = page.getByTestId('restart');
    this.resetScoreButton = page.getByTestId('reset-score');
    this.scoreX = page.getByTestId('score-x');
    this.scoreO = page.getByTestId('score-o');
    this.scoreDraw = page.getByTestId('score-draw');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.status).toBeVisible();
  }

  cell(index: number): Locator {
    return this.page.getByTestId(`cell-${index}`);
  }

  /** Clicks cells in the given order; players alternate starting with X. */
  async play(moves: number[]) {
    for (const index of moves) {
      await this.cell(index).click();
    }
  }

  async expectBoard(expected: string[]) {
    for (let i = 0; i < 9; i++) {
      await expect(this.cell(i)).toHaveText(expected[i]);
    }
  }
}
