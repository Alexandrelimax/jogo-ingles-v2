import { Component, input, output, computed } from '@angular/core';
import { GameModeConfig } from '../../models/game-mode.model';

export interface RuleItem {
  symbol: string;
  text: string;
  warn?: boolean;
}

@Component({
  selector: 'app-game-intro',
  imports: [],
  templateUrl: './game-intro.html',
  styleUrl: './game-intro.scss'
})
export class GameIntro {
  readonly mode = input.required<GameModeConfig>();
  readonly startGame = output<void>();
  readonly back = output<void>();

  readonly modeColor = computed(() => {
    const map: Record<string, string> = {
      classic:  '#E83020',
      speed:    '#F8C020',
      survival: '#484858',
      hardcore: '#C84800',
      practice: '#18A018',
    };
    return map[this.mode().id] ?? '#E83020';
  });

  readonly rules = computed((): RuleItem[] => {
    const m = this.mode();
    const items: RuleItem[] = [];

    if (m.lives >= 999) {
      items.push({ symbol: '∞', text: 'Vidas infinitas — erros não terminam o jogo' });
    } else if (m.lives === 1) {
      items.push({ symbol: '♥', text: '1 vida — qualquer erro ou timeout = game over', warn: true });
    } else {
      items.push({ symbol: `♥×${m.lives}`, text: `${m.lives} vidas — cada erro ou timeout remove 1` });
    }

    if (m.timerEnabled) {
      items.push({
        symbol: '⏱',
        text: `${m.questionTime}s por pergunta — tempo esgotado conta como erro`,
        warn: m.questionTime <= 8
      });
      items.push({ symbol: '★', text: 'Resposta rápida vale mais XP (bônus de até 2×)' });
    } else {
      items.push({ symbol: '—', text: 'Sem timer — responda no seu ritmo' });
    }

    if (m.comboEnabled) {
      items.push({ symbol: '🔥', text: 'Acertos seguidos ativam multiplicador: ×2 (3), ×3 (5), ×5 (8+)' });
    }

    if (m.showExplanation) {
      items.push({ symbol: '💡', text: 'Dica explicativa exibida após cada erro ou timeout' });
    }

    if (m.endless) {
      items.push({ symbol: '♾', text: 'Modo infinito — tente alcançar o score mais alto' });
    }

    return items;
  });
}
