import { Component, output } from '@angular/core';
import { GameModeConfig, GAME_MODES } from '../../models/game-mode.model';

@Component({
  selector: 'app-mode-select',
  imports: [],
  templateUrl: './mode-select.html',
  styleUrl: './mode-select.scss'
})
export class ModeSelect {
  readonly modeSelected = output<GameModeConfig>();
  readonly back = output<void>();

  readonly modes = GAME_MODES;
  hoveredId: string | null = null;

  select(mode: GameModeConfig): void {
    this.modeSelected.emit(mode);
  }

  goBack(): void {
    this.back.emit();
  }
}
