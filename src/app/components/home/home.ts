import { Component, output, inject, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  readonly startGame = output<void>();

  private storage = inject(StorageService);

  bestScore = 0;
  glitchActive = false;
  private glitchInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.bestScore = this.storage.getBestScore();
    this.glitchInterval = setInterval(() => {
      this.glitchActive = true;
      setTimeout(() => (this.glitchActive = false), 200);
    }, 3500);
  }

  ngOnDestroy(): void {
    if (this.glitchInterval) clearInterval(this.glitchInterval);
  }

  start(): void {
    this.startGame.emit();
  }
}
