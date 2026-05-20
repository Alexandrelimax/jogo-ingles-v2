export interface GameModeConfig {
  id: string;
  label: string;
  description: string;
  icon: string;
  lives: number;
  timerEnabled: boolean;
  questionTime: number;
  endless: boolean;
  showExplanation: boolean;
  comboEnabled: boolean;
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'classic',
    label: 'CLASSIC',
    description: 'Timer normal • 5 vidas • Explicações habilitadas',
    icon: '🎮',
    lives: 5,
    timerEnabled: true,
    questionTime: 15,
    endless: false,
    showExplanation: true,
    comboEnabled: true,
  },
  {
    id: 'speed',
    label: 'SPEED',
    description: '5 segundos por pergunta • Rápido e intenso',
    icon: '⚡',
    lives: 5,
    timerEnabled: true,
    questionTime: 5,
    endless: false,
    showExplanation: false,
    comboEnabled: true,
  },
  {
    id: 'survival',
    label: 'SURVIVAL',
    description: 'Apenas 1 vida • Perguntas infinitas • Sem timer',
    icon: '💀',
    lives: 1,
    timerEnabled: false,
    questionTime: 0,
    endless: true,
    showExplanation: false,
    comboEnabled: true,
  },
  {
    id: 'hardcore',
    label: 'HARDCORE',
    description: '8s por pergunta • Um erro = game over • Sem dicas',
    icon: '🔥',
    lives: 1,
    timerEnabled: true,
    questionTime: 8,
    endless: false,
    showExplanation: false,
    comboEnabled: false,
  },
  {
    id: 'practice',
    label: 'PRACTICE',
    description: 'Vidas infinitas • Sem pressão • Explicações habilitadas',
    icon: '📚',
    lives: 999,
    timerEnabled: false,
    questionTime: 0,
    endless: false,
    showExplanation: true,
    comboEnabled: false,
  },
];
