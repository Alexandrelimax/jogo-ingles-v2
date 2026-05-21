import { Component, OnInit, output, inject, computed, effect, untracked } from '@angular/core';
import { HangmanService, HANGMAN_MAX_WRONG } from '../../services/hangman.service';

const KEYBOARD_ROWS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'ZXCVBNM'.split(''),
];

@Component({
  selector: 'app-hangman',
  imports: [],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss'
})
export class Hangman implements OnInit {
  readonly quit = output<void>();
  readonly hs = inject(HangmanService);

  readonly keyboardRows = KEYBOARD_ROWS;
  readonly maxWrong = HANGMAN_MAX_WRONG;

  readonly letterState = computed(() => {
    const guessed = this.hs.guessedLetters();
    const word = this.hs.currentWord()?.word ?? '';
    return (letter: string): 'correct' | 'wrong' | 'unused' => {
      if (!guessed.has(letter)) return 'unused';
      return word.includes(letter) ? 'correct' : 'wrong';
    };
  });

  private resultHandled = false;

  constructor() {
    // Fires when words finish loading (or immediately on re-entry when already loaded)
    effect(() => {
      if (this.hs.isLoaded() && !this.hs.currentWord()) {
        untracked(() => this.loadNext());
      }
    });
  }

  ngOnInit(): void {
    this.hs.reset();
    if (this.hs.isLoaded()) {
      this.loadNext();
    } else {
      this.hs.loadWords();
    }
  }

  private loadNext(): void {
    this.resultHandled = false;
    this.hs.nextWord();
  }

  guess(letter: string): void {
    if (this.hs.isOver()) return;
    this.hs.guessLetter(letter);
    if (this.hs.isOver() && !this.resultHandled) {
      this.resultHandled = true;
      this.hs.confirmResult();
    }
  }

  next(): void {
    this.loadNext();
  }
}
