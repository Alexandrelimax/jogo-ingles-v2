import { Component, inject, output, OnInit } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { StorageService } from '../../services/storage.service';
import { QuizService } from '../../services/quiz.service';
import { HighScore } from '../../models/question.model';

@Component({
  selector: 'app-game-over',
  imports: [],
  templateUrl: './game-over.html',
  styleUrl: './game-over.scss'
})
export class GameOver implements OnInit {
  readonly restart = output<void>();

  readonly gs = inject(GameStateService);
  readonly quiz = inject(QuizService);
  private storage = inject(StorageService);

  highScores: HighScore[] = [];
  rank = 0;

  ngOnInit(): void {
    this.highScores = this.storage.getHighScores();
    this.rank = this.storage.lastRank;
  }

  onRestart(): void {
    this.restart.emit();
  }
}
