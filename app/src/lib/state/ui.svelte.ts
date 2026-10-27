import { vibe } from '@rokkit/states';
// UI chrome state: theme mode lives here, presentation only emits the toggle event.
export class UiState {
  get dark() { return vibe.mode === 'dark'; }
  toggleMode() { vibe.mode = this.dark ? 'light' : 'dark'; }
}
