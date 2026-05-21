import { Component, input } from '@angular/core';

@Component({
  selector: 'app-mode-icon',
  imports: [],
  templateUrl: './mode-icon.html',
})
export class ModeIcon {
  readonly modeId = input.required<string>();
}
